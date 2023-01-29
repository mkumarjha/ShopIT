const mongoose = require('mongoose')

const connectDatabse = ()=>{
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con=>{
        console.log(`mongo db database connected with HOST: ${con.connection.host}`)
    })
}

module.exports = connectDatabse