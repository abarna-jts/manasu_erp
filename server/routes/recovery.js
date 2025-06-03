const express = require('express');
const { createMSEForm, createSpeech, createMood, createCognition, createArticles, getArticles,updateArticles, createPerception} = require("../controllers/recovery");

const router = express.Router();

router.post("/create_MSE", createMSEForm);

router.post("/create_speech", createSpeech);

router.post("/create_mood", createMood);

router.post("/create_perception", createPerception);

router.post("/create_cognition", createCognition);

router.post("/create_articles", createArticles);
router.get("/getArticles/:admission_no",getArticles);
router.post("/updateArticles/:admission_no",updateArticles);

module.exports = router;