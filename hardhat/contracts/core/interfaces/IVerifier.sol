// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {Request} from "../libs/Structs.sol";
interface IVerifier {
  function _verifyRequest(Request calldata request, bytes calldata proofData) external;
}