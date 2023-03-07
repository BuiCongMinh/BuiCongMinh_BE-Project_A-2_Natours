const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');


module.exports = {
    signup : catchAsync( async(req,res,next)=>{
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success !',
            data:{
                user: newUser
            }
        })

    }),
}
