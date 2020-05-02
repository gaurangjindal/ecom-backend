const express= require('express');
const router = express.Router();


const {requireSignin,isAuth} =require('../controller/auth');
const {userById,addOrderToUserHistory} =require('../controller/user');
const {create} = require('../controller/order');
const {decreaseQuantity} = require('../controller/product');


router.post('/order/create/:userId',requireSignin,isAuth,addOrderToUserHistory,decreaseQuantity,create)
router.param('userId',userById);


module.exports = router;