// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IReputationRegistry} from "./interfaces/IReputationRegistry.sol";
import {IBadges} from "./interfaces/IBadges.sol";

contract Badges is ERC1155, AccessControl, IBadges {
    IReputationRegistry reputationRegistry;
    bytes32 public constant EVENT_TRIGGERER_ROLE =
        keccak256("EVENT_TRIGGERER_ROLE");

    error BadgesNonTransferrable();

    constructor(string memory _uri) ERC1155(_uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setReputationRegistry(address _reputationRegistry)
        external
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        reputationRegistry = IReputationRegistry(_reputationRegistry);
        _grantRole(EVENT_TRIGGERER_ROLE, _reputationRegistry);
    }

    function balanceOf(address account, uint256 id)
        public
        view
        virtual
        override(ERC1155, IBadges)
        returns (uint256)
    {
        return reputationRegistry.getReputationValue(id, account);
    }

    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
    {
        revert BadgesNonTransferrable();
    }

    /**
     * @dev Reverts, this is a non transferable ERC115 contract
     */
    function isApprovedForAll(address account, address operator)
        public
        view
        virtual
        override
        returns (bool)
    {
        revert BadgesNonTransferrable();
    }

    function triggerTransferEvent(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 value
    ) external onlyRole(EVENT_TRIGGERER_ROLE) {
        emit TransferSingle(operator, from, to, id, value);
    }

    function setUri(string memory uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(uri);
    }

    function getReputationRegistry() external view returns (address) {
        return address(reputationRegistry);
    }

    /**
     * @dev ERC165
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        revert BadgesNonTransferrable();
    }
}
