const users = require('../../models/user.model');

// create User
exports.create = function (req, res, next) {
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    user1.DateTime = new Date();
    user1.Active = 1;

    const user = new users(user1);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully created record',
            'result': user
        })
    })
}// create
exports.createServiceProvider = function (req, res, next) {
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    user1.Services = data.Services;
    user1.DateTime = new Date();
    user1.Active = 1;

    const user = new users(user1);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully created record',
            'result': user
        })
    })
}// create
exports.createVendor = function (req, res, next) {
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    user1.Shop = data.Shop;
    user1.DateTime = new Date();
    user1.Active = 1;

    const user = new users(user1);
    user.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            'status': true,
            'message': 'Successfully created record',
            'result': user
        })
    })
}


// update
exports.update = function(req, res, next){
    let id = req.params._id;
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    data['Modified'] = new Date();
    users.findByIdAndUpdate(id, user1, {new: true}, (err, data) => {
        if(err) {
            return next(err);
        }
        else {
            res.status(200).json({
            'status': true,
            'message': 'Successfully updated record',
            'result': data
        })
    }
});
}


// updateServiceProvider
exports.updateServiceProvider = function(req, res, next){
    let id = req.params._id;
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    user1.Services = data.Services;
    data['Modified'] = new Date();
    users.findByIdAndUpdate(id, user1, {new: true}, (err, data) => {
        if(err) {
            return next(err);
        }
        else {
            res.status(200).json({
            'status': true,
            'message': 'Successfully updated record',
            'result': data
        })
    }
});
}


// updateVendor
exports.updateVendor = function(req, res, next){
    let id = req.params._id;
    let data = req.body;
    var user1  = Object.assign(data.Basic , data.Account);
    user1.MandatoryDocuments = data.MandatoryDocuments;
    user1.AdditionalDocuments = data.AdditionalDocuments;
    user1.Shop = data.Shop;
    data['Modified'] = new Date();
    users.findByIdAndUpdate(id, user1, {new: true}, (err, data) => {
        if (err) {
            return next(err);
        }
        else{
            res.status(200).json({
            'status': true,
            'message': 'Successfully updated record',
            'result': data
        })
    }
});
}

// getOne
exports.getOne = function(req, res, next){
    let id = req.params._id;
    users.findById(id).populate(['Role']).exec((err, data) =>{
        res.status(200).json({
        'status': true,
        'message': 'Success',
        'result': data
    })
})
}

// getAll
exports.getAll = function(req, res, next){
    const condition= {
        'Active': 1
    };
    users.find(condition)
        .sort({_id: 'desc'})
        .populate(['State' , 'City' , 'Locality' , 'Role'] )
        .exec(function(err, data){
            if(err) res.send(err);
            let sentData = [];
            sentData = data.map(row=>{
                let ret = {};
                ret._id = row._id;
                ret.Email = row.Email;
                ret.Name = row.FirstName + ' ' +row.MiddleName + ' '+row.LastName ;
                ret.State = row.State.Name;
                ret.City = row.City.Name;
                ret.Locality = row.Locality.Name;
                ret.Role = row.Role.Name? row.Role.Name : '';
                return ret;
            });
            res.status(200).json({
                'status': true,
                'message': 'Success',
                'result': sentData
            })
        })
}

// getAll
exports.getAllUserWithSpRole = function(req, res, next){
    const condition= {
        'Active': 1,
        'Role': '5cb5b2b17d799119b01c6225'
    };
    users.find(condition)
        .sort({_id: 'desc'})
        .populate(['State' , 'City' , 'Locality'])
        .exec(function(err, data){
            if(err) res.send(err);
            let sentData = [];
            sentData = data.map(row=>{
                let ret = {};
                ret._id = row._id;
                ret.Email = row.Email;
                ret.FirstName = row.FirstName;
                ret.MiddleName = row.MiddleName;
                ret.LastName = row.LastName;
                ret.State = row.State.Name;
                ret.City = row.City.Name;
                ret.Locality = row.Locality.Name;
                return ret;
            });
            res.status(200).json({
                'status': true,
                'message': 'Success',
                'result': sentData
            })
        })
}

// delete record
exports.delete = function(req, res, next){
    let id = req.params._id;
    users.findByIdAndUpdate(id, {Active: 0}, (err, data) => {
        if (err) {
            return next(err);
        }
        else{
            res.status(200).json({
            'status': true,
            'message': 'Successfully deleted record',
            'result': data
        })
    }
});
}

exports.getByType = function(req, res, next){
    users.find({})
        .sort({_id: 'desc'})
        .populate([])
        .exec(function(err, data){
            if(err) res.send(err);
            res.status(200).json({
                'status': true,
                'message': 'Success',
                'result': data
            })
        })
}



exports.checkUserName = function (req , res , next) {
    var name = req.params.name;
    users.find({'UserName': name})
        .exec(function(err, data){
            if(err) res.send(err);
            res.status(200).json({
                'status': true,
                'message': 'Success',
                'result': data
            })
        })
}
exports.checkEmail = function (req , res , next) {
    var email = req.params.Email;
    users.find({'Email': email})
        .exec(function(err, data){
            if(err) res.send(err);
            res.status(200).json({
                'status': true,
                'message': 'Success',
                'result': data
            })
        })
}

