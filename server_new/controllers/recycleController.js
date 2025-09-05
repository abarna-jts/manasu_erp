import db from "../db.js";

const moveToRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM formality_declaration WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "formality_declaration", JSON.stringify(record)]
        );

        await db.query("DELETE FROM formality_declaration WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const MediaConsenttoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM media_consent WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "media_consent", JSON.stringify(record)]
        );

        await db.query("DELETE FROM media_consent WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const SelfDeclarationRecycleCycle = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM self_declaration WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "self_declaration", JSON.stringify(record)]
        );

        await db.query("DELETE FROM self_declaration WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const FamReqFormtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM family_request_form WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });


        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "family_request_form", JSON.stringify(record)]
        );

        await db.query("DELETE FROM family_request_form WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const EssentialRectoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM essential_records WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });


        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "essential_records", JSON.stringify(record)]
        );

        await db.query("DELETE FROM essential_records WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const DischargeSummarytoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM discharge_checklist WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });


        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "discharge_checklist", JSON.stringify(record)]
        );

        await db.query("DELETE FROM discharge_checklist WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const DischargeDetailstoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM discharge_summary WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "discharge_summary", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM discharge_summary WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const SCRBForm2toRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM form_2 WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "form_2", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM form_2 WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}


const SCRBForm2AtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM form_2a WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "form_2a", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM form_2a WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const SCRBForm2BtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM form_2b WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "form_2b", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM form_2b WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const SCRBForm2CtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM form_2c WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "form_2c", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM form_2c WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const RescueDetailtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM first_information WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "first_information", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM first_information WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const ConsultationtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM rescue_condition WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "rescue_condition", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM rescue_condition WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const DrVisittoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM dr_visit WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "dr_visit", JSON.stringify(record)]
        );

        await db.query("DELETE FROM dr_visit WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const NurseRecordtoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM nurse_record WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "nurse_record", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM nurse_record WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const PrescriptiontoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM prescription_medicines WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "prescription_medicines", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM prescription_medicines WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const InternShiptoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM internship_form WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "internship_form", JSON.stringify(record)]
        );

        await db.query("DELETE FROM internship_form WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const MedicalCamptoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM medical_camp WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "medical_camp", JSON.stringify(record)]
        );

        await db.query("DELETE FROM medical_camp WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const EventReporttoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM event_report WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "event_report", JSON.stringify(record)]
        );

        await db.query("DELETE FROM event_report WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const CelebrationtoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM celebration_report WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "celebration_report", JSON.stringify(record)]
        );

        await db.query("DELETE FROM celebration_report WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const CommunityReporttoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM community_report WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "community_report", JSON.stringify(record)]
        );

        await db.query("DELETE FROM community_report WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const StaffProgramtoRecycleBin = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM staff_report WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Not found" });

        const record = rows[0];

        // Convert Date objects to MySQL DATETIME string before saving
        Object.keys(record).forEach((key) => {
            if (record[key] instanceof Date) {
                record[key] = record[key].toISOString().slice(0, 19).replace("T", " ");
            }
        });

        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [id, "staff_report", JSON.stringify(record)]
        );

        await db.query("DELETE FROM staff_report WHERE id = ?", [id]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const observationReportToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        // 1. Fetch record
        const [rows] = await db.query(
            "SELECT * FROM observation_report WHERE admission_no = ?",
            [admission_no]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = rows[0];

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "observation_report", JSON.stringify(record)]
        );

        // 3. Delete from original table
        await db.query("DELETE FROM observation_report WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const getRecycleBin = async (req, res) => {
    const query = "Select * from recycle_bin";
    try {
        const [data] = await db.query(query);
        return res.status(200).json({ message: "Recycle Bin Get Successfully", data: data });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
};

const restoreRecycleBin = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM recycle_bin WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found in recycle bin" });

    const recycleRecord = rows[0];
    const { source_table, data } = recycleRecord;

    let record;
    try {
      record = JSON.parse(data);
    } catch (e) {
      return res.status(400).json({ error: "Invalid data format in recycle_bin" });
    }

    // ✅ Remove old id
    delete record.id;

    // ✅ Normalize ISO date strings → MySQL format
    Object.keys(record).forEach((key) => {
      if (record[key] && typeof record[key] === "string" && record[key].includes("T")) {
        const dateObj = new Date(record[key]);
        if (!isNaN(dateObj.getTime())) {
          const pad = (n) => (n < 10 ? "0" + n : n);
          record[key] =
            `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ` +
            `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
        }
      }
    });

    try {
      await db.query(`INSERT INTO ${source_table} SET ?`, record);
    } catch (dbErr) {
      console.error("DB Insert Error:", dbErr);
      return res.status(500).json({ error: "DB Insert Failed", details: dbErr.message });
    }

    await db.query("DELETE FROM recycle_bin WHERE id = ?", [id]);

    res.json({ message: `Restored to ${source_table} successfully` });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};





export {
    moveToRecycleBin,
    getRecycleBin,
    restoreRecycleBin,
    MediaConsenttoRecycleBin,
    SelfDeclarationRecycleCycle,
    FamReqFormtoRecycleBin,
    EssentialRectoRecycleBin, DischargeSummarytoRecycleBin, DischargeDetailstoRecycleBin,
    SCRBForm2toRecycleBin, SCRBForm2AtoRecycleBin, SCRBForm2BtoRecycleBin, SCRBForm2CtoRecycleBin,
    RescueDetailtoRecycleBin, ConsultationtoRecycleBin, DrVisittoRecycleBin,
    NurseRecordtoRecycleBin, PrescriptiontoRecycleBin, InternShiptoRecycleBin,
    MedicalCamptoRecycleBin, EventReporttoRecycleBin, CelebrationtoRecycleBin,
    CommunityReporttoRecycleBin, StaffProgramtoRecycleBin, observationReportToRecBin
};