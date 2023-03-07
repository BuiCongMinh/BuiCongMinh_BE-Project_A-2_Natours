require('dotenv').config({ path: `./.env` });
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log(`UNCAUGHT REJECTION ! Shutting down... !`);
    process.exit(1);    
})


const app = require("./app");

const DB = process.env.MONGOATLAST_URL
// console.log('>>> check biến môi trường: ',process.env.PORT);
// 4)START SERVER 

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("DB conection succsess !");

    })


const port = process.env.PORT || 3000;
const server = app.listen(port, console.log(`127.0.0.1:${port}`))

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log(`UNHANDLE REJECTION ! Shutting down... !`);
    server.close(() => {
        process.exit(1);
    })
})
