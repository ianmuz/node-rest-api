const express = require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

//creating routes to handle requests 
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');

//Connecting to the database(MongoDB Atlas)
mongoose.connect("mongodb+srv://ianmuz:iammuz@rest-shop-dokse.mongodb.net/test?retryWrites=true&w=majority",{
    useMongoClient:true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS Errors
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    };
    next();
}); 

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req, res, next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
});
app.use((error, req, res, next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports=app;
