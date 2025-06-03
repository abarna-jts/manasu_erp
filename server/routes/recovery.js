const express = require('express');
const { createMSEForm, createSpeech, createMood, createCognition, createArticles, getArticles,updateArticles, createPerception,
    getallMSE,getallspeech,
    getallmood,getallperception,getallcognition
} = require("../controllers/recovery");

const router = express.Router();

router.post("/create_MSE", createMSEForm);

router.post("/create_speech", createSpeech);

router.post("/create_mood", createMood);

router.post("/create_perception", createPerception);

router.post("/create_cognition", createCognition);

router.get("/mse",getallMSE);
router.get("/speech",getallspeech);
router.get("/mood",getallmood);
router.get("/perception",getallperception);
router.get("/cognition",getallcognition);

router.post("/create_articles", createArticles);
router.get("/getArticles/:admission_no",getArticles);
router.post("/updateArticles/:admission_no",updateArticles);

module.exports = router;