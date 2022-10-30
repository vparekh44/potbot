// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {EIP712Signature} from "./libs/Structs.sol";

contract Identity is EIP712, ERC721 {
    using Counters for Counters.Counter;

    error SignatureDeadlineExpired(uint256 deadline);
    error SignatureInvalid(address expectedSigner, address signer);
    struct Provider {
        uint256 id;
        string username;
        string pName;
    }
    struct IdentityData {
        uint256 id;
        address walletAddress;
        Provider[] providers;
    }

    struct ProviderRequest {
        Provider[] provider;
        address destination;
    }


    bytes32 private constant _REGISTER_REQUEST_TYPEHASH =
        keccak256(
            "RegisterProviderRequest(uint256 providerId,string username,string pName,address destination,uint256 deadline)"
        );
    address public immutable VERIFIER;
    mapping(address => mapping(uint256 => IdentityData)) public identities;
    mapping(uint256 => address) public providerIdToOwner;
    mapping(string => mapping(address => uint256)) public providerToOwnerToId;
    Counters.Counter private _tokenIdCounter;
    IdentityData identityData;

    constructor(address _verifier) EIP712("Identity", "1") ERC721("Identity", "IDNT") {
        VERIFIER = _verifier;
    }

    function registerProviderAndCreateIdentity(
        ProviderRequest calldata _request,
        bytes calldata _proofData
    ) public {
        _verifyRegisterProviderRequest(_request, _proofData);

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(_request.destination, tokenId);


        IdentityData storage idData = identities[_request.destination][tokenId];
        idData.id = tokenId;
        idData.walletAddress = _request.destination;
        idData.providers.push(Provider(_request.provider[0].id, _request.provider[0].username, _request.provider[0].pName));
        providerIdToOwner[_request.provider[0].id] = _request.destination;
        providerToOwnerToId[_request.provider[0].pName][_request.destination] = tokenId;
    }

    function _verifyRegisterProviderRequest(
        ProviderRequest calldata _request,
        bytes calldata _proofData
    ) internal view {
        EIP712Signature memory sig = abi.decode(_proofData, (EIP712Signature));
        if (sig.deadline < block.timestamp) {
            revert SignatureDeadlineExpired(sig.deadline);
        }
        bytes32 structHash = keccak256(
            abi.encode(
                _REGISTER_REQUEST_TYPEHASH,
                _request.provider[0].id,
                keccak256(bytes(_request.provider[0].username)),
                keccak256(bytes(_request.provider[0].pName)),
                _request.destination,
                sig.deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, sig.v, sig.r, sig.s);
        if (signer != VERIFIER) {
            revert SignatureInvalid(VERIFIER, signer);
        }
    }

    function getIdForOwnerUsingProvider(string memory _pName, address _owner) public view returns(uint256) {
        return providerToOwnerToId[_pName][_owner];
    }

}
