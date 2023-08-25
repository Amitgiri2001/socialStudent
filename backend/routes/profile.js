const express = require('express');

const profileController = require('../controllers/profile')

const router = express.Router();

router.get('/data', profileController.getProfileData);
//post data to backend
router.put('/post', profileController.addProfileData);


module.exports = router;