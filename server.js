require('dotenv').config({path:`./.env`});
const app = require("./app");

// console.log('>>> check biến môi trường: ',process.env.PORT);
// 4)START SERVER 
const port = process.env.PORT ||  3000;
app.listen(port, console.log(`127.0.0.1:${port}`))
