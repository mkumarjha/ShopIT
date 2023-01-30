const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv')
const path = require('path');
var cors = require('cors')


const errorMiddleware = require('./middlewares/errors');

// setting up config file 
//if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({path: 'backend/config/config.env'})

const corsOptions ={
    origin: process.env.FRONTEND_URL, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());



// import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);



if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static('../frontend/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build','index.html'));
    }) 
}

//middleware to handle errors
app.use(errorMiddleware);


module.exports = app