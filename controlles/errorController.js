const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message =  `Invalid ${err.path}: ${err.value}. `;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    
    //Operational, trusted error: send message to client (Những lỗi vận hành (operational errors) mà chúng ta có thể gửi thông tin chi tiết được cho bên phía khách hàng ! )
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    //Programming or other unknown error: don't leak error details (Những lối ko xác định và chúng ta ko muốn cho khách hàng biết về chi tiết (như là sử dụng bên code thứ ba hay là chi tiết về code rong app!))  
    else{
        // 1) Log error 
        console.error('>>> ERROR !!!', err);  //console.error giống với console.log nhưng sẽ cụ thể hơn với các lỗi error

        // 2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong !'
        })
    }

}

module.exports = (err, req, res, next) => {
    console.log('>>> check stack:',err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //sẽ chia ra chạy bên phía 'development' bên nhà phát triển ứng dụng (bên dev)
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = {... err};

        if(error.name === 'CastError') error = handleCastErrorDB(error);

        sendErrorProd(error, res);
    };

}
