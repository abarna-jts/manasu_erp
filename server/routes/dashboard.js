const express = require('express');
const { getRecentRescue} = require("../controllers/dashboard");
const router = express.Router();

router.get("/get_recent_rescue", getRecentRescue);

module.exports = router;
