// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IPDrive {

    mapping(address => bool) accounts;
    uint private monthly_value;
    address private owner;

    constructor(uint _value){
        monthly_value = _value;
        owner = msg.sender;
    }

    event SubscriptionMade(address account);
    event MonthlyPaymentMade(address account);

    function subscribe() external payable {
        require(!accounts[msg.sender], "Account already subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        accounts[msg.sender] = true;
        emit SubscriptionMade(msg.sender);
    }

    function payMonthlyValue() external payable {
        require(accounts[msg.sender], "Account not subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        emit MonthlyPaymentMade(msg.sender);
    }

    function withdraw(uint value) external {
        require(msg.sender == owner, "Address is not the owner");
        require(value <= address(this).balance, "Value higher than balance.");

        (bool success, ) = owner.call{value: value}("");
        require(success, "There was an error!");
    }

}