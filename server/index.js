require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admission');
const scrbFormRoutes = require('./routes/scrb_form');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes);
app.use('/admision',admissionRoutes);
app.use('/scrb_form',scrbFormRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
