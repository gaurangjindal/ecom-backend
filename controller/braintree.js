const User = require('../models/user')
const braintree = require('braintree')
require('dotenv').config()

const gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'qd87qvmn94rwrws7',
    publicKey:    '23479z9gmqkw9nys',
    privateKey:   'b40be111c8be314880c9a5d43a9b3234'
});

/*
const gateway = braintree.connect({
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHAIN_ID,
    publickey:  process.env.BRAINTREE_PUBLIC_KEY,
    privatekey: process.env.BRAINTREE_PRIVATE_KEY
})
*/
exports.generateToken = (req,res)=>{
    gateway.clientToken.generate({},function(err,response){
        if(err){
            res.status(400).send(err)
        }else{
            res.send(response)
        }
    })
}


exports.processPayment =(req,res)=>{
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amountFromTheClient
    //charge
    let newTransaction = gateway.transaction.sale({
        amount:amountFromTheClient,
        paymentMethodNonce:nonceFromTheClient,
        options:{
            submitForSettlement:true
        }
    },(error,result)=>{
        if(error){
            res.status(500).json(error)
        }else{
            res.json(result);
        }
    })
}