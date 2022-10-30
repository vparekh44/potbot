// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IIdentity {
    function getIdForOwnerUsingProvider(string memory _pName, address _owner) external view returns(uint256);
}
