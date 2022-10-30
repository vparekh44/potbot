// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import {IReputationRegistry} from "../core/interfaces/IReputationRegistry.sol";
import {Verifier} from "../core/Verifier.sol";
import {Request, Reputation, Claim, EIP712Signature} from "../core/libs/Structs.sol";

contract SignatureVerifier is Verifier, EIP712 {
    error SignatureDeadlineExpired(uint256 deadline);
    error SignatureInvalid(address expectedSigner, address signer);
    address verifier;
    bytes32 private constant REPUTATION_REQUEST_TYPEHASH =
        keccak256(
            "ReputationRequest(uint256 repId,uint256 claimedValue,address destination,uint256 deadline)"
        );

    constructor(
        address _reputationRegistry,
        address _karmaTokenManager,
        address _identity,
        uint256 _karmaTokenAmount,
        address _verifier
    )
        Verifier(_reputationRegistry, _karmaTokenManager, _identity)
        EIP712("SignatureVerifier", "1")
    {
        karmaTokenAmount = _karmaTokenAmount;
        verifier = _verifier;
    }

    function _verifyRequest(
        Request calldata _request,
        bytes calldata _proofData
    ) internal virtual override {
        EIP712Signature memory sig = abi.decode(_proofData, (EIP712Signature));
        if (sig.deadline < block.timestamp) {
            revert SignatureDeadlineExpired(sig.deadline);
        }
        bytes32 structHash = keccak256(
            abi.encode(
                REPUTATION_REQUEST_TYPEHASH,
                _request.claims[0].repId,
                _request.claims[0].claimedValue,
                _request.destination,
                sig.deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, sig.v, sig.r, sig.s);
        if (signer != verifier) {
            revert SignatureInvalid(verifier, signer);
        }

        _manageKarma(_request, _proofData);
    }

    function buildReputations(
        Request calldata _request,
        bytes calldata _proofData
    ) public view virtual override returns (Reputation[] memory) {
        Claim memory claim = _request.claims[0];

        Reputation[] memory reputations = new Reputation[](1);

        address issuer = address(this);

        reputations[0] = Reputation(
            0,
            _request.destination,
            issuer,
            claim.claimedValue,
            uint256(block.timestamp)
        );
        return (reputations);
    }
}
