const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const TourSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'A tour must have a name'],
        unique: true, trim: true,
        maxLength: [40, 'A tour name must have less or equal then  40 character'],
        minLength: [10, 'A tour name must have more or equal then 10 character ']
        // validate: [validator.isAlpha,'Tour name must only contain character']
    },
    slug: String,
    duration: { type: Number, required: [true, 'A must have a duration'] },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a group size'] },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficuly'],
        trim: true,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingAverage: {
        type: Number, default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price ! '] },
    priceDisCount: {
        type: Number,
        validate: {
            message: 'DisCount price ({VALUE}) should be below regular price',
            validator: function (val) {
                // this only points to current doc on NEW document creation 
                return val < this.price;
            }
        }
    },
    summary: { type: String, trim: true },   //trim là xoá tất cả các khoảng trắng ở đầu và cuối của value một trường !
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, 'A tour must have a cover image'] },
    images: [String],
    createAt: { type: Date, default: Date.now() },
    startDates: [Date],
    secretTour: { type: Boolean, default: false }
}, { collection: 'tour' }
    , {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

TourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDELLWERE: RUNs before .save() and .create() .insertMany
TourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next()
})

// TourSchema.pre('save',function(next){
//     console.log('Will save document !');
//     next();
// })

// TourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE
// TourSchema.pre(/^find/,function(next){
//     this.find({secretTour:{ $ne: true}});
//     this.start = Date.now();
//     next()
// })  
// TourSchema.post(/^find/,function(docs,next){
//     console.log(`Query took ${Date.now() - this.start} milliseconds! `);

//     next()
// })

//AGGREGATION MIDDLEWARE
// TourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour: {$ne: true}}})
//     console.log(this.pipeline());
//     next()
// });

const Tour = mongoose.model('tour', TourSchema)

module.exports = Tour

