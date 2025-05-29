const express = require('express');
const { createMSEForm, createSpeech, createMood, createThough, crateJudgement, createPerception, createInsight} = require("../controllers/recovery");

const router = express.Router();

router.post("/create_MSE", createMSEForm);

router.post("/create_speech", createSpeech);

router.post("/create_mood", createMood);

router.post("/create_though",createThough);

router.post("/create_judgement", crateJudgement);

router.post("/create_insight", createInsight);

router.post("/create_perception", createPerception);

module.exports = router;