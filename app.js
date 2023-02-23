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

// 3) ROUTER 

// cách 1
// app.get('/api/v1/tours/',getAllTuor)
// app.post('/api/v1/tours',postTour)
// app.patch('/api/v1/tours/:id', patchATour)
// app.delete('/api/v1/tours/:id', deleteATour)
// app.get('/api/v1/tours/:id',getATuor)


// cách 2
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter)

module.exports = app;
