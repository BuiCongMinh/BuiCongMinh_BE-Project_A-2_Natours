const router = require('express').Router()
const tourController = require('../controlles/tourController')

// router.param('id',tourController.checkID)
router.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTuor);
router.route('/tour-stats').get(tourController.getTourStars);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router.route('/').get(tourController.getAllTuor).post( tourController.postTour );

router.route('/:id').get(tourController.getATuor).delete(tourController.deleteATour).patch(tourController.patchATour)

module.exports = router
