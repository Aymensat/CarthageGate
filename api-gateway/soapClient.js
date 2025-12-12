const soap = require('soap');

const WSDL_URL = 'http://localhost:8081/ws/airQuality.wsdl'; // TEMPORARY: Using localhost for testing against locally running Docker services

let soapClient = null;

const initSoapClient = async () => {
  if (!soapClient) {
    try {
      soapClient = await soap.createClientAsync(WSDL_URL);
      console.log('SOAP client initialized successfully.');
    } catch (error) {
      console.error('Error initializing SOAP client:', error.message);
      // Depending on the error, you might want to retry or exit
      throw error;
    }
  }
  return soapClient;
};

// Expose a function to get the client, ensuring it's initialized
const getSoapClient = async () => {
  if (!soapClient) {
    await initSoapClient();
  }
  return soapClient;
};

module.exports = {
  initSoapClient,
  getSoapClient,
};
