const express = require('express');
const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controlles/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

// 1) MIDDLEWERE
if (process.env.NODE_ENV === 'develoment') {
    app.use(morgan("dev"))
};

app.use(express.json());
app.use(express.static(`${__dirname}/after-section-06/public`));


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
});


// cách 2
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);


//Các router có đường url ko xác định sẽ được truyền vào đây !
app.all('*', (req, res, next) => {   // app.all là chỉ tất cả các phương thức restAPI
    next(new AppError(`Cant find ${req.originalUrl} on this server ! `));
}) 


//Tất cả lỗi trên server sẽ được đổ vào hàm này !
app.use(globalErrorHandler);


module.exports = app;
