// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IPDrive {

    mapping(address => bool) accounts;
    uint private monthly_value;
    address private owner;
    uint contract_balance;

    constructor(uint _value){
        monthly_value = _value;
        owner = msg.sender;
        contract_balance = 0;
    }

    event SubscriptionMade(address account);
    event MonthlyPaymentMade(address account);

    function subscribe() external payable {
        address new_subscriber = msg.sender;
        require(!accounts[new_subscriber], "Account already subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        accounts[new_subscriber] = true;
        contract_balance += monthly_value;
        emit SubscriptionMade(new_subscriber);
    }

    function payMonthlyValue() external payable {
        address new_subscriber = msg.sender;
        require(accounts[new_subscriber], "Account not subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        contract_balance += monthly_value;
        emit MonthlyPaymentMade(new_subscriber);
    }

    function withdraw(uint value) external {
        require(msg.sender == owner, "Address is not the owner");
        require(value <= contract_balance, "Value higher than balance.");

        contract_balance -= value;
        (bool success, ) = owner.call{value: value}("");
        require(success, "There was an error!");
    }

}