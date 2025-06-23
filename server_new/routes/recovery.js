import express from 'express';
import  { createMSEForm, createSpeech, createMood, createThough, createJudgement, createInsight, createCognition, createArticles, getArticles,updateArticles, createPerception,
    getallappearance,getallspeech,
    getallmood,getallperception,getallcognition,getMseAllForm, getallThough, getalljudgement,getallInsight, 
    updateAppearance,UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition
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
router.get("/getappearance/:admission_no",getallappearance);//completed
//get all speech form in MSE
router.get("/getSpeech/:admission_no",getallspeech); //completed
//get all mood form in MSE
router.get("/getMood/:admission_no",getallmood); //completed
//get all though form in MSE
router.get("/getThough/:admission_no",getallThough); //completed
//get all perception form in MSE
router.get("/getPerception/:admission_no",getallperception); //completed
//get all judgement form in MSE
router.get("/getJudgement/:admission_no",getalljudgement); //completed
//get all insight form in MSE
router.get("/getInsight/:admission_no",getallInsight); //completed
//get all cognition form in MSE
router.get("/getCognition/:admission_no",getallcognition); //completed

//update functionality for mse
//update appearance_behaviour form in MSE
router.post("/updateAppearance/:admission_no", updateAppearance); //completed
//update speech form in MSE
router.post("/updateSpeech/:admission_no", UpdateSpeech); //completed
//update mood form in MSE
router.post("/updateMood/:admission_no", UpdateMood); //completed
//update though form in MSE
router.post("/updateThough/:admission_no", updateThough); //completed
//update perception form in MSE
router.post("/updatePerception/:admission_no", updatePerception); //completed
//update judgement form in MSE
router.post("/updateJudgement/:admission_no", updateJudgement); //completed
//update insight form in MSE
router.post("/updateInsight/:admission_no", updateInsight); //completed
//update cognition form in MSE
router.post("/updateCognition/:admission_no", updateCognition); //completed

//all mse form data
router.get("/mseAllForm/:admission_no",getMseAllForm); //completed

//articles form in MSE (Not used in frontend)
router.post("/create_articles", createArticles); //completed (not used in frontend)
router.get("/getArticles/:admission_no",getArticles); //completed (not used in frontend)
router.post("/updateArticles/:admission_no",updateArticles); //completed (not used in frontend)

export default router;