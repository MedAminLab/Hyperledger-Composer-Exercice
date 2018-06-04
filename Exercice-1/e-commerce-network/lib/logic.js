/**
 * create an order to purchase
 * @param {org.acme.sintegralabsbc.CreateOrder} purchase - the order to be processed
 * @transaction
 */
function CreateOrder(purchase) {
    purchase.order.buyer = purchase.buyer;
    purchase.order.seller= purchase.seller;
    purchase.order.amount = purchase.amount;
    purchase.order.createdDate = new Date().toISOString();
    purchase.order.status = "Order_Created";
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}
/**
 * Record a request to purchase
 * @param {org.acme.sintegralabsbc.Buy} purchase - the order to be processed
 * @transaction
 */
function Buy(purchase) {
    
    if (purchase.order.status != "Order_Created"){
    	throw new Error("your order is not created");
    } 
    purchase.order.financeco = purchase.financeco;
  
    purchase.order.buyer.balance -= purchase.order.amount;
    purchase.order.financeco.balance += purchase.order.amount;
    
    purchase.order.boughtDate = new Date().toISOString();
    purchase.order.status = "Purchased";
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        }).then(function () {
            return getParticipantRegistry('org.acme.sintegralabsbc.Buyer')
        }).then (function (buyerRegistry) {
            return buyerRegistry.update(purchase.order.buyer);
        }).then(function () {
            return getParticipantRegistry('org.acme.sintegralabsbc.FinanceCo')
        }).then (function (financeCoRegistry) {
            return financeCoRegistry.update(purchase.order.financeco);
        });
}
 /**
 * Record a request for payment by the seller
 * @param {org.acme.sintegralabsbc.RequestPayment} purchase - the order to be processed
 * @transaction
 */
function RequestPayment(purchase) {
    
    if (purchase.order.status != "Purchased"){
    	throw new Error("your order is not purchased");
    } 
    /*if (purchase.seller != purchase.order.seller){
    	throw new Error("this order is for another seller");
    }*/
    purchase.order.status = "Payment_Requested";
    purchase.order.paymentRequestedDate = new Date().toISOString();
    
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}
 /**
 * Record a payment to the seller
 * @param {org.acme.sintegralabsbc.Pay} purchase - the order to be processed
 * @transaction
 */
function Pay(purchase) {
    
    if (purchase.order.status != "Payment_Requested"){
    	throw new Error("your payment is not requested");
    } 
     purchase.order.financeco.balance -= purchase.order.amount;
     purchase.order.seller.balance += purchase.order.amount;
     purchase.order.status = "Paid";
     purchase.order.paidDate = new Date().toISOString();
    
  
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        }).then(function () {
            return getParticipantRegistry('org.acme.sintegralabsbc.FinanceCo')
        }).then (function (financeCoRegistry) {
            return financeCoRegistry.update(purchase.order.financeco);
        }).then(function () {
            return getParticipantRegistry('org.acme.sintegralabsbc.Seller')
        }).then (function (sellerCoRegistry) {
            return sellerCoRegistry.update(purchase.order.seller);
        });
}


/**
 * Record a request to ship by supplier to shipper
 * @param {org.acme.sintegralabsbc.RequestShipping} purchase - the order to be processed
 * @transaction
 */
function RequestShipping(purchase) {
if (purchase.order.status != "Paid"){
    	throw new Error("Seller is not Paid");
    } 
    purchase.order.requestShipmentDate = new Date().toISOString();
    purchase.order.status = "Shipment_Requested";
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}
/**
 * Record a delivery by shipper
 * @param {org.acme.sintegralabsbc.Deliver} purchase - the order to be processed
 * @transaction
 */
function Deliver(purchase) {
    if (purchase.order.status != "Shipment_Requested"){
    	throw new Error("your shippment is not requested");
    } 
    purchase.order.shipper = purchase.shipper;
    purchase.order.deliveredDate = new Date().toISOString();
    purchase.order.status = "Delivered";
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        }).then(function () {
            return getParticipantRegistry('org.acme.sintegralabsbc.Shipper')
        }).then (function (shipperRegistry) {
            return shipperRegistry.update(purchase.order.shipper);
    })
}
/**
 * Record a dispute by the buyer
 * @param {org.acme.sintegralabsbc.Dispute} purchase - the order to be processed
 * @transaction
 */
function Dispute(purchase) {
      if (purchase.order.status != "Delivered"){
    	throw new Error("object is not Delivered");
      } 
        purchase.order.status = "Dispute";
        purchase.order.disputeMsg = purchase.dispute;
        purchase.order.disputeOpened = new Date().toISOString();
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}

/**
 * Record a dispute by the buyer
 * @param {org.acme.sintegralabsbc.Dispute2} purchase - the order to be processed
 * @transaction
 */
function Dispute2(purchase) {
        purchase.order.status = "Dispute";
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}

/**
 * Resolve a seller initiated dispute
 * exchange or Refund
 * @param {org.acme.sintegralabsbc.ResolveForExchange} purchase - the order to be processed
 * @transaction
 */
function ResolveForExchange(purchase) {
  		if (purchase.order.status != "Dispute"){
    	throw new Error("object is not Disputed");
        }
        purchase.order.status = "ToExchange";
        purchase.order.disputeResolved = new Date().toISOString();
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
  }
/**
 * @param {org.acme.sintegralabsbc.Exchange} purchase - the order to be processed
 * @transaction
 */
function Exchange(purchase) {
        if (purchase.order.status != "ToExchange"){
    	throw new Error("object is not for Exchange");
        }
        purchase.order.status = "Exchange";
        purchase.order.exchangeDate = new Date().toISOString();
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}

/**
 * Resolve a seller initiated dispute
 * exchange or Refund
 * @param {org.acme.sintegralabsbc.ResolveForRefund} purchase - the order to be processed
 * @transaction
 */
function ResolveForRefund(purchase) {
  	
  }
/**
 * @param {org.acme.sintegralabsbc.Refund} purchase - the order to be processed
 * @transaction
 */
function Refund(purchase) {
      
}
 /**
 * Record a request for refund by the buyer
 * @param {org.acme.sintegralabsbc.RequestRefund} purchase - the order to be processed
 * @transaction
 */
function RequestRefund(purchase) {
   
}
 /**
 * Record a refund to the buyer
 * @param {org.acme.sintegralabsbc.GetRefund} purchase - the order to be processed
 * @transaction
 */
function GetRefund(purchase) {
    
}
/**
 * Decline a buyer dispute
 * @param {org.acme.sintegralabsbc.Decline} purchase - the order to be processed
 * @transaction
 */
function Decline(purchase) {
        if (purchase.order.status != "Dispute"){
    		throw new Error("object is not Disputed");
        }
        purchase.order.status = "Dispute_Declined";
        purchase.order.disputeDecline = new Date().toISOString();
    return getAssetRegistry('org.acme.sintegralabsbc.Order')
        .then(function (assetRegistry) {
            return assetRegistry.update(purchase.order);
        });
}

/**
 * Change the state of the Property when it is rengistred for sale so it can be rented
 * @param {org.acme.sintegralabsbc.Setup} setup 
 * @transaction
 */
function Setup(setup){
      var factory = getFactory(); 
      var NS = 'org.acme.sintegralabsbc'; 
	// seller 
    var _seller = factory.newResource(NS, 'Seller', 's1'); 
    _seller.balance = 0;
    _seller.companyName="C1";
	// buyer 
    var _buyer = factory.newResource(NS, 'Buyer', 'b1'); 
    _buyer.balance = 1000;
    _buyer.companyName="C2";
    //financeCoID
    var _financeCo = factory.newResource(NS, 'FinanceCo', 'f1'); 
    _financeCo.balance = 200;
    _financeCo.companyName="C3";
     //financeCoID
    var _shipper = factory.newResource(NS, 'Shipper', 'sh1'); 
    _shipper.balance = 200;
    _shipper.companyName="C3";
  
    //order
     var _order = factory.newResource(NS, 'Order', 'o1'); 
  	_order.status="init";
    _order.amount=0;
    _order.createdDate="";
    _order.boughtDate="";
    _order.orderedDate="";
    _order.paymentRequestedDate="";
    _order.paidDate="";
    _order.requestShipmentDate="";
    _order.deliveredDate="";
    _order.disputeMsg="";
    _order.disputeOpened="";
    _order.disputeDecline="";
    _order.disputeResolved="";
    _order.exchangeDate="";
    _order.refundDate="";
    _order.refundtRequestedDate="";
    _order.getRefundtDate="";
    _order.buyer= factory.newRelationship(NS, 'Buyer', 'b0');
    _order.seller= factory.newRelationship(NS, 'Seller', 's0');
    _order.shipper= factory.newRelationship(NS, 'Shipper', 'sh0');
    _order.financeco= factory.newRelationship(NS, 'FinanceCo', 'f0');
  
    return getParticipantRegistry(NS + '.Seller') 
        .then(function (sellerRegistry) { 
            return sellerRegistry.addAll([_seller]); 
        }).then(function() { 
            return getParticipantRegistry(NS + '.Buyer'); 
        }) 
        .then(function(buyerRegistry) { 
            return buyerRegistry.addAll([_buyer]); 
        }).then(function() { 
            return getParticipantRegistry(NS + '.FinanceCo'); 
        }) 
        .then(function(financeCoRegistry) { 
            return financeCoRegistry.addAll([_financeCo]); 
        }).then(function() { 
            return getParticipantRegistry(NS + '.Shipper'); 
        }) 
        .then(function(shipperCoRegistry) { 
            return shipperCoRegistry.addAll([_shipper]); 
        })  
        .then(function() { 
            return getAssetRegistry(NS + '.Order'); 
        }) 
        .then(function(orderRegistry) { 
            return orderRegistry.addAll([_order]); 
        }); 

}