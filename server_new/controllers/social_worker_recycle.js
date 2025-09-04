import db from "../db.js";

const restoreRecycleBin = async (req, res) => {
    const { id } = req.params; // recycle_bin.id

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

        // remove auto id fields to prevent duplicate issues
        delete record.id;

        await db.query(`INSERT INTO ${source_table} SET ?`, record);

        await db.query("DELETE FROM recycle_bin WHERE id = ?", [id]);

        res.json({ message: `Restored to ${source_table} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const BasicDetailToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM basic_detail WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "basic_detail", JSON.stringify(record)]
        );

        await db.query("DELETE FROM basic_detail WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const observationReportToRecBin = async (req, res) =>{
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

const CheifComplainttoRecycleBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM cheif_complaint WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "cheif_complaint", JSON.stringify(record)]
        );

        await db.query("DELETE FROM cheif_complaint WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const PresentingPrbtoRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM presenting_problems WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "presenting_problems", JSON.stringify(record)]
        );

        await db.query("DELETE FROM presenting_problems WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const PsyHistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM psy_history WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "psy_history", JSON.stringify(record)]
        );

        await db.query("DELETE FROM psy_history WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const MedHistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM medical_history WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "medical_history", JSON.stringify(record)]
        );

        await db.query("DELETE FROM medical_history WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const FamHistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM familyhis_data WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "familyhis_data", JSON.stringify(record)]
        );

        await db.query("DELETE FROM familyhis_data WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const socialHistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM social_history WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "social_history", JSON.stringify(record)]
        );

        await db.query("DELETE FROM social_history WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const DevistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM development_history WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "development_history", JSON.stringify(record)]
        );

        await db.query("DELETE FROM development_history WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const SubstanceHistoryToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM substance_use WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "substance_use", JSON.stringify(record)]
        );

        await db.query("DELETE FROM substance_use WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const suicidialUseToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM suicidal_data WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "suicidal_data", JSON.stringify(record)]
        );

        await db.query("DELETE FROM suicidal_data WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const GeneralAppyToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM general_appearance WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "general_appearance", JSON.stringify(record)]
        );

        await db.query("DELETE FROM general_appearance WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const SpeechToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM speech WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "speech", JSON.stringify(record)]
        );

        await db.query("DELETE FROM speech WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const MoodAffectToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM mood_affect WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "mood_affect", JSON.stringify(record)]
        );

        await db.query("DELETE FROM mood_affect WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const ThoughToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM though_form WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "though_form", JSON.stringify(record)]
        );

        await db.query("DELETE FROM though_form WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const PreceptionToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM perception WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "perception", JSON.stringify(record)]
        );

        await db.query("DELETE FROM perception WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const CognitionToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM conginition WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "conginition", JSON.stringify(record)]
        );

        await db.query("DELETE FROM conginition WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const JudgementToRecBin = async (req, res) => {
    const { admission_no } = req.params;

    try {
        const results = await db.query(
            "SELECT * FROM judgement WHERE admission_no = ?",
            [admission_no]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        const record = results[0];
        await db.query(
            "INSERT INTO recycle_bin (ref_id, source_table, data) VALUES (?, ?, ?)",
            [admission_no, "judgement", JSON.stringify(record)]
        );

        await db.query("DELETE FROM judgement WHERE admission_no = ?", [admission_no]);

        res.json({ message: "Moved to recycle bin successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

export {
    restoreRecycleBin, BasicDetailToRecBin, observationReportToRecBin, CheifComplainttoRecycleBin,
    PresentingPrbtoRecBin, PsyHistoryToRecBin, MedHistoryToRecBin, FamHistoryToRecBin, socialHistoryToRecBin,
    DevistoryToRecBin, SubstanceHistoryToRecBin, suicidialUseToRecBin,GeneralAppyToRecBin, SpeechToRecBin,MoodAffectToRecBin,
    ThoughToRecBin, PreceptionToRecBin, CognitionToRecBin, JudgementToRecBin
}