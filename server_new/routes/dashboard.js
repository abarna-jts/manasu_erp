const express = require('express');
const { getRecentRescue, totalRescue, totalResident, totalReunion, getMonthlyResidentConditions, getMonthlyObserReport} = require("../controllers/dashboard");
const router = express.Router();

router.get("/get_recent_rescue", getRecentRescue); //changed
router.get("/totalRescue", totalRescue); //changed
router.get("/totalResident", totalResident);//changed
router.get("/totalReunion", totalReunion);//changed
router.get("/getMonthlyResidentConditions", getMonthlyResidentConditions);//changed
router.get("/getMonthlyObserReport", getMonthlyObserReport);//changed

module.exports = router;
