const express = require('express');
const app = express();
const morgan = require('morgan')
const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')

// 1) MIDDLEWERE
if (process.env.NODE_ENV === 'develoment') {
    app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.static(`${__dirname}/after-section-06/public`));


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})


// cách 2
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)


//Các router có đường url ko xác định sẽ được truyền vào đây !
app.all('*',(req,res,next)=>{   // app.all là chỉ tất cả các phương thức restAPI
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server ! `
    // })

    const err = new Error(`Cant find ${req.originalUrl} on this server !`) ;   // req.originalUrl chính là định nghĩa url của router
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
})


//Tất cả lỗi trên server sẽ được đổ vào hàm này !
app.use((err, req, res, next )=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    })
})


module.exports = app;
