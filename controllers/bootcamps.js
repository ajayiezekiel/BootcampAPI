const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const getBootcamps = (req, res, next) => {
    res.status(200).send({ success: true, msg: 'Show all bootcamps' });
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
const getBootcamp = (req, res, next) => {
    res.status(200).send({ success: true, msg: `Display bootcamp ${req.params.id}` });
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
const updateBootcamp = (req, res, next) => {
    res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    Delete single bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
const deleteBootcamp = (req, res, next) => {
    res.status(200).send({ success: true, msg: `Delete bootcamp ${req.params.id}` });
}

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}