// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract IPDrive {

    uint private dailyValue;
    address private owner;
    uint private subscriptionIdCounter;
    mapping(uint => Subscription) subscriptions;

    struct Subscription {
        address subscriber;
        uint balance;
        uint deposit;
        uint startTime;
        bool disabled;
    }

    modifier subscriptionExists(uint256 _subscriptionId){
        require(_subscriptionId <= subscriptionIdCounter, "Subscription does not exist.");
        _;
    }

    modifier subscriberMatchesSubscription(uint _subscriptionId, address _subscriber){
        require(subscriptions[_subscriptionId].subscriber == _subscriber, "The account is not a subscriber or the subscription id does not match.");
        _;
    }

    modifier isAccountActive(uint _subscriptionId){
        require(subscriptions[_subscriptionId].disabled == false, "The account is disabled.");
        _;
    }

    modifier checkBalance(uint _balance){
        require(_balance > 0, "Deposit value must be higher than 0.");
        _;
    }

    constructor(uint _dailyValue){
        dailyValue = _dailyValue;
        owner = msg.sender;
    }

    event CreatedSubscription(uint subscriptionId, address account);
    event SubscriptionDisabled(uint subscriptionId);

    function createSubscription() 
        external
        payable 
        checkBalance(msg.value)
        returns (uint256 streamId) 
    {        
        subscriptionIdCounter += 1;
        uint256 currentSubscriptionId = subscriptionIdCounter;
                
        subscriptions[currentSubscriptionId] = Subscription({
            subscriber: msg.sender,
            balance: msg.value,
            deposit: msg.value,
            startTime: block.timestamp,
            disabled: false
        });
        
        emit CreatedSubscription(currentSubscriptionId, msg.sender);
        return currentSubscriptionId;
    }

    function balanceOf(uint _subscriptionId) 
        public 
        view 
        subscriptionExists(_subscriptionId) 
        subscriberMatchesSubscription(_subscriptionId, msg.sender)
        isAccountActive(_subscriptionId)
        returns (uint balance) 
    {
        balance = subscriptions[_subscriptionId].balance;
    }

    function subscriberWithdraw(uint _subscriptionId, uint _value) 
        external
        subscriptionExists(_subscriptionId) 
        subscriberMatchesSubscription(_subscriptionId, msg.sender)
        isAccountActive(_subscriptionId)
    {
        require(_value > 0, "Value to be withdrawn must be higher than 0.");
        subscriptions[_subscriptionId].balance -= _value;
        (bool success, ) = msg.sender.call{value: _value}("");
        require(success, "There was an error with the transfer.");
    }

    function retrieveCurrentSubscriptionValue() 
        external
    {
        require (subscriptionIdCounter > 0, "There are no subscriptions.");
        uint toTransferOwner = 0;

        for(uint8 i=0; i <= subscriptionIdCounter; i++){
            if(!subscriptions[i].disabled){
                uint numberOfDays = (block.timestamp - subscriptions[i].startTime) / (60*60*24);
                uint toBeCharged = numberOfDays * dailyValue;
                if(toBeCharged < subscriptions[i].balance){
                    subscriptions[i].disabled = true;
                    subscriptions[i].startTime = 0;
                    emit CreatedSubscription(i, msg.sender);
                } else {
                    subscriptions[i].startTime = block.timestamp;
                    subscriptions[i].balance -= toBeCharged;
                    toTransferOwner += toBeCharged;                
                }
            }
        }

        (bool success, ) = owner.call{value: toTransferOwner}("");
        require(success, "There was an error with the transfer.");
    }

    function unsubscribe(uint _subscriptionId) 
        external
        subscriberMatchesSubscription(_subscriptionId, msg.sender)
        isAccountActive(_subscriptionId)
    {
        subscriptions[_subscriptionId].disabled = true;
        if(subscriptions[_subscriptionId].balance > 0) {
            subscriptions[_subscriptionId].balance = 0;
            (bool success, ) = owner.call{value: subscriptions[_subscriptionId].balance}("");
            require(success, "There was an error with the transfer.");
        }   
    }

    function deposit(uint _subscriptionId)
        external
        payable
        checkBalance(msg.value)
        subscriberMatchesSubscription(_subscriptionId, msg.sender)
        isAccountActive(_subscriptionId)
    {
        subscriptions[_subscriptionId].balance += msg.value;
        subscriptions[_subscriptionId].deposit += msg.value;
    }

    function activateAccount(uint _subscriptionId)
        external
        payable
        checkBalance(msg.value)
        subscriberMatchesSubscription(_subscriptionId, msg.sender)
    {
        require(subscriptions[_subscriptionId].disabled == true, "This account is not disabled.");
        subscriptions[_subscriptionId].disabled = false;
        subscriptions[_subscriptionId].balance += msg.value;
        subscriptions[_subscriptionId].deposit += msg.value;
    }
}