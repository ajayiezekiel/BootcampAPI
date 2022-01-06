const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Public
const getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
        error: null
    })
});

// @desc    Get a course
// @route   GET /api/v1/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }


    res.status(200).json({
        success: true,
        data: course,
        error: null
    })
});

// @desc    Create new course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
const createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }
    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    });
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    await course.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};