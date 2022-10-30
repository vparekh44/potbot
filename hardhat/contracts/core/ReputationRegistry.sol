// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {IBadges} from "./interfaces/IBadges.sol";
import {Reputation, ReputationData} from "./libs/Structs.sol";

contract ReputationRegistry {
    mapping(uint256 => mapping(address => ReputationData))
        internal reputationsData;
    IBadges immutable BADGES;

    event ReputationsRecorded(Reputation reputations);
    

    constructor(address badgesAddress) {
        BADGES = IBadges(badgesAddress);
    }

    function recordReputations(Reputation[] memory _reputations) public {
        for (uint256 i = 0; i < _reputations.length; i++) {
            uint256 previousReputationValue = reputationsData[
                _reputations[i].repId
            ][_reputations[i].owner].value;

            reputationsData[_reputations[i].repId][
                _reputations[i].owner
            ] = ReputationData(
                _reputations[i].owner,
                _reputations[i].value,
                _reputations[i].timestamp
            );

            _triggerBadgeTransferEvent(
                _reputations[i].repId,
                _reputations[i].owner,
                previousReputationValue,
                _reputations[i].value
            );
            emit ReputationsRecorded(_reputations[i]);
        }
    }

    function _triggerBadgeTransferEvent(
    uint256 badgeTokenId,
    address owner,
    uint256 previousValue,
    uint256 newValue
  ) internal {
    bool isGreaterValue = newValue > previousValue;
    address operator = address(this);
    address from = isGreaterValue ? address(0) : owner;
    address to = isGreaterValue ? owner : address(0);
    uint256 value = isGreaterValue ? newValue - previousValue : previousValue - newValue;

    BADGES.triggerTransferEvent(operator, from, to, badgeTokenId, value);
  }

    function getReputationValue(uint256 _repId, address _owner)
        public
        view
        returns (uint256)
    {
        return reputationsData[_repId][_owner].value;
    }
}
