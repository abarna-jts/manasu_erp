const express = require('express');
const { createForm2 ,createForm2A,createForm2B, createForm2C} = require("../controllers/scrb_form");
const router = express.Router();

router.post("/create_form2", createForm2);
router.post("/create_form_2A", createForm2A);
router.post("/create_form_2B",createForm2B);
router.post("/create_form_2C",createForm2C);

module.exports = router;
