import { createSlice } from '@reduxjs/toolkit';

const appearanceState = {
    general_appearance: [],
    attitude: [],
    comprehension: [],
    gait_posture: [],
    motor_activity: [],
    catatonic_sign: [],
    conversion_dissociative: [],
    social_manner: [],
    rapport: [],
    hallucinatory_behaviour: []
}

const speechState = {
    rate_quantity: [],
    volume_tone: [],
    flow_rhythm: [],
}

const moodState = {
    mood_description: [],
    appearance: "",
    resident_feeling: "",
    general_feeling: "",
    mood_like: "",
    resident_general_feeling: "",
    resident_look: [],
}

const thoughState = {
    stream_form_though: [],
    content_though: [],
}

const judgementState = {
    personal_judgement: '',
    social_judgement: '',
    test_judgement: '',
    judgement: '',
}

const insightState = {
    denail_illness: '',
    slight_awareness: '',
    awarness_sick: '',
    awarness_illness: '',
    intellectual_insight: '',
    true_emotion: '',
}

const perceptionState = {
    hallucination_type: [],
    heard: '',
    voices_heard: '',
    part_of_day: '',
    female_male_voices: '',
    interpreted_person: '',
    illusion: [],
    perception_changes: [],
    somatic: [],
    others: [],
}

const cognitionState = {
    consciousness: [],
    orientation_time: '',
    orientation_place: '',
    orientation_person: '',
    consciousnessState: '',
    canConcentrate: '',
    distractibility: '',
    asking_test: '',
    names_months: '',
    test_performance: '',
    immediate_retention: '',
    recall: '',
    patient_place: '',
    dinner_ate: '',
    date_ofMrg: '',
    birthdays_children: '',
    person_past: '',
    amnesia: '',
    live_growing: '',
    person_school: '',
    breakfast_ques: '',
    do_yesterday: '',
    general_info: '',
    test_red_wri: '',
    calculation_test: '',
    proverb_testing: '',
    familiar_object: '',
    consciousnessState:'',
}

// const baseState = {
//   admission_no: '',
//   date: '',
// };

const initialState = {
    // ...baseState,
    ...appearanceState,
    ...speechState,
    ...moodState,
    ...thoughState,
    ...judgementState,
    ...insightState,
    ...perceptionState,
    ...cognitionState
}

const MSESlice = createSlice({
    name: 'mse',
    initialState,
    reducers: {
        setMSEField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetGeneralData(state) {
            Object.keys(appearanceState).forEach(f => {
                state[f] = appearanceState[f];
            });
        },
        resetSpeechData(state) {
            Object.keys(speechState).forEach(f => {
                state[f] = speechState[f];
            });
        },
        resetMoodData(state) {
            Object.keys(moodState).forEach(f => {
                state[f] = moodState[f];
            });
        },
        resetThoughData(state) {
            Object.keys(thoughState).forEach(f => {
                state[f] = thoughState[f];
            });
        },
        resetJudgementData(state) {
            Object.keys(judgementState).forEach(f => {
                state[f] = judgementState[f];
            });
        },
        resetInsightData(state) {
            Object.keys(insightState).forEach(f => {
                state[f] = insightState[f];
            });
        },
        resetPerceptionData(state) {
            Object.keys(perceptionState).forEach(f => {
                state[f] = perceptionState[f];
            });
        },
        resetCognitionData(state) {
            Object.keys(cognitionState).forEach(f => {
                state[f] = cognitionState[f];
            });
        },
    },
});

export const {
    setMSEField,
    resetAll,
    resetGeneralData,
    resetSpeechData,
    resetMoodData,
    resetThoughData,
    resetJudgementData,
    resetPerceptionData,
    resetCognitionData, resetInsightData } = MSESlice.actions;

export default MSESlice.reducer;