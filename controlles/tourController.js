const Tour = require('../models/Tours')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

// handel route tour

exports.aliasTopTour = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.postTour = catchAsync(async (req, res, next) => {
    let newTours = await Tour.create(req.body)
    res.status(200).json({
        status: 'success !',
        data: {
            tours: newTours
        }
    })
});

exports.getAllTuor = catchAsync(async (req, res, next) => {

    // EXECUTE QUERY 
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query;

    res.status(200).json({
        result: tours.length,
        status: " success ! ",
        data: tours
    })

});

exports.getATuor = catchAsync(async (req, res, next) => {

    let tour = await Tour.findById(req.params.id)
    res.status(200).json({
        status: 'success! ',
        data: tour
    })

});

exports.patchATour = catchAsync(async (req, res, next) => {

    console.log('>>> checkBody:', req.body);
    let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false
    })
    console.log('>>> check data: ', tour);
    res.status(200).json({
        status: 'success!',
        data: {
            status: 'success ! ',
            data: { tour }
        }
    })


});

exports.deleteATour = catchAsync(async (req, res, next) => {

    await Tour.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: 'success!',
        data: {
            msg: 'Đã xoá thành công !'
        }
    })


});

exports.getTourStars = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    res.status(200).json({
        status: 'success!',
        data: {
            stats
        }
    });

});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }

        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })

});
