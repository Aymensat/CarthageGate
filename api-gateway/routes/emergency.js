const express = require('express');
const { client, emergencyProto } = require('../grpcClient'); // Import the gRPC client and proto definitions

const router = express.Router();

// Helper to convert gRPC enum string to integer value
const getAlertEnumValue = (enumObject, value) => {
  if (typeof value === 'string' && enumObject[value.toUpperCase()] !== undefined) {
    return enumObject[value.toUpperCase()];
  }
  return enumObject.ALERT_TYPE_UNSPECIFIED || enumObject.ALERT_STATUS_UNSPECIFIED;
};

// Route for CreateAlert
router.post('/alerts', (req, res) => {
  const { type, zone, description, latitude, longitude, reporter_phone } = req.body;
  const alertType = getAlertEnumValue(emergencyProto.AlertType, type);

  client.CreateAlert({ type: alertType, zone, description, latitude, longitude, reporter_phone }, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(response);
  });
});

// Route for GetAlert
router.get('/alerts/:id', (req, res) => {
  const { id } = req.params;
  client.GetAlert({ id }, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!response.alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(response.alert);
  });
});

// Route for GetAlertsByZone
router.get('/alerts/zone/:zone', (req, res) => {
  const { zone } = req.params;
  const status_filter = req.query.status; // Optional query parameter for status
  let grpcStatusFilter = emergencyProto.AlertStatus.ALERT_STATUS_UNSPECIFIED;

  if (status_filter) {
    grpcStatusFilter = getAlertEnumValue(emergencyProto.AlertStatus, status_filter);
  }

  client.GetAlertsByZone({ zone, status_filter: grpcStatusFilter }, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(response.alerts);
  });
});

// Route for UpdateAlertStatus
router.put('/alerts/:id/status', (req, res) => {
  const { id } = req.params;
  const { new_status } = req.body;
  const alertStatus = getAlertEnumValue(emergencyProto.AlertStatus, new_status);

  client.UpdateAlertStatus({ id, new_status: alertStatus }, (error, response) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(response);
  });
});

module.exports = router;
