const Tour = require('../models/Tours')
const APIFeatures = require('../utils/apiFeatures')

// handel route tour

exports.aliasTopTour = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';

    next();
}


exports.getAllTuor = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'false',
            msg: error
        })
    }
}

exports.getATuor = async (req, res) => {
    try {
        let tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success! ',
            data: tour
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'false',
            msg: error
        })
    }
}

exports.postTour = async (req, res) => {
    console.log('>>> check body:', req.body);
    try {
        let tours = await Tour.create(req.body)
        res.status(200).json({
            status: 'success !',
            data: tours
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'false',
            msg: error
        })
    }
}

exports.patchATour = async (req, res) => {
    try {
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
                data: {tour}
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'false',
            msg: error
        })
    }

}

exports.deleteATour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'success!',
            data: {
                msg: 'Đã xoá thành công !'
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'false',
            msg: error
        })
    }

}
exports.getTourStars = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}
