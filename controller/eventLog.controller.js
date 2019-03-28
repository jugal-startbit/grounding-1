'use strict';
const login = require('../models/login.model');
const dashboard = require('../models/dashboard.model');
const contactUs = require('../models/contactUs.model');
const aboutUs = require('../models/aboutUs.model');
const aboutGroundingLog = require('../models/aboutGroundingLog.model');
const pdf = require('../models/pdf.model');
const logout = require('../models/logout.model');

// create
exports.create = function(req, res, next){
    let data = req.body;
    data.dateTime = new Date();
    data.Active = 1;
    console.log(data);
    let localVar;
    if(data.Event == 'doLogin') {localVar = login;}
    else if(data.Event == 'dashboard') {localVar = dashboard;}
    else if(data.Event == 'contactUs') {localVar = contactUs;}
    else if(data.Event == 'aboutUs') {localVar = aboutUs;}
    else if(data.Event == 'aboutGroundingLog') {localVar = aboutGroundingLog;}
    else if(data.Event == 'logout') {localVar = logout;}
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

// getAlllogin
exports.getAllLogin = function(req, res, next){
    login.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                login.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                        },
            {
                "$group"
            :
                {
                    _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                        totalAmount
                :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            console.log("tiem");
                           var group =  result.map( (row) => {
                                 var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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

// getAllLoginUsByFilter
exports.getAllLoginByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    login.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}


// getAllDashboard
exports.getAllDashboard = function(req, res, next){
    dashboard.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                dashboard.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                        var group =  result.map( (row) => {
                            var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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


// getAllLoginUsByFilter
exports.getAllDashboardByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    dashboard.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}

// getAllContactUs
exports.getAllContactUs = function(req, res, next){
    contactUs.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                contactUs.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            var group =  result.map( (row) => {
                                var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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


// getAllContactUsByFilter
exports.getAllContactUsByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    contactUs.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}

// getAllAboutUs
exports.getAllAboutUs = function(req, res, next){
    aboutUs.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                aboutUs.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            var group =  result.map( (row) => {
                                var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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

// getAllAboutUsByDate
exports.getAllAboutUsByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    aboutUs.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}

// getAllAboutGroundingLog
exports.getAllAboutGroundingLog = function(req, res, next){
    aboutGroundingLog.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                aboutGroundingLog.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            var group =  result.map( (row) => {
                                var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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


// getAllAboutGroundingLogByFilter
exports.getAllAboutGroungingLogByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    aboutGroundingLog.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}

// getAllPdf
exports.getAllPdf = function(req, res, next){
    pdf.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                pdf.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            var group =  result.map( (row) => {
                                var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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

// getAllPdfByFilter
exports.getAllPdfByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    pdf.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}


// getAlllogout
exports.getAllLogout = function(req, res, next){
    logout.find()
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                logout.aggregate([
                    {"$project":
                        {
                            _id: 0,
                            'StudyCode': "$StudyCode",
                            'Duration': "$Duration",
                            'UserInitial': "$UserInitial",
                            "datePartDay": {
                                "$concat": [
                                    {"$substr": [{"$dayOfMonth": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$month": "$DateTime"}, 0, 2]}, "-",
                                    {"$substr": [{"$year": "$DateTime"}, 0, 4]}
                                ]
                            },
                        }
                    },
                    {
                        "$group"
                            :
                            {
                                _id:{ day:  "$datePartDay", UserInitial: "$UserInitial" , StudyCode : "$StudyCode" },
                                totalAmount
                                    :
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
                    .exec(function(err, result){
                        if(err) res.send(err);
                        else
                            var group =  result.map( (row) => {
                                var time = parseInt(parseInt(row.totalAmount)/(60)) + ":" + parseInt(parseInt(row.totalAmount)%60) + ':' + '00';
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

// getAllLogoutByFilter
exports.getAllLogoutByFilter = function(req, res, next){
    let From = req.body.FromDate;
    let To = req.body.ToDate;
    let StudyCode = req.body.StudyCode;
    let UserInitial = req.body.UserInitial;
    var condition = {};
    if(StudyCode != null || StudyCode != undefined){
        condition.StudyCode = {'$regex': StudyCode};
    }
    if(UserInitial != null || UserInitial != undefined){
        condition.UserInitial = {'$regex': UserInitial};
    }
    if(From != null || From != undefined){
        condition.DateTime = {"$gte": new Date(From), "$lt": new Date(To)};
    }
    console.log(condition)
    logout.find(condition)
        .sort({_id: 'desc'})
        .exec(function(err, data){
            if(err) res.send(err);
            else
                res.status(200).json({
                    'status': true,
                    'message': 'Success',
                    'result': data
                })
        })
}

