import express from 'express';
import  { createMSEForm, createSpeech, createMood, createThough, createJudgement, createInsight, createCognition, createArticles, getArticles,updateArticles, createPerception,
    getallappearance,getallspeech,
    getallmood,getallperception,getallcognition,getMseAllForm, getallThough, getalljudgement,getallInsight, 
    updateAppearance,UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition,
    createBasicInformation,createChiefComplaint, createPresenting, createPsyHistory, createMedicalData, createFamilyHistoryData,
    createSocialHistoryData, createDevelopmentalData, createSubstanceData, createSuicidalData,
    getInformation, getCheifComplaint, getPresentingData, getPsychiatricData, getMedicalHistory, getFamilyHistory, getSocialHistory, getDevelopmentalHistory, getSubstanceUse,getSuicidialData,
    updateInformation, updateCheifComplaint, updatePresentingData, updatePsychiatricData, updateMedicalHistoryData, updateFamilyHistoryData, 
    updateSocialHistoryData, updateDevelopmentalData, updateSubstanceData, updateSuicidalData, getallPsychiatric
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
router.get('/getappearance/:admission_no/:date',getallappearance);//completed
//get all speech form in MSE
router.get("/getSpeech/:admission_no/:date",getallspeech); //completed
//get all mood form in MSE
router.get("/getMood/:admission_no/:date",getallmood); //completed
//get all though form in MSE
router.get("/getThough/:admission_no/:date",getallThough); //completed
//get all perception form in MSE
router.get("/getPerception/:admission_no/:date",getallperception); //completed
//get all judgement form in MSE
router.get("/getJudgement/:admission_no/:date",getalljudgement); //completed
//get all insight form in MSE
router.get("/getInsight/:admission_no/:date",getallInsight); //completed
//get all cognition form in MSE
router.get("/getCognition/:admission_no/:date",getallcognition); //completed

//update functionality for mse
//update appearance_behaviour form in MSE
router.post("/updateAppearance/:admission_no/:date", updateAppearance); //completed
//update speech form in MSE
router.post("/updateSpeech/:admission_no/:date", UpdateSpeech); //completed
//update mood form in MSE
router.post("/updateMood/:admission_no/:date", UpdateMood); //completed
//update though form in MSE
router.post("/updateThough/:admission_no/:date", updateThough); //completed
//update perception form in MSE
router.post("/updatePerception/:admission_no/:date", updatePerception); //completed
//update judgement form in MSE
router.post("/updateJudgement/:admission_no/:date", updateJudgement); //completed
//update insight form in MSE
router.post("/updateInsight/:admission_no/:date", updateInsight); //completed
//update cognition form in MSE
router.post("/updateCognition/:admission_no/:date", updateCognition); //completed

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

router.get("/get_information/:admission_no/:date", getInformation);
router.get("/get_chiefComplaint/:admission_no/:date", getCheifComplaint);
router.get("/get_presentingData/:admission_no/:date",getPresentingData);
router.get("/get_psychiatric/:admission_no/:date", getPsychiatricData);
router.get("/get_medicalHistory/:admission_no/:date", getMedicalHistory);
router.get("/get_familyHistory/:admission_no/:date", getFamilyHistory);
router.get("/get_socialHistory/:admission_no/:date", getSocialHistory);
router.get("/get_DevelopmentalHistory/:admission_no/:date", getDevelopmentalHistory);
router.get("/get_substance/:admission_no/:date", getSubstanceUse);
router.get("/get_suicidal/:admission_no/:date", getSuicidialData);

router.post("/updateInformation/:admission_no/:date", updateInformation);
router.post("/updateCheifComplaint/:admission_no/:date", updateCheifComplaint);
router.post("/updatePresentingData/:admission_no/:date", updatePresentingData);
router.post("/updatePsychiatricData/:admission_no/:date", updatePsychiatricData);
router.post("/updateMedicalHistory/:admission_no/:date", updateMedicalHistoryData);
router.post("/updateFamilyHistory/:admission_no/:date", updateFamilyHistoryData);
router.post("/updateSocialHistory/:admission_no/:date", updateSocialHistoryData);
router.post("/updateDevelopmentalHistory/:admission_no/:date", updateDevelopmentalData);
router.post("/updateSubstance/:admission_no/:date", updateSubstanceData);
router.post("/updateSuicidal/:admission_no/:date", updateSuicidalData);

router.get("/getallPsychiatric/:admission_no", getallPsychiatric);

export default router;