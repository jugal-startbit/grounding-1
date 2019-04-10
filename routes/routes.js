'use strict';
var express = require('express');
var router = express.Router();
var cors = require('cors');
var whitelist = ['https://facing-forward.org/', 'https://grounding.herokuapp.com/']
var corsOptionsDelegate = function(req, callback) {
        var corsOptions;
        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
            corsOptions = { origin: true } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }
    /* router.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      }); */
var eventLogCtrl = require('../controller/eventLog.controller');

router.post('/eventLog/create', cors(corsOptionsDelegate), eventLogCtrl.create);
router.post('/reviewCreate', cors(corsOptionsDelegate), eventLogCtrl.reviewCreate);
router.post('/feedbackCreate', cors(corsOptionsDelegate), eventLogCtrl.feedbackCreate);

// Login Model Record
router.get('/events/getAllReview', cors(corsOptionsDelegate), eventLogCtrl.getAllReview);
router.post('/events/getAllReviewByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllReviewByFilter);

// Login Model Record
router.get('/events/getAlllogin', cors(corsOptionsDelegate), eventLogCtrl.getAllLogin);
router.post('/events/getAllLoginByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllLoginByFilter);


// dashboard Model Record
router.get('/events/getAllDashboard', cors(corsOptionsDelegate), eventLogCtrl.getAllDashboard);
router.post('/events/getAllDashboardByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllDashboardByFilter);

// ContactUs Model Record
router.get('/events/getAllContactUs', cors(corsOptionsDelegate), eventLogCtrl.getAllContactUs);
router.post('/events/getAllContactUsByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllContactUsByFilter);

// AboutUs Model Record
router.get('/events/getAllAboutUs', cors(corsOptionsDelegate), eventLogCtrl.getAllAboutUs);
router.post('/events/getAllAboutUsByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllAboutUsByFilter);

// AboutGroundingLog Model Record
router.get('/events/getAllAboutGroundingLog', cors(corsOptionsDelegate), eventLogCtrl.getAllAboutGroundingLog);
router.post('/events/getAllAboutGroungingLogByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllAboutGroungingLogByFilter);

// Pdf Model Record
router.get('/events/getAllPdf', cors(corsOptionsDelegate), eventLogCtrl.getAllPdf);
router.post('/events/getAllPdfByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllPdfByFilter);

// logout Model Record
router.get('/events/getAlllogout', cors(corsOptionsDelegate), eventLogCtrl.getAllLogout);
router.post('/events/getAllLogoutByFilter', cors(corsOptionsDelegate), eventLogCtrl.getAllLogoutByFilter);

module.exports = router;