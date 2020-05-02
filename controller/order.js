const {Order,CartItem} = require('../models/order');
const User = require('../models/user');



exports.create =(req,res)=>{
    //console.log('create order:',req.body)
    req.body.order,user = req.profile
    //console.log('my order',req.body.order);
    const order = new Order(req.body.order)
    order.save((error,data)=>{
        if(error){
            return res.status(400)
        }
        res.json(data);
    })
}

