const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

module.exports = {
    signup: catchAsync(async (req, res, next) => {
        const newUser = await User.create(req.body);

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success !',
            token,
            data: {
                user: newUser
            }
        })

    }),

    login: catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        // 1) Check if email and password exist !
        if (!email || !password) {
            return next(new AppError('Please provide email and password! ', 400));
        }

        // 2) Check if user exist && password is correct !
        const user = await User.findOne({ email }).select('+password'); // chỉ lấy trường password

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password !', 401))
        }

        // 3) if everything ok send token to client
        const token = signToken(user._id);
        res.status(200).json({
            status: 'success !',
            token
        })
    }),

    protect: catchAsync(async (req, res, next) => { 
        // 1) get token and check of its there ( lấy token và check xem có lấy được ko ?)
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        };
        // console.log('check token:', token);
        if (!token) {
            return next(new AppError('You are not logged in ! Please log in to get access. ', 401));
        }

        
        // 2) Verification token (xác minh token !)
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists(check người dùng có tồn tại hay ko !)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist ! ', 401))
        }

        // 4) Check if user changed password after the token was issued (check user có thay đổi password sau khi token được phát hành hay ko !)
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password ! Please log again. ', 401));
        };

        // GRANT ACCESS TO PROTECTED ROUTE (Cấp quyền truy cập vào route được bảo vệ !)
        req.user = currentUser;   
        next();
    }),
}
