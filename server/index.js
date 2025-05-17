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

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes);
app.use('/admision',admissionRoutes);
app.use('/scrb_form',scrbFormRoutes);
app.use('/residency',residencyRoutes);
app.use('/reunion',reunionRoutes);
app.use('/formality',formalityRoutes);
app.use('/dashboard',dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
