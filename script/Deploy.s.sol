// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/HealFund.sol";

contract DeployHealFund is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new HealFund();
        vm.stopBroadcast();
    }
}
