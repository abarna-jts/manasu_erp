import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import admissionRoutes from './routes/admission.js';
import SCRBRoutes from './routes/scrb_form.js';
import FormalityRoutes from './routes/formality.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://erp.manasu.org.in'
];

const corsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: [
    'Content-Length',
    'Content-Range',
    'X-Requested-With',
    'Authorization',
    'Access-Token',
    'Refresh-Token',
    'Set-Cookie'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Access-Token',
    'Refresh-Token'
  ],
  maxAge: 86400 
};

app.use(cors(corsOptions));

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use('/api', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admision', admissionRoutes);
app.use('/scrb_form', SCRBRoutes);
// app.use('/formality', FormalityRoutes);
// app.use('/api/student', studentRoutes);
// app.use('/api/auth', authRoute);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy denied this request'
    });
  }

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on http://${HOST}:${PORT}`);
});