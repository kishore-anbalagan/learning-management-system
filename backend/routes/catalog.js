const express = require('express');
const router = express.Router();
const { getCatalogPageData } = require('../controllers/catalog');

router.post('/page-data', getCatalogPageData);

module.exports = router;