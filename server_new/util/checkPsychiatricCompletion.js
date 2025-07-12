import db from "../db.js";
export const checkPsychiatricCompletion = async (admission_no) => {
  const queries = [
    'SELECT 1 FROM basic_detail WHERE admission_no = ?',
    'SELECT 1 FROM cheif_complaint WHERE admission_no = ?',
    'SELECT 1 FROM presenting_problems WHERE admission_no = ?',
    'SELECT 1 FROM psy_history WHERE admission_no = ?',
    'SELECT 1 FROM medical_history WHERE admission_no = ?',
    'SELECT 1 FROM familyhis_data WHERE admission_no = ?',
    'SELECT 1 FROM social_history WHERE admission_no = ?',
    'SELECT 1 FROM development_history WHERE admission_no = ?',
    'SELECT 1 FROM substance_use WHERE admission_no = ?',
    'SELECT 1 FROM suicidal_data WHERE admission_no = ?',
  ];

  for (const query of queries) {
    const [rows] = await db.query(query, [admission_no]);
    if (rows.length === 0) return false;
  }

  return true;
};