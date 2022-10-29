// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract EmojiStates {
    uint256 totalEmojis;

    constructor() {
        console.log("gm");
    }

    function sendEmoji() public {
        totalEmojis += 1;
        console.log("%s has sent emoji!", msg.sender);
    }

    function getTotalEmojis() public view returns (uint256) {
        console.log("We have %d total reacted!", totalEmojis);
        return totalEmojis;
    }
}
