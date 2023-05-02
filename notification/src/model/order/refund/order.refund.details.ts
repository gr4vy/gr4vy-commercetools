// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants, resolveOrderPayment } from "@gr4vy-ct/common"
import { discountedPricePerQuantity, Order } from "@gr4vy-ct/common/src/services/types"

import { OrderRefundDetailsInterface } from "../interfaces"
import { RefundMessageObject } from "../../../service/types"
import { OrderDetails } from "../order.details"

const {
  STATES: { CT },
} = Constants

export class OrderRefundDetails extends OrderDetails implements OrderRefundDetailsInterface {
  refundAmount: number

  refundObject: RefundMessageObject

  // eslint-disable-next-line
  constructor(body: any) {
    super(body)
    this.refundObject = this.requestBody?.returnInfo ?? {}
  }

  validateReturn(order: Order, refundObject: RefundMessageObject): boolean {
    // eslint-disable-next-line
    order.returnInfo.forEach((returnInfo: { items: any[] }) => {
      returnInfo.items.forEach(returnItem => {
        this.refundObject.items.find(function (refundItem) {
          if (
            refundItem.id == returnItem.id &&
            returnItem.paymentState == CT.ORDER_RETURN_PAYMENT.REFUNDED
          ) {
            throw new Error(
              "Return Items contain some items those were already refunded - " + returnItem.id
            )
          }
        })
      })
    })

    const itemsQtyAlreadyReturned: { [key: string]: number } = {}
    const itemsQtyToReturn: { [key: string]: number } = {}

    refundObject.items.forEach(returnItem => {
      if (itemsQtyToReturn[returnItem.lineItemId]) {
        itemsQtyToReturn[returnItem.lineItemId] += returnItem.quantity
      } else {
        itemsQtyToReturn[returnItem.lineItemId] = returnItem.quantity
      }
    })

    const returnItemIds: string[] = []
    refundObject.items.forEach(returnItem => {
      returnItemIds.push(returnItem.id)
    })
    order.returnInfo.forEach(function (returnInfoItem) {
      returnInfoItem.items.forEach(function (alreadyReturnedItem) {
        if (!returnItemIds.includes(alreadyReturnedItem.id)) {
          if (itemsQtyAlreadyReturned[alreadyReturnedItem.lineItemId]) {
            itemsQtyAlreadyReturned[alreadyReturnedItem.lineItemId] += alreadyReturnedItem.quantity
          } else {
            itemsQtyAlreadyReturned[alreadyReturnedItem.lineItemId] = alreadyReturnedItem.quantity
          }
        }
      })
    })

    for (const lineItemId in itemsQtyToReturn) {
      const qtyToReturn = itemsQtyToReturn[lineItemId]
      const qtyAlreadyReturned = itemsQtyAlreadyReturned[lineItemId] ?? 0
      const orderedLineItem = order.lineItems.find(lineItem => lineItem.id == lineItemId)
      const qtyOrdered = orderedLineItem ? orderedLineItem.quantity : 0
      if (qtyOrdered && qtyOrdered - qtyAlreadyReturned < qtyToReturn) {
        throw new Error(
          "Return Item contain invalid quantity - Line Item Id - " +
            lineItemId +
            ", quantity - " +
            qtyToReturn +
            ". Available quantity to return is - " +
            (qtyOrdered - qtyAlreadyReturned)
        )
      }
    }
    return true
  }
  rewriteDiscountedPricePerQuantityObject(
    lineItemId: string,
    returnId: string,
    order: Order,
    discountedPricePerQuantity: discountedPricePerQuantity[]
  ): discountedPricePerQuantity[] {
    let totalReturnedQty = 0
    order.returnInfo.forEach(function (returnInfoItem) {
      returnInfoItem.items.forEach(function (returnItem) {
        if (returnItem.id != returnId && returnItem.lineItemId == lineItemId) {
          totalReturnedQty += returnItem.quantity
        }
      })
    })
    let balanceQty = 0
    for (let i = 0; i < discountedPricePerQuantity.length; i++) {
      discountedPricePerQuantity[i].balanceQty = discountedPricePerQuantity[i].quantity
    }
    for (let i = 0; i < discountedPricePerQuantity.length; i++) {
      if (totalReturnedQty <= 0) {
        break
      }
      const discountedQty = discountedPricePerQuantity[i].quantity
      if (discountedQty >= totalReturnedQty) {
        balanceQty = discountedQty - totalReturnedQty
        totalReturnedQty = 0
      } else {
        balanceQty = 0
        totalReturnedQty -= discountedQty
      }
      discountedPricePerQuantity[i].balanceQty = balanceQty
    }
    return discountedPricePerQuantity
  }

  splitTaxOnLineItems(taxAmount: number, totalQty: number) {
    return [...Array(totalQty)].map(
      (_, i) => 0 | (taxAmount / totalQty + +(i < taxAmount % totalQty))
    )
  }
  getRefundAmount(refundObject: RefundMessageObject, order: Order): number {
    let totalRefundAmount = 0

    refundObject.items.forEach(refundItem => {
      let discountIncluded = false
      const refundItemLineItem = order.lineItems.find(
        lineItem => refundItem.lineItemId === lineItem.id
      )
      if (!refundItemLineItem) {
        throw new Error(
          "Return Items contain some items those were not part of original order - " +
            JSON.stringify(refundItem)
        )
      }
      let returnQty = refundItem.quantity
      let discountedPricePerQuantity = refundItemLineItem?.discountedPricePerQuantity
      if (
        discountedPricePerQuantity &&
        Array.isArray(discountedPricePerQuantity) &&
        discountedPricePerQuantity?.length > 0
      ) {
        discountIncluded = true
        discountedPricePerQuantity.sort(
          (a, b) => a.discountedPrice.value.centAmount - b.discountedPrice.value.centAmount
        )
        discountedPricePerQuantity = this.rewriteDiscountedPricePerQuantityObject(
          refundItemLineItem.id,
          refundItem.id,
          order,
          discountedPricePerQuantity
        )
        for (let i = 0; i < discountedPricePerQuantity.length; i++) {
          const discountedQty = discountedPricePerQuantity[i].balanceQty
          if (discountedQty <= 0) {
            continue
          }
          if (returnQty <= 0) {
            break
          }
          if (discountedQty >= returnQty) {
            totalRefundAmount +=
              discountedPricePerQuantity[i].discountedPrice.value.centAmount * returnQty
            returnQty = 0
          } else {
            totalRefundAmount +=
              discountedPricePerQuantity[i].discountedPrice.value.centAmount * discountedQty
            returnQty -= discountedQty
          }
        }
      }
      if (!discountIncluded) {
        const productDiscountPrice = refundItemLineItem?.price?.discounted?.value?.centAmount
        if (productDiscountPrice) {
          discountIncluded = true
          totalRefundAmount += productDiscountPrice * returnQty
        }
      }
      if (!discountIncluded) {
        totalRefundAmount += refundItemLineItem.price.value.centAmount * refundItem.quantity
      }
    })

    let taxIncluded = false
    order.lineItems.forEach(function (lineItem) {
      taxIncluded = lineItem.taxRate.includedInPrice
    })

    const taxAmount = order?.taxedPrice?.taxPortions[0]?.amount?.centAmount ?? 0
    if (taxIncluded || !taxAmount) {
      return totalRefundAmount
    }
    const lineItemWiseTaxSplit: { [key: string]: number[] } = {}

    order.lineItems.forEach(lineItem => {
      const totalLineItemTax =
        lineItem.taxedPrice.totalGross.centAmount - lineItem.taxedPrice.totalNet.centAmount
      const totalLineItemTaxSplit = this.splitTaxOnLineItems(totalLineItemTax, lineItem.quantity)
      lineItemWiseTaxSplit[lineItem.id] = totalLineItemTaxSplit
    })

    const currentReturnItemIds: string[] = []
    refundObject.items.forEach(refundItem => {
      currentReturnItemIds.push(refundItem.id)
    })
    order.returnInfo.forEach(function (returnInfoItem) {
      returnInfoItem.items.forEach(function (returnItem) {
        if (currentReturnItemIds.indexOf(returnItem.id) == -1) {
          order.lineItems.forEach(function (lineItem) {
            if (lineItem.id == returnItem.lineItemId && lineItemWiseTaxSplit[lineItem.id]) {
              for (let i = 1; i <= returnItem.quantity; i++) {
                lineItemWiseTaxSplit[lineItem.id].shift()
              }
            }
          })
        }
      })
    })

    refundObject.items.forEach(refundItem => {
      for (let i = 1; i <= refundItem.quantity; i++) {
        if (lineItemWiseTaxSplit[refundItem.lineItemId]) {
          const taxToAdd = lineItemWiseTaxSplit[refundItem.lineItemId].shift()
          if (taxToAdd) {
            totalRefundAmount += taxToAdd
          }
        }
      }
    })

    return totalRefundAmount
  }

  async execute() {
    const orderId = this.orderId
    const order = await super.execute()

    const validateReturn = this.validateReturn(order, this.refundObject)
    if (!validateReturn) {
      throw {
        message: `Return validaion failed`,
        statusCode: 400,
      }
    }

    const { version, totalPrice } = order
    const payment = resolveOrderPayment(order)
    return {
      orderId,
      currencyCode: totalPrice.currencyCode,
      refundAmount: this.getRefundAmount(this.refundObject, order),
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: await this.getTransactionId(order),
    }
  }
}
