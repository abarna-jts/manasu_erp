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
// ---------------- Essential Record Attachments ----------------
export const saveBankPassbook = async (files) => {
  await localforage.setItem("bank_passbook", files);
};

export const saveForm7Attachment = async (files) => {
  await localforage.setItem("form7_attach", files);
};

export const saveAadharAttach = async (files) => {
  await localforage.setItem("attach_aadhar", files);
};

export const saveUdidAttach = async (files) => {
  await localforage.setItem("udid_attach", files);
};

export const loadBankPassbook = async () => {
  const files = await localforage.getItem("bank_passbook");
  return files || [];
};

export const loadForm7Attachment = async () => {
  const files = await localforage.getItem("form7_attach");
  return files || [];
};

export const loadAadharAttach = async () => {
  const files = await localforage.getItem("attach_aadhar");
  return files || [];
};

export const loadUdidAttach = async () => {
  const files = await localforage.getItem("udid_attach");
  return files || [];
};

export const clearBankPassbook = async () => {
  await localforage.removeItem("bank_passbook");
};

export const clearForm7Attachment = async () => {
  await localforage.removeItem("form7_attach");
};

export const clearAadharAttach = async () => {
  await localforage.removeItem("attach_aadhar");
};

export const clearUdidAttach = async () => {
  await localforage.removeItem("udid_attach");
};

// ---------------- Family Request Form Attachments ----------------

export const saveFamAadharCard = async (files) => {
  await localforage.setItem("f_aadhar_card", files);
};

export const saveFamRationCard = async (files) => {
  await localforage.setItem("f_ration_card", files);
};

export const saveResAadharCard = async (files) => {
  await localforage.setItem("r_aadhar_card", files);
};

export const saveResRationCard = async (files) => {
  await localforage.setItem("r_ration_card", files);
};

export const saveGovtID = async (files) => {
  await localforage.setItem("govt_id", files);
};

export const loadFamAadharCard = async () => {
  const files = await localforage.getItem("f_aadhar_card");
  return files || [];
};

export const loadFamRationCard = async () => {
  const files = await localforage.getItem("f_ration_card");
  return files || [];
};

export const loadResAadharCard = async () => {
  const files = await localforage.getItem("r_aadhar_card");
  return files || [];
};

export const loadResRationCard = async () => {
  const files = await localforage.getItem("r_ration_card");
  return files || [];
};

export const loadGovtID = async () => {
  const files = await localforage.getItem("govt_id");
  return files || [];
};

export const clearFamAadharCard = async () => {
  await localforage.removeItem("f_aadhar_card");
};

export const clearFamRationCard = async () => {
  await localforage.removeItem("f_ration_card");
};

export const clearResAadharCard = async () => {
  await localforage.removeItem("r_aadhar_card");
};

export const clearResRationCard = async () => {
  await localforage.removeItem("r_ration_card");
};

export const clearGovtID = async () => {
  await localforage.removeItem("govt_id");
};