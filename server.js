require('dotenv').config({ path: `./.env` });
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const app = require("./app");

const DB = process.env.MONGOATLAST_URL
// console.log('>>> check biến môi trường: ',process.env.PORT);
// 4)START SERVER 

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("DB conection succsess !");
});





const port = process.env.PORT || 3000;
app.listen(port, console.log(`127.0.0.1:${port}`))
