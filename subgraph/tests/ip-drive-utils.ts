import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  MonthlyPaymentMade,
  SubscriptionMade
} from "../generated/IPDrive/IPDrive"

export function createMonthlyPaymentMadeEvent(
  account: Address
): MonthlyPaymentMade {
  let monthlyPaymentMadeEvent = changetype<MonthlyPaymentMade>(newMockEvent())

  monthlyPaymentMadeEvent.parameters = new Array()

  monthlyPaymentMadeEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return monthlyPaymentMadeEvent
}

export function createSubscriptionMadeEvent(
  account: Address
): SubscriptionMade {
  let subscriptionMadeEvent = changetype<SubscriptionMade>(newMockEvent())

  subscriptionMadeEvent.parameters = new Array()

  subscriptionMadeEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return subscriptionMadeEvent
}
