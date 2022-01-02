const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ 
            success: true, 
            count: bootcamps.length,
            data: bootcamps,
            error: null
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            data: null,
            error: err
        })
    }
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ 
            success: true, 
            data: bootcamp,
            error: null
        });
    } catch (err) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
const createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ 
            success: true, 
            data: bootcamp,
            error: null
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            data: null,
            error: err
        })
    }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
const updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'The id does not exist'
            })
        }
        res.status(200).json({ 
            success: true, 
            data: bootcamp,
            error: null
        });
    } catch (err) {
        res.status(400).json({ 
            success: false, 
            data: null,
            error: err
        })
    };
};

// @desc    Delete single bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'The id does not exist'
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            error: null
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            data: null,
            error: err
        });
    }
};

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}