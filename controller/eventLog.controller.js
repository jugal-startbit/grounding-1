'use strict';
const login = require('../models/login.model');
const dashboard = require('../models/dashboard.model');
const contactUs = require('../models/contactUs.model');
const aboutUs = require('../models/aboutUs.model');
const aboutGroundingLog = require('../models/aboutGroundingLog.model');
const pdf = require('../models/pdf.model');
const logout = require('../models/logout.model');
const review = require('../models/review.model')
const feedback = require('../models/feedback.model')
var dateFormat = require('dateformat');


// create
exports.create = function (req, res, next) {
    let data = req.body;
    data.dateTime = new Date();
    data.Active = 1;
    console.log(data);

    // d = Number(data.Duration);
    // var h = Math.floor(d / 3600);
    // var m = Math.floor(d % 3600 / 60);
    // var s = Math.floor(d % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    // data.Duration = hDisplay + mDisplay + sDisplay;

    let localVar;
    if (data.Event == 'doLogin') {
        localVar = login;
    }
    else if (data.Event == 'dashboard') {
        localVar = dashboard;
    }
    else if (data.Event == 'contactUs') {
        localVar = contactUs;
    }
    else if (data.Event == 'aboutUs') {
        localVar = aboutUs;
    }
    else if (data.Event == 'aboutGroundingLog') {
        localVar = aboutGroundingLog;
    }
    else if (data.Event == 'logout') {
        localVar = logout;
    }
    else {
        res.status(200).json({
            'status': false,
            'message': 'Invalid event name',
            'result': localVar
        })
    }
    localVar = new localVar(data);
    localVar.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully created record',
            'result': localVar
        })
    })
}

// Review Create
exports.reviewCreate = function (req, res, next) {
    let data = req.body;
    let localVar;
    data.DateTime = new Date();
    data.Active = 1;
    console.log(data);
    localVar = review;
    localVar = new review(data);
    localVar.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully review created',
            'result': localVar
        })
    })
}
// FeedBack Create
exports.feedbackCreate = function (req, res, next) {
    let data = req.body;
    let localVar;
    data.DateTime = new Date();
    data.Active = 1;
    console.log(data);
    localVar = feedback;
    localVar = new feedback(data);
    localVar.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully review created',
            'result': localVar
        })
    })
}

// getAlllogin
exports.getAllReview = function (req, res, next) {
    review.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else{
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data,
                })
            }
        })
}

// getAlllogin
exports.getAllReviewByFilter = function (req, res, next) {
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    review.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data,
                })
        })
}

// getAlllogin
exports.getAllLogin = function (req, res, next) {
    login.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                login.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllLoginUsByFilter
exports.getAllLoginByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    login.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                login.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                'DateTime': "$DateTime",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",                                
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    });
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}


// getAllDashboard
exports.getAllDashboard = function (req, res, next) {
    dashboard.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                dashboard.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                                var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}


// getAllLoginUsByFilter
exports.getAllDashboardByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    dashboard.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                dashboard.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllContactUs
exports.getAllContactUs = function (req, res, next) {
    contactUs.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                contactUs.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                                var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}


// getAllContactUsByFilter
exports.getAllContactUsByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    contactUs.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                contactUs.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllAboutUs
exports.getAllAboutUs = function (req, res, next) {
    aboutUs.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                aboutUs.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                            row.Time = time;
                            return row;
                        //         var hor = parseInt(parseInt(row.totalAmount) / (60));
                        // var h = hor.toString();
                        // if(h.length == 1){
                        //     h = "0"+h;
                        // }
                        // var min = parseInt(parseInt(row.totalAmount) % 60);
                        // var m = min.toString();
                        // if(m.length == 1){
                        //     m = "0"+m;
                        // }
                        // var time = h + ":" + m + ':' + '00';
                        // row.Time = time;
                        // return row;
                    });
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllAboutUsByDate
exports.getAllAboutUsByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    aboutUs.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                aboutUs.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {

                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                            row.Time = time;
                            return row;
                        });
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllAboutGroundingLog
exports.getAllAboutGroundingLog = function (req, res, next) {
    aboutGroundingLog.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                aboutGroundingLog.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                                 var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                            row.Time = time;
                            return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}


// getAllAboutGroundingLogByFilter
exports.getAllAboutGroungingLogByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    aboutGroundingLog.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                aboutGroundingLog.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllPdf
exports.getAllPdf = function (req, res, next) {
    pdf.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                pdf.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                                var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllPdfByFilter
exports.getAllPdfByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    pdf.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                pdf.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}


// getAlllogout
exports.getAllLogout = function (req, res, next) {
    logout.find()
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                logout.aggregate([
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            var group = result.map((row) => {
                                var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

// getAllLogoutByFilter
exports.getAllLogoutByFilter = function (req, res, next) {
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let startDate = dateFormat(From, 'yyyy-mm-dd 00:00:00');
    let endDate = dateFormat(To, 'yyyy-mm-dd 23:59:59');
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if (StudyCode != null || StudyCode != undefined) {
        condition.StudyCode = {'$regex': StudyCode};
    }
    if (UserInitial != null || UserInitial != undefined) {
        condition.UserInitial = {'$regex': UserInitial};
    }
    if (From != null || From != undefined) {
        condition.DateTime = {"$gte": new Date(startDate), "$lt": new Date(endDate)};
    }
    console.log(condition)
    logout.find(condition)
        .sort({_id: 'desc'})
        .exec(function (err, data) {
            if (err) res.send(err);
            else
                logout.aggregate([
                    {
                        "$match": condition
                    },
                    {
                        "$project":
                            {
                                _id: 0,
                                'StudyCode': "$StudyCode",
                                'Duration': "$Duration",
                                'UserInitial': "$UserInitial",
                                "datePartDay": {
                                    "$concat": [
                                        {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "/",
                                        {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                    ]
                                },
                            }
                    },
                    {
                        "$group":
                            {
                                _id: {day: "$datePartDay", UserInitial: "$UserInitial", StudyCode: "$StudyCode"},
                                totalAmount:
                                    {
                                        $sum: "$Duration"
                                    }
                                ,
                                count: {
                                    $sum: 1
                                }
                            }
                    }
                ])
                    .exec(function (err, result) {
                        if (err) res.send(err);
                        else
                            console.log("tiem");
                        var group = result.map((row) => {
                            var secs = row.totalAmount;
                            var hours = Math.floor(secs / (60 * 60));
   
                            var divisor_for_minutes = secs % (60 * 60);
                            var minutes = Math.floor(divisor_for_minutes / 60);
                         
                            var divisor_for_seconds = divisor_for_minutes % 60;
                            var seconds = Math.ceil(divisor_for_seconds);
                            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

                            var time = result;
                        row.Time = time;
                        return row;
                    })
                        ;
                        res.status(200).json({
                            'status': true,
                            'message': 'Success',
                            'result': data,
                            'Group': group,
                        })
                    })
        })
}

