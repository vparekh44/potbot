// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

struct Request {
    Claim[] claims;
    address destination;
}

struct Claim {
    uint256 repId;
    uint256 claimedValue;
}

struct ReputationData {
    address verifier;
    uint256 value;
    uint256 timestamp;
}

struct Reputation {
    uint256 repId;
    address owner;
    address verifier;
    uint256 value;
    uint256 timestamp;
}
struct EIP712Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
    uint256 deadline;
}
