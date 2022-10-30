// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IBadges {
    function setReputationRegistry(address _reputationRegistry) external;
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function triggerTransferEvent(address operator, address from, address to, uint256 badgeTokenId, uint256 value) external;
}
