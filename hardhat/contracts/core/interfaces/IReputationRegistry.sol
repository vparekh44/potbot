// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {Reputation} from "../libs/Structs.sol";
interface IReputationRegistry  {
   function getReputationValue(uint256 _repId, address owner) external view returns(uint256); 
   function recordReputations(Reputation[] memory _reputations) external;
}