// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IKarmaTokenManager {
    function spendKarma(address _from, uint256 _amount) external;
    function mintKarma(address _to, uint256 _amount) external;
}
