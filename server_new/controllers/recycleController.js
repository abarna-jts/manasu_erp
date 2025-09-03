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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

const RescueDetailtoRecycleBin = async (req, res) =>{
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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

const ConsultationtoRecycleBin = async (req, res) =>{
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

        // 2. Insert into recycle_bin
        await db.query(
            "INSERT INTO recycle_bin (admission_no, source_table, data) VALUES (?, ?, ?)",
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
    const { admission_no } = req.params;

    try {
        // 1. Get record from recycle_bin
        const [rows] = await db.query(
            "SELECT * FROM recycle_bin WHERE admission_no = ?",
            [admission_no]
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "Not found in recycle bin" });

        const recycleRecord = rows[0];
        const { source_table, id, data } = recycleRecord;

        // 2. Parse JSON safely
        let parsedData;
        try {
            parsedData = JSON.parse(data);
            if (!Array.isArray(parsedData)) {
                parsedData = [parsedData]; // make it iterable
            }
        } catch (e) {
            return res.status(400).json({ error: "Invalid data format in recycle_bin" });
        }

        // 3. Insert back into original table
        for (const record of parsedData) {
            delete record.id; // prevent conflict if original has auto-increment id
            await db.query(`INSERT INTO ${source_table} SET ?`, record);
        }

        // 4. Remove from recycle_bin
        await db.query("DELETE FROM recycle_bin WHERE id = ?", [id]);

        res.json({ message: "Restored successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
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
    RescueDetailtoRecycleBin, ConsultationtoRecycleBin
};