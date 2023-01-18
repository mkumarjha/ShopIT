const app= require('./app')
const connectDatabse = require('./config/database')
const dotenv = require('dotenv')

//Handle uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`Error: ${err.stack} `);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1);
})

// setting up config file 
dotenv.config({path: 'backend/config/config.env'})



//connecting to database
connectDatabse();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1)
    })
})
