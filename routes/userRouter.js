const router = require('express').Router()
const authController = require('../controlles/authController')
const {getAllUser,getAUser,createUser,updateUser,deleteUser} = require('../controlles/userController')

router.post('/signup',authController.signup);

router.route('/').get(getAllUser).post(createUser)
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser)

module.exports = router
