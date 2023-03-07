const User = require('../models/User')
const catchAsync = require('../utils/catchAsync')


exports.getAllUser = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        result: users.length,
        status: " success ! ",
        data: users
    });
});


exports.getAUser = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'route này chưa định nghĩa !'
        }
    })
}
exports.createUser = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'route này chưa định nghĩa !'
        }
    })
}
exports.updateUser = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'route này chưa định nghĩa !'
        }
    })
}
exports.deleteUser = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'route này chưa định nghĩa !'
        }
    })
}
