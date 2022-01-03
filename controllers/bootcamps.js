const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = asyncHandler( async (req, res, next) => {
    let query;
    
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    query = Bootcamp.find(JSON.parse(queryStr));

    const bootcamps = await query;
        
    res.status(200).json({ 
        success: true, 
        count: bootcamps.length,
        data: bootcamps,
        error: null
    });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({ 
        success: true, 
        data: bootcamp,
        error: null
    });   
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
const createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
        
    res.status(201).json({ 
        success: true, 
        data: bootcamp,
        error: null
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({ 
        success: true, 
        data: bootcamp,
        error: null
    });
});

// @desc    Delete single bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {},
        error: null
    });
});

// @desc   Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    console.log(loc);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 kilometres
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { 
            $centerSphere: [[lng, lat], radius] 
        } }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
        error: null
    })
});

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
}