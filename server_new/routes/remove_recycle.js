import express from "express";
import {moveToRecycleBin, 
    getRecycleBin, 
    restoreRecycleBin, 
    MediaConsenttoRecycleBin, 
    SelfDeclarationRecycleCycle,
    FamReqFormtoRecycleBin,
    EssentialRectoRecycleBin,
    DischargeSummarytoRecycleBin,DischargeDetailstoRecycleBin,
    SCRBForm2toRecycleBin, SCRBForm2AtoRecycleBin, SCRBForm2BtoRecycleBin, SCRBForm2CtoRecycleBin,
    RescueDetailtoRecycleBin, ConsultationtoRecycleBin
} from "../controllers/recycleController.js";

const router = express.Router();

router.delete("/movetoRecycleBin/:admission_no", moveToRecycleBin); //completed
router.get('/getRecycleBin', getRecycleBin);
router.post('/restoreRecycleBin/:admission_no', restoreRecycleBin);

//rescue Detail
router.delete("/RescueDetailtoRecycleBin/:admission_no", RescueDetailtoRecycleBin);

//media consent
router.delete("/MediaConsenttoRecycleBin/:admission_no", MediaConsenttoRecycleBin);

//self declaration 
router.delete("/SelfDeclarationRecycleCycle/:admission_no", SelfDeclarationRecycleCycle);

//family request form 
router.delete("/FamReqFormtoRecycleBin/:admission_no", FamReqFormtoRecycleBin);

//essential record
router.delete("/EssentialRectoRecycleBin/:admission_no", EssentialRectoRecycleBin);

//reunion Summary
router.delete("/DischargeSummarytoRecycleBin/:admission_no", DischargeSummarytoRecycleBin);

//discharge details
router.delete("/DischargeDetailstoRecycleBin/:admission_no", DischargeDetailstoRecycleBin);

//scrb form 2
router.delete("/SCRBForm2toRecycleBin/:admission_no", SCRBForm2toRecycleBin);

//scrb form 2A
router.delete("/SCRBForm2AtoRecycleBin/:admission_no", SCRBForm2AtoRecycleBin);

//scrb form 2B
router.delete("/SCRBForm2BtoRecycleBin/:admission_no", SCRBForm2BtoRecycleBin);

//scrb form 2C
router.delete("/SCRBForm2CtoRecycleBin/:admission_no", SCRBForm2CtoRecycleBin);

//consulation report
router.delete("/ConsultationtoRecycleBin/:admission_no", ConsultationtoRecycleBin);

export default router;