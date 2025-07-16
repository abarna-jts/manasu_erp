import express from 'express';
import  { createMSEForm, createSpeech, createMood, createThough, createJudgement, createInsight, createCognition, createArticles, getArticles,updateArticles, createPerception,
    getallappearance,getallspeech,
    getallmood,getallperception,getallcognition,getMseAllForm, getallThough, getalljudgement,getallInsight, 
    updateAppearance,UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition,
    createBasicInformation,createChiefComplaint, createPresenting, createPsyHistory, createMedicalData, createFamilyHistoryData,
    createSocialHistoryData, createDevelopmentalData, createSubstanceData, createSuicidalData,
    getInformation, getCheifComplaint, getPresentingData, getPsychiatricData, getMedicalHistory, getFamilyHistory, getSocialHistory, getDevelopmentalHistory, getSubstanceUse,getSuicidialData,
    updateInformation, updateCheifComplaint, updatePresentingData, updatePsychiatricData, updateMedicalHistoryData, updateFamilyHistoryData, 
    updateSocialHistoryData, updateDevelopmentalData, updateSubstanceData, updateSuicidalData, getallPsychiatric,
    getBasicDetail, getCheif, getPresenting, getPsyHistory, getMedHis, getFamHistory, getSocialHis, getDevHistory, getSubUseHistory, getSuicidalUse,
    getGenAppearance, getSpeech, getMoodAffect, getThough, getPerception, getCognition, getJudgement, getInsight
} from '../controllers/recovery.js';

const router = express.Router();
//create appearance_behaviour form in MSE 
router.post("/create_MSE", createMSEForm); //completed
//create speech form in MSE
router.post("/create_speech", createSpeech); //completed
//create mood form in MSE
router.post("/create_mood", createMood); //completed
//create though form in MSE
router.post("/create_though", createThough); //completed
//create perception form in MSE
router.post("/create_perception", createPerception); //completed
//create judgement form in MSE
router.post("/create_judgement", createJudgement); //completed
//create insight form in MSE
router.post("/create_insight", createInsight); //completed
//create cognition form in MSE
router.post("/create_cognition", createCognition); //completed

//get all mse form data
//get all appearance_behaviour form in MSE
router.get('/getappearance/:id',getallappearance);//completed
//get all speech form in MSE
router.get("/getSpeech/:id",getallspeech); //completed
//get all mood form in MSE
router.get("/getMood/:id",getallmood); //completed
//get all though form in MSE
router.get("/getThough/:id",getallThough); //completed
//get all perception form in MSE
router.get("/getPerception/:id",getallperception); //completed
//get all judgement form in MSE
router.get("/getJudgement/:id",getalljudgement); //completed
//get all insight form in MSE
router.get("/getInsight/:id",getallInsight); //completed
//get all cognition form in MSE
router.get("/getCognition/:id",getallcognition); //completed

//update functionality for mse
//update appearance_behaviour form in MSE
router.post("/updateAppearance/:id", updateAppearance); //completed
//update speech form in MSE
router.post("/updateSpeech/:id", UpdateSpeech); //completed
//update mood form in MSE
router.post("/updateMood/:id", UpdateMood); //completed
//update though form in MSE
router.post("/updateThough/:id", updateThough); //completed
//update perception form in MSE
router.post("/updatePerception/:id", updatePerception); //completed
//update judgement form in MSE
router.post("/updateJudgement/:id", updateJudgement); //completed
//update insight form in MSE
router.post("/updateInsight/:id", updateInsight); //completed
//update cognition form in MSE
router.post("/updateCognition/:id", updateCognition); //completed

//all mse form data
router.get("/mseAllForm/:admission_no",getMseAllForm); //completed

//articles form in MSE (Not used in frontend)
router.post("/create_articles", createArticles); //completed (not used in frontend)
router.get("/getArticles/:admission_no",getArticles); //completed (not used in frontend)
router.post("/updateArticles/:admission_no",updateArticles); //completed (not used in frontend)

//psychiatric form
router.post("/create_information", createBasicInformation);
router.post("/create_chiefComplaint",createChiefComplaint);
router.post("/create_presenting",createPresenting);
router.post("/create_psyhistory", createPsyHistory);
router.post("/create_medicalData", createMedicalData);
router.post("/create_familyData", createFamilyHistoryData);
router.post("/create_socialData", createSocialHistoryData);
router.post("/create_developmentalData", createDevelopmentalData);
router.post("/create_substanceData", createSubstanceData);
router.post("/create_suicidalData", createSuicidalData);

// router.get("/get_information/:admission_no/:date", getInformation);
// router.get("/get_chiefComplaint/:admission_no/:date", getCheifComplaint);
// router.get("/get_presentingData/:admission_no/:date",getPresentingData);
// router.get("/get_psychiatric/:admission_no/:date", getPsychiatricData);
// router.get("/get_medicalHistory/:admission_no/:date", getMedicalHistory);
// router.get("/get_familyHistory/:admission_no/:date", getFamilyHistory);
// router.get("/get_socialHistory/:admission_no/:date", getSocialHistory);
// router.get("/get_DevelopmentalHistory/:admission_no/:date", getDevelopmentalHistory);
// router.get("/get_substance/:admission_no/:date", getSubstanceUse);
// router.get("/get_suicidal/:admission_no/:date", getSuicidialData);

router.post("/updateInformation/:id", updateInformation);
router.post("/updateCheifComplaint/:id", updateCheifComplaint);
router.post("/updatePresentingData/:id", updatePresentingData);
router.post("/updatePsychiatricData/:id", updatePsychiatricData);
router.post("/updateMedicalHistory/:id", updateMedicalHistoryData);
router.post("/updateFamilyHistory/:id", updateFamilyHistoryData);
router.post("/updateSocialHistory/:id", updateSocialHistoryData);
router.post("/updateDevelopmentalHistory/:id", updateDevelopmentalData);
router.post("/updateSubstance/:id", updateSubstanceData);
router.post("/updateSuicidal/:id", updateSuicidalData);

router.get("/getallPsychiatric/:admission_no", getallPsychiatric);

router.get("/get_information/:id", getInformation);
router.get("/get_chiefComplaint/:id", getCheifComplaint);
router.get("/get_presentingData/:id",getPresentingData);
router.get("/get_psychiatric/:id", getPsychiatricData);
router.get("/get_medicalHistory/:id", getMedicalHistory);
router.get("/get_familyHistory/:id", getFamilyHistory);
router.get("/get_socialHistory/:id", getSocialHistory);
router.get("/get_DevelopmentalHistory/:id", getDevelopmentalHistory);
router.get("/get_substance/:id", getSubstanceUse);
router.get("/get_suicidal/:id", getSuicidialData);

router.get("/get_info", getBasicDetail);
router.get("/get_chief", getCheif);
router.get("/get_presenting", getPresenting);
router.get("/get_psy", getPsyHistory);
router.get("/get_medical", getMedHis);
router.get("/get_family", getFamHistory);
router.get("/get_social", getSocialHis);
router.get("/get_developmental", getDevHistory);
router.get("/get_subUse", getSubUseHistory);
router.get("/get_suicidalUse", getSuicidalUse);

router.get("/get_genAppearance", getGenAppearance);
router.get("/get_speech", getSpeech);
router.get("/get_moodAffect", getMoodAffect);
router.get("/get_though", getThough);
router.get("/get_perception", getPerception);
router.get("/get_cognition", getCognition);
router.get("/get_judgement", getJudgement);
router.get("/get_insight", getInsight);

export default router;