'use strict';
var express = require('express');
var router = express.Router();

var eventLogCtrl = require('../controller/eventLog.controller');

router.post('/eventLog/create', eventLogCtrl.create);

// Login Model Record
router.get('/events/getAlllogin', eventLogCtrl.getAllLogin);
router.post('/events/getAllLoginByFilter', eventLogCtrl.getAllLoginByFilter);


// dashboard Model Record
router.get('/events/getAllDashboard', eventLogCtrl.getAllDashboard);
router.post('/events/getAllDashboardByFilter', eventLogCtrl.getAllDashboardByFilter);

// ContactUs Model Record
router.get('/events/getAllContactUs', eventLogCtrl.getAllContactUs);
router.post('/events/getAllContactUsByFilter', eventLogCtrl.getAllContactUsByFilter);

// AboutUs Model Record
router.get('/events/getAllAboutUs', eventLogCtrl.getAllAboutUs);
router.post('/events/getAllAboutUsByFilter', eventLogCtrl.getAllAboutUsByFilter);

// AboutGroundingLog Model Record
router.get('/events/getAllAboutGroundingLog', eventLogCtrl.getAllAboutGroundingLog);
router.post('/events/getAllAboutGroungingLogByFilter', eventLogCtrl.getAllAboutGroungingLogByFilter);

// Pdf Model Record
router.get('/events/getAllPdf', eventLogCtrl.getAllPdf);
router.post('/events/getAllPdfByFilter', eventLogCtrl.getAllPdfByFilter);

// logout Model Record
router.get('/events/getAlllogout', eventLogCtrl.getAllLogout);
router.post('/events/getAllLogoutByFilter', eventLogCtrl.getAllLogoutByFilter);

module.exports = router;