import { configureStore } from '@reduxjs/toolkit';
import admissionReducer from './admissionSlice';
import psychiatricReducer from './psychiatricSlice';
import MSEReducer from './MSESlice';
import observationReducer from './observationSlice';
import reunionSummaryReducer from './reunionSummarySlice';
import consultationReducer from './consultationSlice';
import nurseRecordReducer from './nurseRecordSlice';
import drVisitReducer from './drVisitSlice';
import medicalCampReducer from './medicalCampSlice';
import prescriptionReducer from './prescriptionSlice';
import essentialReducer from './essentialSlice';
import familyReqReducer from './familyReqSlice';
import selfDeclarationReducer from './selfDeclarationSlice';
import mediaConsentReducer from './mediaConsentSlice';
import handOverReducer from './handOverSlice';

const STORAGE_KEYS = {
  admission: 'admissionState',
  psychiatric: 'psychiatricState',
  mse: 'mseState',
  observation: 'observationState',
  reunion: 'reunionSummary',
  consultation: 'consultationState',
  nurse_record: 'nurseRecordState',
  dr_visit: 'drVisitState',
  medical_camp: 'medicalCampState',
  prescription: 'prescriptionState',
  essential: 'essentialState',
  family_request: 'familyRequestState',
  self_declaration: 'self_declaration',
  media_consent: 'media_consent',
  handOver: 'handOver',
};

// Load from localStorage
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const makeStored = data => ({
  value: data,
  savedAt: Date.now(),
});

const isExpired = savedAt => Date.now() - savedAt > EXPIRY_MS;

// Load from localStorage with expiry check
const loadState = () => {
  try {
    const admissionRaw = localStorage.getItem(STORAGE_KEYS.admission);
    const psychiatricRaw = localStorage.getItem(STORAGE_KEYS.psychiatric);
    const MSERaw = localStorage.getItem(STORAGE_KEYS.mse);
    const ObservationRaw = localStorage.getItem(STORAGE_KEYS.observation);
    const ReunionSummaryRaw = localStorage.getItem(STORAGE_KEYS.reunion);
    const ConsultationRaw = localStorage.getItem(STORAGE_KEYS.consultation);
    const nurseRecordRaw = localStorage.getItem(STORAGE_KEYS.nurse_record);
    const drVisitRaw = localStorage.getItem(STORAGE_KEYS.dr_visit);
    const medical_campRaw = localStorage.getItem(STORAGE_KEYS.medical_camp);
    const prescriptionRaw = localStorage.getItem(STORAGE_KEYS.prescription);
    const essentialRaw = localStorage.getItem(STORAGE_KEYS.essential);
    const familyReqRaw = localStorage.getItem(STORAGE_KEYS.family_request);
    const selfDeclarationRaw = localStorage.getItem(STORAGE_KEYS.self_declaration);
    const mediaConsentRaw = localStorage.getItem(STORAGE_KEYS.media_consent);
    const handOverRaw = localStorage.getItem(STORAGE_KEYS.handOver);

    const parse = raw => {
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.savedAt === 'number') {
        if (isExpired(parsed.savedAt)) {
          return undefined; // expired
        }
        return parsed.value;
      }
      // fallback if old format (no expiry info)
      return parsed;
    };

    return {
      admission: parse(admissionRaw),
      psychiatric: parse(psychiatricRaw),
      mse: parse(MSERaw),
      observation: parse(ObservationRaw),
      reunion: parse(ReunionSummaryRaw),
      consultation: parse(ConsultationRaw),
      nurse_record: parse(nurseRecordRaw),
      dr_visit: parse(drVisitRaw),
      medical_camp: parse(medical_campRaw),
      prescription: parse(prescriptionRaw),
      essential: parse(essentialRaw),
      family_request: parse(familyReqRaw),
      self_declaration: parse(selfDeclarationRaw),
      media_consent: parse(mediaConsentRaw),
      handOver: parse(handOverRaw)
    };
  } catch {
    return undefined;
  }
};

// Save to localStorage (wrap with timestamp)
const saveState = (state) => {
  try {
    if (state.admission !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.admission,
        JSON.stringify(makeStored(state.admission))
      );
    }
    if (state.psychiatric !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.psychiatric,
        JSON.stringify(makeStored(state.psychiatric))
      );
    }
    if (state.mse !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.mse,
        JSON.stringify(makeStored(state.mse))
      );
    }
    if (state.observation !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.observation,
        JSON.stringify(makeStored(state.observation))
      );
    }
    if (state.reunion !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.reunion,
        JSON.stringify(makeStored(state.reunion))
      );
    }
    if (state.consultation !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.consultation,
        JSON.stringify(makeStored(state.consultation))
      );
    }
    if (state.nurse_record !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.nurse_record,
        JSON.stringify(makeStored(state.nurse_record))
      );
    }
    if (state.dr_visit !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.dr_visit,
        JSON.stringify(makeStored(state.dr_visit))
      );
    }
    if (state.medical_camp !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.medical_camp,
        JSON.stringify(makeStored(state.medical_camp))
      );
    }
    if (state.prescription !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.prescription,
        JSON.stringify(makeStored(state.prescription))
      );
    }
    if (state.essential !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.essential,
        JSON.stringify(makeStored(state.essential))
      );
    }
    if (state.family_request !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.family_request,
        JSON.stringify(makeStored(state.family_request))
      );
    }
    if (state.self_declaration !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.self_declaration,
        JSON.stringify(makeStored(state.self_declaration))
      );
    }
    if (state.media_consent !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.media_consent,
        JSON.stringify(makeStored(state.media_consent))
      );
    }
    if (state.handOver !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.handOver,
        JSON.stringify(makeStored(state.handOver))
      );
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    admission: admissionReducer,
    psychiatric: psychiatricReducer,
    mse: MSEReducer,
    observation: observationReducer,
    reunion: reunionSummaryReducer,
    consultation: consultationReducer,
    nurse_record: nurseRecordReducer,
    dr_visit: drVisitReducer,
    medical_camp: medicalCampReducer,
    prescription: prescriptionReducer,
    essential: essentialReducer,
    family_request: familyReqReducer,
    self_declaration: selfDeclarationReducer,
    media_consent: mediaConsentReducer,
    handOver: handOverReducer
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

export default store;
