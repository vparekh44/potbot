// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {IVerifier} from "./interfaces/IVerifier.sol";
import {IIdentity} from "../core/interfaces/IIdentity.sol";
import {IKarmaTokenManager} from "./interfaces/IKarmaTokenManager.sol";
import {IReputationRegistry} from "./interfaces/IReputationRegistry.sol";
import {Request, Reputation} from "./libs/Structs.sol";

abstract contract Verifier {
    IReputationRegistry internal immutable REPUTATION_REGISTRY;
    IKarmaTokenManager karmaTokenManager;
    IIdentity identityContract;
    uint256 karmaTokenAmount;

    event ReputationGenerated(Reputation reputation);
    constructor(address _reputationRegistry, address _karmaTokenManager, address _identity) {
        REPUTATION_REGISTRY = IReputationRegistry(_reputationRegistry);
        karmaTokenManager = IKarmaTokenManager(_karmaTokenManager);
        identityContract = IIdentity(_identity);
    }

    function _verifyRequest(
        Request calldata _request,
        bytes calldata _proofData
    ) internal virtual;

    function generateReputations(
        Request calldata request,
        bytes calldata proofData
    ) external returns (Reputation[] memory) {
        _verifyRequest(request, proofData);

        Reputation[] memory reputations = buildReputations(request, proofData);

        REPUTATION_REGISTRY.recordReputations(reputations);

        emit ReputationGenerated(reputations[0]);

        return reputations;
    }

    function _manageKarma(Request calldata _request, bytes calldata _proofData) internal {
        uint256 senderId = identityContract.getIdForOwnerUsingProvider("discord", msg.sender);
        uint256 receiverId = identityContract.getIdForOwnerUsingProvider("discord", _request.destination);
        require(senderId != 0, "Sender Id doesn't exists");
        if (senderId == receiverId) {
           karmaTokenManager.spendKarma(msg.sender, karmaTokenAmount);
        } else {
           karmaTokenManager.mintKarma(msg.sender, karmaTokenAmount);
        }
    }

    function buildReputations(
        Request calldata request,
        bytes calldata proofData
    ) public view virtual returns (Reputation[] memory);
}
