import express from "express";
import { restoreRecycleBin, BasicDetailToRecBin, observationReportToRecBin,
    CheifComplainttoRecycleBin, PresentingPrbtoRecBin, PsyHistoryToRecBin,
    MedHistoryToRecBin, FamHistoryToRecBin, socialHistoryToRecBin, DevistoryToRecBin,
    SubstanceHistoryToRecBin, suicidialUseToRecBin, GeneralAppyToRecBin, SpeechToRecBin,
    MoodAffectToRecBin, ThoughToRecBin, PreceptionToRecBin, CognitionToRecBin,
    JudgementToRecBin
 } from "../controllers/social_worker_recycle.js";

const router = express.Router();

router.post('/restoreRecycleBin/:id', restoreRecycleBin);

router.delete("/BasicDetailToRecBin/:admission_no", BasicDetailToRecBin);

//observation report
router.delete("/observationReportToRecBin/:admission_no", observationReportToRecBin);

//cheif complaint
router.delete("/CheifComplainttoRecycleBin/:admission_no", CheifComplainttoRecycleBin);

//presenting problems
router.delete("/PresentingPrbtoRecBin/:admission_no", PresentingPrbtoRecBin);

//psy history
router.delete("/PsyHistoryToRecBin/:admission_no", PsyHistoryToRecBin);

//med history
router.delete("/MedHistoryToRecBin/:admission_no", MedHistoryToRecBin);

//fam history
router.delete("/FamHistoryToRecBin/:admission_no", FamHistoryToRecBin);

//social history
router.delete("/socialHistoryToRecBin/:admission_no", socialHistoryToRecBin);

//devlopment history
router.delete("/DevistoryToRecBin/:admission_no", DevistoryToRecBin);

//SubstanceHistoryToRecBin
router.delete("/SubstanceHistoryToRecBin/:admission_no", SubstanceHistoryToRecBin);

//sucidial use 
router.delete("/suicidialUseToRecBin/:admission_no", suicidialUseToRecBin);

//general appearance
router.delete("/GeneralAppyToRecBin/:admission_no", GeneralAppyToRecBin);

//speech
router.delete("/SpeechToRecBin/:admission_no", SpeechToRecBin);

//mood & affect
router.delete("/MoodAffectToRecBin/:admission_no", MoodAffectToRecBin)

//though 
router.delete("/ThoughToRecBin/:admission_no", ThoughToRecBin);

//perception 
router.delete("/PreceptionToRecBin/:admission_no", PreceptionToRecBin);

//cognition
router.delete("/CognitionToRecBin/:admission_no", CognitionToRecBin);

//judgement
router.delete("/JudgementToRecBin/:admission_no", JudgementToRecBin);

export default router;