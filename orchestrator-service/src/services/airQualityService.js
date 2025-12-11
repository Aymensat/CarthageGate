const soap = require('soap');

const host = process.env.AIR_QUALITY_SERVICE_HOST || 'localhost';
const port = process.env.AIR_QUALITY_SERVICE_PORT || '8081';
const url = `http://${host}:${port}/ws/airQuality.wsdl`; // WSDL URL
const serviceName = 'AirQualityPortService';
const portName = 'AirQualityPortSoap11'; // As found in WSDL

let soapClient = null;

async function createClient() {
    if (!soapClient) {
        soapClient = await soap.createClientAsync(url);
    }
    return soapClient;
}

async function getAirQuality(zoneName) {
    try {
        const client = await createClient();
        const args = { zoneName: zoneName };
        const result = await client.GetAirQualityAsync(args);
        return result[0].record;
    } catch (error) {
        console.error('Error calling SOAP Air Quality Service:', error.message);
        // Depending on how we want to handle errors, we might throw or return a default/null
        throw new Error(`Failed to get air quality for ${zoneName}: ${error.message}`);
    }
}

module.exports = {
    getAirQuality,
};