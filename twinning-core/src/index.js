const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Import routes
const healthRoutes = require('./routes/health');
const serviceRoutes = require('./routes/services');
const orchestrationRoutes = require('./routes/orchestration');

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orchestration', orchestrationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Twinning Digital Twin Platform',
    version: '1.0.0',
    description: 'Core Orchestration Service',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/services',
      '/api/orchestration'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Twinning Core Orchestration Service running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Service URLs:`);
  console.log(`   - Social: ${process.env.SOCIAL_SERVICE_URL || 'not configured'}`);
  console.log(`   - Pipeline: ${process.env.PIPELINE_SERVICE_URL || 'not configured'}`);
  console.log(`   - Grafana: ${process.env.GRAFANA_URL || 'not configured'}`);
  console.log(`   - Nextcloud: ${process.env.NEXTCLOUD_URL || 'not configured'}`);
  console.log(`   - InfluxDB: ${process.env.INFLUXDB_URL || 'not configured'}`);
});

module.exports = app;
