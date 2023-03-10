const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordConFirm

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please tell us your name !'] },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,  // tất cả chữ hoa sẽ chuyển thành chữ thường !
        validate: [validator.isEmail, 'Please provide a valid email ! ']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide your password ! '],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide your password ! '],
        validate: {
            //this only work on Create and Save ;
            validator: function (el) {
                return el === this.password;   // check passConfirm và password có giống nhau ko ???
            },
            message: 'Passwords are not the same !'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { collection: 'user' });


userSchema.pre('save', async function (next) {
    // Only run this function if passsword was actually mnodified  (chỉ chạy khi password thay đổi !)
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12 (mã hoá mật khẩu với băm 12)
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field (xoá trường xác nhận mật khẩu !)
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000
            , 10
        );

        return JWTTimestamp < changedTimestamp;
    }

    //False means not changed  (false tức là ko đổi pass!)
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    // console.log(81);

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken; 

}

const User = mongoose.model('user', userSchema)
module.exports = User
