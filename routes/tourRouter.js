const router = require('express').Router()
const tourController = require('../controlles/tourController')

router.param('id',tourController.checkID)

router.route('/').get(tourController.getAllTuor).post(tourController.checkBody, tourController.postTour)
router.use((req,res,next)=>{
    console.log('>>> Gửi lời chào middellwere !');
    next()
})
router.route('/:id').get(tourController.getATuor).delete(tourController.deleteATour).patch(tourController.patchATour)

module.exports = router