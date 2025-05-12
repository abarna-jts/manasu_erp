const express = require('express');
const { createFamilyLetter,
    getFamilyRequestForm,
    UpdateFamilyRequestForm,
    getInformation,
    createSelfDeclaration,
    getSelfDeclaration,
    UpdateSelfDeclaration,
    createMediaConsent
} = require("../controllers/reunioin");
const router = express.Router();

router.post("/create_family_letter", createFamilyLetter);
router.get("/get_family_letter/:admissionNumber",getFamilyRequestForm);
router.post("/update_family_letter/:admission_no",UpdateFamilyRequestForm);

//self_declaration form
router.get("/get_information/:admission_no",getInformation);
router.post("/create_selfDeclaration",createSelfDeclaration);
router.get("/getSelfDeclaration/:admission_no",getSelfDeclaration);
router.post("/updateSelfDecl/:admission_no",UpdateSelfDeclaration);

//media consent form
router.post("/createMediaConsent",createMediaConsent);


module.exports = router;
