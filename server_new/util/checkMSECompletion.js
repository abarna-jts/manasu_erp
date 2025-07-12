import db from "../db.js";
export const checkMSECompletion = async (admission_no) => {
  const queries = [
    'SELECT 1 FROM general_appearance WHERE admission_no = ?',
    'SELECT 1 FROM speech WHERE admission_no = ?',
    'SELECT 1 FROM mood_affect WHERE admission_no = ?',
    'SELECT 1 FROM though_form WHERE admission_no = ?',
    'SELECT 1 FROM perception WHERE admission_no = ?',
    'SELECT 1 FROM judgement WHERE admission_no = ?',
    'SELECT 1 FROM insight WHERE admission_no = ?',
    'SELECT 1 FROM conginition WHERE admission_no = ?',
  ];

  for (const query of queries) {
    const [rows] = await db.query(query, [admission_no]);
    if (rows.length === 0) return false;
  }

  return true;
};
