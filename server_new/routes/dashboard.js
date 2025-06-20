import express from 'express';
import {getRecentRescue, totalRescue, totalResident, totalReunion, getMonthlyResidentConditions, getMonthlyObserReport} from '../controllers/dashboard.js';
const router = express.Router();

router.get("/get_recent_rescue", getRecentRescue); //changed
router.get("/totalRescue", totalRescue); //changed
router.get("/totalResident", totalResident);//changed
router.get("/totalReunion", totalReunion);//changed
router.get("/getMonthlyResidentConditions", getMonthlyResidentConditions);//changed
router.get("/getMonthlyObserReport", getMonthlyObserReport);//changed

export default router;
