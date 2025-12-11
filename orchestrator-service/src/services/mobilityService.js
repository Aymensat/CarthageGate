const axios = require('axios');

const host = process.env.MOBILITY_SERVICE_HOST || 'localhost';
const port = process.env.MOBILITY_SERVICE_PORT || '8080';
const BASE_URL = `http://${host}:${port}/api`; // Base URL for the REST service

async function getAllSchedules() {
    try {
        const response = await axios.get(`${BASE_URL}/schedules`);
        return response.data;
    } catch (error) {
        console.error('Error calling REST Mobility Service (getAllSchedules):', error.message);
        throw new Error(`Failed to get all schedules: ${error.message}`);
    }
}

// Potentially add other methods if needed, like getting all lines for mapping stations
async function getAllLines() {
    try {
        const response = await axios.get(`${BASE_URL}/lines`);
        return response.data;
    } catch (error) {
        console.error('Error calling REST Mobility Service (getAllLines):', error.message);
        throw new Error(`Failed to get all lines: ${error.message}`);
    }
}


module.exports = {
    getAllSchedules,
    getAllLines,
};
