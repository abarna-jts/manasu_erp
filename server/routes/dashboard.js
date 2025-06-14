const express = require('express');
const { getRecentRescue, totalRescue, totalResident, totalReunion, getMonthlyResidentConditions, getMonthlyObserReport} = require("../controllers/dashboard");
const router = express.Router();

router.get("/get_recent_rescue", getRecentRescue);
router.get("/totalRescue", totalRescue);
router.get("/totalResident", totalResident);
router.get("/totalReunion", totalReunion);
router.get("/getMonthlyResidentConditions", getMonthlyResidentConditions);
router.get("/getMonthlyObserReport", getMonthlyObserReport);

module.exports = router;
