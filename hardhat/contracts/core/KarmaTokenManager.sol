// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {IKarmaToken} from "./interfaces/IKarmaToken.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract KarmaTokenManager is AccessControl {
    IKarmaToken karmaToken;
        bytes32 public constant VERIFIER_ROLE =
        keccak256("VERIFIER_ROLE");
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function spendKarma(address _from, uint256 _amount) public onlyRole(VERIFIER_ROLE) {
        karmaToken.transferFrom(_from, address(this), _amount);
    }

    function mintKarma(address _to, uint256 _amount) public onlyRole(VERIFIER_ROLE) {
        karmaToken.mint(_to, _amount);
    }

    function authorizeVerifier(address _verifier) onlyRole(DEFAULT_ADMIN_ROLE) public {
        _grantRole(VERIFIER_ROLE, _verifier);
    }

    function setKarmaToken(address _karmaToken) onlyRole(DEFAULT_ADMIN_ROLE) public {
        karmaToken = IKarmaToken(_karmaToken);
    }
}