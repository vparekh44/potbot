// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {IReputationRegistry} from "../core/interfaces/IReputationRegistry.sol";
import {Verifier} from "../core/Verifier.sol";
import {Request, Reputation, Claim} from "../core/libs/Structs.sol";

interface LensHub {
    function ownerOf(uint256 tokenId) external returns (address);
    function getPubCount(uint256 profileId) external view returns (uint256);
}

contract LensVerifier is Verifier {
    LensHub immutable LENS_HUB;


    struct LensProofData {
        uint256 profileId;
    }

    constructor(address _reputationRegistry, address _karmaTokenManager, address _identity, uint256 _karmaTokenAmount, address _lensHub)
        Verifier(_reputationRegistry, _karmaTokenManager, _identity)
    {
        LENS_HUB = LensHub(_lensHub);
        karmaTokenAmount = _karmaTokenAmount;
    }

    function _verifyRequest(
        Request calldata _request,
        bytes calldata _proofData
    ) internal virtual override {
        LensProofData memory lensProofData = abi.decode(
            _proofData,
            (LensProofData)
        );
        Claim memory claim = _request.claims[0];

        address owner = LENS_HUB.ownerOf(lensProofData.profileId);
        require(owner == _request.destination, "Destination wallet not owner of Lens id");

        uint256 pubCount = LENS_HUB.getPubCount(lensProofData.profileId);
        require(claim.claimedValue == pubCount, "Invalid claim value");
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
