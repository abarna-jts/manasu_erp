const express = require('express');
const { createFamilyLetter,
    getFamilyRequestForm,
    UpdateFamilyRequestForm,
    deleteFamilyRequest,
    getInformation,
    createSelfDeclaration,
    getSelfDeclaration,
    UpdateSelfDeclaration,
    deleteSelfDeclaration,
    createMediaConsent,
    getMediaConsent,
    UpdateMediaConsent,
    deleteMediaConsent,
    createDischargeList
} = require("../controllers/reunioin");
const router = express.Router();

router.post("/create_family_letter", createFamilyLetter);
router.get("/get_family_letter/:admissionNumber",getFamilyRequestForm);
router.post("/update_family_letter/:admission_no",UpdateFamilyRequestForm);
router.delete("/deleteFamilyRequest/:admissionNumber",deleteFamilyRequest);

//self_declaration form
router.get("/get_information/:admission_no",getInformation);
router.post("/create_selfDeclaration",createSelfDeclaration);
router.get("/getSelfDeclaration/:admission_no",getSelfDeclaration);
router.post("/updateSelfDecl/:admission_no",UpdateSelfDeclaration);
router.delete("/deleteSelfDecl/:admission_no",deleteSelfDeclaration);

//media consent form
router.post("/createMediaConsent",createMediaConsent);
router.get("/getMediaConsent/:admission_no",getMediaConsent);
router.put("/updateMediaConsent/:admission_no",UpdateMediaConsent);
router.delete("/deleteMediaConsent/:admission_no",deleteMediaConsent);

//discharge checklist 
router.post("/createDischarge_checklist",createDischargeList);


module.exports = router;
