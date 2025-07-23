const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get status of all integrated services
router.get('/', async (req, res) => {
  const services = [
    { 
      name: 'social-automation', 
      url: process.env.SOCIAL_SERVICE_URL,
      description: 'Social media posting and engagement automation'
    },
    { 
      name: 'pipeline-intelligence', 
      url: process.env.PIPELINE_SERVICE_URL,
      description: 'Data pipeline and business intelligence processing'
    },
    { 
      name: 'grafana', 
      url: process.env.GRAFANA_URL,
      description: 'Analytics and visualization dashboard'
    },
    { 
      name: 'nextcloud', 
      url: process.env.NEXTCLOUD_URL,
      description: 'Self-hosted cloud storage and collaboration'
    },
    { 
      name: 'influxdb', 
      url: process.env.INFLUXDB_URL,
      description: 'Time-series database for metrics and analytics'
    }
  ];

  res.json({
    services: services,
    total_count: services.length,
    configured_count: services.filter(s => s.url).length,
    timestamp: new Date().toISOString()
  });
});

// Get specific service status
router.get('/:serviceName', async (req, res) => {
  const { serviceName } = req.params;
  const serviceMap = {
    'social': process.env.SOCIAL_SERVICE_URL,
    'pipeline': process.env.PIPELINE_SERVICE_URL,
    'grafana': process.env.GRAFANA_URL,
    'nextcloud': process.env.NEXTCLOUD_URL,
    'influxdb': process.env.INFLUXDB_URL
  };

  const serviceUrl = serviceMap[serviceName];
  
  if (!serviceUrl) {
    return res.status(404).json({
      error: 'Service not found',
      available_services: Object.keys(serviceMap)
    });
  }

  try {
    const response = await axios.get(`${serviceUrl}/status`, { 
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    
    res.json({
      service: serviceName,
      status: 'reachable',
      url: serviceUrl,
      response: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      service: serviceName,
      status: 'unreachable',
      url: serviceUrl,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Proxy requests to specific services
router.post('/:serviceName/proxy', async (req, res) => {
  const { serviceName } = req.params;
  const { endpoint, method = 'GET', data } = req.body;
  
  const serviceMap = {
    'social': process.env.SOCIAL_SERVICE_URL,
    'pipeline': process.env.PIPELINE_SERVICE_URL,
    'grafana': process.env.GRAFANA_URL,
    'nextcloud': process.env.NEXTCLOUD_URL,
    'influxdb': process.env.INFLUXDB_URL
  };

  const serviceUrl = serviceMap[serviceName];
  
  if (!serviceUrl) {
    return res.status(404).json({
      error: 'Service not found',
      available_services: Object.keys(serviceMap)
    });
  }

  try {
    const config = {
      method: method.toLowerCase(),
      url: `${serviceUrl}${endpoint}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-By': 'Twinning-Core'
      }
    };

    if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
      config.data = data;
    }

    const response = await axios(config);
    
    res.json({
      service: serviceName,
      endpoint: endpoint,
      method: method,
      status: 'success',
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      service: serviceName,
      endpoint: endpoint,
      method: method,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
