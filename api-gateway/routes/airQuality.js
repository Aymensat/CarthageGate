const express = require('express');
const { getSoapClient } = require('../soapClient');

const router = express.Router();

// Middleware to ensure SOAP client is initialized
router.use(async (req, res, next) => {
  try {
    req.soapClient = await getSoapClient();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize SOAP client', details: error.message });
  }
});

// Route for GetAllZones
router.get('/zones', async (req, res) => {
  try {
    const result = await req.soapClient.GetAllZonesAsync({});
    // The SOAP response structure might be nested, so we need to extract the relevant data
    // Assuming the response is like { records: [...] } after the client processes it.
    res.json(result[0].records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for GetAirQuality
router.get('/zones/:zoneName', async (req, res) => {
  const { zoneName } = req.params;
  try {
    const result = await req.soapClient.GetAirQualityAsync({ zoneName });
    // Assuming the response is like { record: {...} } after the client processes it.
    res.json(result[0].record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for CompareAirQuality
router.post('/zones/compare', async (req, res) => {
  const { zone1, zone2 } = req.body;
  if (!zone1 || !zone2) {
    return res.status(400).json({ error: 'Both zone1 and zone2 are required for comparison.' });
  }
  try {
    const result = await req.soapClient.CompareAirQualityAsync({ zone1, zone2 });
    // Assuming the response is like { record1: {...}, record2: {...}, verdict: "..." } after the client processes it.
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
