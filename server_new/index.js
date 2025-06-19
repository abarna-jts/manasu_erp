require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admission');
const scrbFormRoutes = require('./routes/scrb_form');
const residencyRoutes = require('./routes/residency');
const reunionRoutes = require('./routes/reunion');
const formalityRoutes = require('./routes/formality');
const dashboardRoutes = require('./routes/dashboard');
const recoveryRoutes = require('./routes/recovery');

const app = express();
// CORS with options
app.use(cors({
  origin: ["https://erp.manasu.org.in","http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes);
app.use('/admision',admissionRoutes);
app.use('/scrb_form',scrbFormRoutes);
app.use('/residency',residencyRoutes);
app.use('/recovery',recoveryRoutes);
app.use('/reunion',reunionRoutes);
app.use('/formality',formalityRoutes);
app.use('/dashboard',dashboardRoutes);

app.listen(process.env.PORT || 5002, () => {
  console.log(`Server running on port ${process.env.PORT || '5002'}`);
});

