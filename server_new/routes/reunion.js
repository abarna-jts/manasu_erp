
import express from 'express';
import { createFamilyLetter,
    getFamilyRequestForm,
    UpdateFamilyRequestForm,
    // deleteFamilyRequest,
    getInformation,
    createSelfDeclaration,
    getSelfDeclaration,
    UpdateSelfDeclaration,
    // deleteSelfDeclaration,
    createMediaConsent,
    getMediaConsent,
    UpdateMediaConsent,
    // deleteMediaConsent,
    createDischargeList,
    getReunionChecklist,
    getReunionChecklistAll,
    updateChecklist
} from '../controllers/reunioin.js';
const router = express.Router();

router.post("/create_family_letter", createFamilyLetter); //completed
router.get("/get_family_letter/:admissionNumber",getFamilyRequestForm); //completed
router.post("/update_family_letter/:admission_no",UpdateFamilyRequestForm); //completed
// router.delete("/deleteFamilyRequest/:admissionNumber",deleteFamilyRequest); 

//self_declaration form
router.get("/get_information/:admission_no",getInformation); //completed
router.post("/create_selfDeclaration",createSelfDeclaration); //completed
router.get("/getSelfDeclaration/:admission_no",getSelfDeclaration); //completed
router.post("/updateSelfDecl/:admission_no",UpdateSelfDeclaration); //completed
// router.delete("/deleteSelfDecl/:admission_no",deleteSelfDeclaration);

//media consent form
router.post("/createMediaConsent",createMediaConsent); // completed
router.get("/getMediaConsent/:admission_no",getMediaConsent); // completed
router.post("/updateMediaConsent/:admission_no",UpdateMediaConsent); //completed
// router.delete("/deleteMediaConsent/:admission_no",deleteMediaConsent);

//discharge checklist 
router.post("/createDischarge_checklist",createDischargeList); // completed
router.get("/get_checklist/:admission_no", getReunionChecklist); // completed
router.get("/get_allCheckList/:admission_no", getReunionChecklistAll); // completed
router.post("/updatechecklist/:admission_no",updateChecklist); // completed


export default router;
