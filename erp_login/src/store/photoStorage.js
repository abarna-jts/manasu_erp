// photoStorage.js
import localforage from "localforage";

localforage.config({
  name: "ObservationApp",
  storeName: "attachments",
});

// ---------------- Recovery Photos ----------------

export const saveRecoveryPhotos = async (files) => {
  await localforage.setItem("recovery_photo", files); // store raw File objects
};

export const loadRecoveryPhotos = async () => {
  const files = await localforage.getItem("recovery_photo");
  return files || [];
};

export const clearRecoveryPhotos = async () => {
  await localforage.removeItem("recovery_photo");
};

// ---------------- Summary Attachments ----------------
export const saveSummaryAttach = async (files) => {
  await localforage.setItem("summary_attach", files);
};

export const loadSummaryAttach = async () => {
  const files = await localforage.getItem("summary_attach");
  return files || [];
};

export const clearSummaryAttach = async () => {
  await localforage.removeItem("summary_attach");
};

// ---------------- Consultation Recovery Photo Attachments ----------------
export const saveConsultationRecoveryPhoto = async (files) => {
  await localforage.setItem("rescue_recovery_photo", files);
};

export const loadConsultationRecoveryPhoto = async () => {
  const files = await localforage.getItem("rescue_recovery_photo");
  return files || [];
};

export const clearConsultationRecoveryPhoto = async () => {
  await localforage.removeItem("rescue_recovery_photo");
};