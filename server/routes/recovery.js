const express = require('express');
const { createMSEForm, createSpeech, createMood} = require("../controllers/recovery");

const router = express.Router();

router.post("/create_MSE", createMSEForm);

router.post("/create_speech", createSpeech);

router.post("/create_mood", createMood);

module.exports = router;