const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const CookieParser = require('cookie-parser');
const expressvalidator = require('express-validator');

const cors =require('cors');


// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoute = require('./routes/product')
const braintreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order')





// our app
const app = express();


//db connection
// mongodb+srv://blog:blog@ecommerce-2igd7.mongodb.net/test?retryWrites=true&w=majority
// mongodb://localhost:27017/ecommerce
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser :true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=> console.log('Db connected'));

// middleware
app.use(morgan('dev'));
app.use(bodyparser.json())
app.use(CookieParser())
app.use(expressvalidator());
app.use(cors());


//routes middleware
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoute)
app.use('/api',braintreeRoutes)
app.use('/api',orderRoutes)



// here '/' tell us that we are getting to home page of the applicstion or can say default for home page is '/'
// routes
app.get('/',(req,res)=>{
    res.send('Your backend is working fine...');
});


const port = process.env.PORT || 8000
// we use {} bracket to display varibale , hence here variable is port having value 8000

app.listen(port,()=>{
    console.log(`server started at ${port} `);
})



