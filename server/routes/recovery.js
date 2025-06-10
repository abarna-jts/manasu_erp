const express = require('express');
const { createMSEForm, createSpeech, createMood, createThough, createJudgement, createInsight, createCognition, createArticles, getArticles,updateArticles, createPerception,
    getallappearance,getallspeech,
    getallmood,getallperception,getallcognition,getMseAllForm, getallThough, getalljudgement,getallInsight, 
    updateAppearance,UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition
} = require("../controllers/recovery");

const router = express.Router();

router.post("/create_MSE", createMSEForm);

router.post("/create_speech", createSpeech);

router.post("/create_mood", createMood);

router.post("/create_though", createThough);

router.post("/create_perception", createPerception);

router.post("/create_judgement", createJudgement);

router.post("/create_insight", createInsight);

router.post("/create_cognition", createCognition);

router.get("/getappearance/:admission_no",getallappearance);
router.get("/getSpeech/:admission_no",getallspeech);
router.get("/getMood/:admission_no",getallmood);
router.get("/getThough/:admission_no",getallThough);
router.get("/getPerception/:admission_no",getallperception);
router.get("/getJudgement/:admission_no",getalljudgement);
router.get("/getInsight/:admission_no",getallInsight);
router.get("/getCognition/:admission_no",getallcognition);

//update functionality for mse
router.post("/updateAppearance/:admission_no", updateAppearance);
router.post("/updateSpeech/:admission_no", UpdateSpeech);
router.post("/updateMood/:admission_no", UpdateMood);
router.post("/updateThough/:admission_no", updateThough);
router.post("/updatePerception/:admission_no", updatePerception);
router.post("/updateJudgement/:admission_no", updateJudgement);
router.post("/updateInsight/:admission_no", updateInsight);
router.post("/updateCognition/:admission_no", updateCognition);

//all mse form data
router.get("/mseAllForm/:admission_no",getMseAllForm);

router.post("/create_articles", createArticles);
router.get("/getArticles/:admission_no",getArticles);
router.post("/updateArticles/:admission_no",updateArticles);

module.exports = router;