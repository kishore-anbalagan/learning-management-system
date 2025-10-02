const express = require('express');
const router = express.Router();
const { addDemoContent } = require('../controllers/demoContent');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

router.post('/add-demo-content', auth, isInstructor, addDemoContent);

module.exports = router;