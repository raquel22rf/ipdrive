// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IPDrive {

    mapping(address => bool) accounts;
    uint private monthly_value;

    constructor(uint _value){
        monthly_value = _value;
    }

    event SubscriptionMade(address account);
    event MonthlyPaymentMade(address account);

    function subscribe() external payable {
        address new_subscriber = msg.sender;
        require(!accounts[new_subscriber], "Account already subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        accounts[new_subscriber] = true;
        emit SubscriptionMade(new_subscriber);
    }

    function payMonthlyValue() external payable {
        address new_subscriber = msg.sender;
        require(accounts[new_subscriber], "Account not subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        emit MonthlyPaymentMade(new_subscriber);
    }

}