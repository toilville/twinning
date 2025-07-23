const express = require('express');
const axios = require('axios');
const router = express.Router();

// Health check for the core service
router.get('/', (req, res) => {
  res.json({
    service: 'twinning-core',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Comprehensive health check for all services
router.get('/all', async (req, res) => {
  const services = [
    { name: 'social-automation', url: process.env.SOCIAL_SERVICE_URL },
    { name: 'pipeline-intelligence', url: process.env.PIPELINE_SERVICE_URL },
    { name: 'grafana', url: process.env.GRAFANA_URL },
    { name: 'nextcloud', url: process.env.NEXTCLOUD_URL },
    { name: 'influxdb', url: process.env.INFLUXDB_URL }
  ];

  const healthChecks = await Promise.allSettled(
    services.map(async (service) => {
      if (!service.url) {
        return {
          name: service.name,
          status: 'not_configured',
          message: 'Service URL not configured'
        };
      }

      try {
        const response = await axios.get(`${service.url}/health`, { 
          timeout: 5000,
          validateStatus: (status) => status < 500 // Accept 4xx as "reachable"
        });
        
        return {
          name: service.name,
          status: 'healthy',
          url: service.url,
          responseTime: response.headers['x-response-time'] || 'unknown'
        };
      } catch (error) {
        return {
          name: service.name,
          status: 'unhealthy',
          url: service.url,
          error: error.message
        };
      }
    })
  );

  const results = healthChecks.map((check, index) => {
    return check.status === 'fulfilled' ? check.value : {
      name: services[index].name,
      status: 'error',
      error: check.reason.message
    };
  });

  const overallStatus = results.every(r => r.status === 'healthy') ? 'healthy' : 
                       results.some(r => r.status === 'healthy') ? 'degraded' : 'unhealthy';

  res.json({
    overall_status: overallStatus,
    timestamp: new Date().toISOString(),
    services: results,
    summary: {
      total: results.length,
      healthy: results.filter(r => r.status === 'healthy').length,
      unhealthy: results.filter(r => r.status === 'unhealthy').length,
      not_configured: results.filter(r => r.status === 'not_configured').length
    }
  });
});

module.exports = router;
