import { createSlice } from '@reduxjs/toolkit';

const demographicState = {
  patient_name: '',
  patient_age: '',
  sexual_orientation: '',
  education_bg: '',
  occupation: '',
  marital_status: '',
  economic_status: '',
  religion: '',
  informant: '',
  residential_address: '',
  living_arrangements: '',
  family_structure: '',
  cultural_identity: '',
  language1: '',
  language2: '',
};

const cheifState = {
  chief_complaint: '',
  onset_duration: '',
  nature_symptoms: '',
  severity: '',
  course_type: '',
  nature_illness: '',
  identify_trigger: '',
  life_changes: '',
  biological: '',
  psychological: '',
  social_environment: '',
};

const presentingState = {
  history_presenting: '',
  mood_affect: [],
  though_content: [],
  though_process: [],
  perception: [],
  behavioural_changes: [],
  sleep_patterns: [],
  energy_level: '',
  appetite_weight: '',
  occupation_academic: '',
  interpersonal_relationship: '',
  selfCare_activity: '',
  recreation_activity: '',
};

const psyhistoryState = {
  psychiatric_diagnoses: '',
  treatment_history: '',
  medications: '',
  dosage: '',
  adherence: '',
  sideEffect: '',
  experience_reaction: '',
  hospitalisation_reason: '',
  duration: '',
  crisis_episodes: '',
  fm_mentalHealth: '',
  significant_life: '',
  chronic_stressors: '',
  other_exploration: '',
  other_legalEnvironment: '',
  trauma_exploration: [],
  legal_environment: [],
};

const medicalState = {
  disability_status: '',
  chronic_medical: '',
  acute_health: '',
  medication: '',
  medication_allergies: '',
  other_allergy: [],
  significant_medical: [],
  traumatic_injuries: '',
  sexual_health: [],
};

const familyState = {
  family_composition: [],
  family_dynamics: [],
  marriage_type: '',
  family_history: '',
  genetic_predisposition: '',
  family_changes: [],
  family_substance: '',
  
};

const socialState = {
  family_relationship: '',
  socialCircle_relationship: '',
  relationship_significant: '',
  living_arrangements: '',
  education_bg: '',
  currentEmp_status: '',
  socialRecreation_activity: '',
  social_outlets: '',
  socialMed_engagement: '',
  technology_related: '',
};

const developmentState = {
  prenatal_factors: '',
  birth_details: '',
  birth_order: '',
  siblings_number: '',
  bonding_attachment: '',
  milestones_development: '',
  childhood_illness: '',
  siblings_relationship: '',
  parenting_style: '',
  learning_challenge: '',
  pubertal_development: '',
};

const substanceState = {
  substance_use: '',
  age_onset: '',
  frequency: '',
  quantity: '',
  motivation_use: '',
  environmental_trigger: '',
  impact_occupation: '',
  impact_interpersonal: '',
  financial_consequences: '',
  craving_intensity: '',
  previous_treatment: '',
  relapse_history: '',
};

const suicidalState = {
  suicide_history: '',
  triggers_stressors: '',
  homicidal_ideation: '',
  target_method: '',
  immediate_threat: '',
  emergency_response: '',
  hospital_required: '',
};

// base fields
const baseState = {
  admission_no: '',
  date: '',
};

// compose the full initial state
const initialState = {
  ...baseState,
  ...demographicState,
  ...cheifState,
  ...presentingState,
  ...psyhistoryState,
  ...medicalState,
  ...familyState,
  ...socialState,
  ...developmentState,
  ...substanceState,
  ...suicidalState,
};

const psychiatricSlice = createSlice({
  name: 'psychiatric',
  initialState,
  reducers: {
    setField(state, { payload: { field, value } }) {
      state[field] = value;
    },
    resetAll() {
      return initialState;
    },
    resetDemographics(state) {
      Object.keys(demographicState).forEach(f => {
        state[f] = demographicState[f];
      });
    },
    resetCheifState(state) {
      Object.keys(cheifState).forEach(f => {
        state[f] = cheifState[f];
      });
    },
    resetPresentationState(state) {
      Object.keys(presentingState).forEach(f => {
        state[f] = presentingState[f];
      });
    },
    resetPsychiatricState(state) {
      Object.keys(psyhistoryState).forEach(f => {
        state[f] = psyhistoryState[f];
      });
    },
    resetMedicalState(state) {
      Object.keys(medicalState).forEach(f => {
        state[f] = medicalState[f];
      });
    },
    resetFamilyState(state) {
      Object.keys(familyState).forEach(f => {
        state[f] = familyState[f];
      });
    },
    resetSocialState(state) {
      Object.keys(socialState).forEach(f => {
        state[f] = socialState[f];
      });
    },
    resetDevelopmentState(state) {
      Object.keys(developmentState).forEach(f => {
        state[f] = developmentState[f];
      });
    },
    resetSubstanceState(state) {
      Object.keys(substanceState).forEach(f => {
        state[f] = substanceState[f];
      });
    },
    resetSuicidialState(state) {
      Object.keys(suicidalState).forEach(f => {
        state[f] = suicidalState[f];
      });
    },
  },
});

export const {
  setField,
  resetAll,
  resetDemographics,
  resetCheifState,
  resetPresentationState,
  resetPsychiatricState,
  resetMedicalState,
  resetFamilyState,
  resetSocialState,
  resetDevelopmentState,
  resetSubstanceState,
  resetSuicidialState,
} = psychiatricSlice.actions;

export default psychiatricSlice.reducer;
