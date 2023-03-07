const mongoose = require('mongoose');
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
    password: {
        type: String,
        required: [true, 'Please provide your password ! '],
        minlength: 8
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
    }
}, { collection: 'user' });


userSchema.pre('save', async function (next) { 
    // Only run this function if passsword was actually mnodified  (chỉ chạy khi password thay đổi !)
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12 (mã hoá mật khẩu với băm 12)
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field (xoá trường xác nhận mật khẩu !)
    this.passwordConfirm = undefined;
});

const User = mongoose.model('user', userSchema)
module.exports = User
