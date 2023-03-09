const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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

    restrictTo: (...roles) => {
        return (req, res, next) => {
            //roles ['admin','lead-guide']. role='user'
            if (!roles.includes(req.user.role)) {
                return next(new AppError('You do not have permission to perform this action', 403));
            };
            next();
        }
    },

    //Đổi mật khẩu 2 bước :
    // +) b1: Người dùng gửi yêu cầu quên mật khẩu đến một route kèm với địa chỉ email cái này sẽ được thông báo và gửi link đặt lại mật khẩu và gửi nó đến địa chỉ email đã cung cấp
    forgotPassword: catchAsync(async (req, res, next) => {
        // 1) Get user based on post email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError(`There is no user with email address`, 404));
        }

        // 2) Generate the random reset token (Tạo một mã thông báo ngẫu nhiên )
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // 3) Send it to users email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

        const message = `Forgot your password? Submit a PATCH request with your new password and 
        passwordConfirm to: ${resetURL}.\n If you didn't  forget your password. please ignore this email !`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'You password reset token (valid for 10 min)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Token send to email ! '
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave: false});

            return next(new AppError(`There was an error sending the email. Try again later! `),500)
        }
    }), 

    //  +) b2: Người dùng sẽ gửi mã thông báo đó từ email của anh ấy cùng với mật khẩu mới đặt lại để cập nhật mật khẩu của anh ta
    resetPassword: (req, res, next) => {
        //1) Get user based on the token (Lấy người dùng dựa trên token)



        //2) If token has not expired, and there is user, set the new password ( Nếu token chưa hết hạn và có người dùng, hãy đặt mật khẩu mới !)

        //3) Update changedPasswordAt property for the user (Cập nhật trường changePasswordAt cho bảng User ! )

        //4) Log the user in, send JWT ( Đăng nhập người dùng, gửi JWT)
    }
}
