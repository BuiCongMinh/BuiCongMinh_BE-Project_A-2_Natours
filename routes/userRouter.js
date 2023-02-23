const router = require('express').Router()
const {getAllUser,getAUser,createUser,updateUser,deleteUser} = require('../controlles/userController')


router.route('/').get(getAllUser).post(createUser)
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser)

module.exports = router
