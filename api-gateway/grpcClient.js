const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'proto', 'emergency.proto');
const GRPC_SERVER_ADDRESS = 'grpc-service:5001';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const emergencyProto = grpc.loadPackageDefinition(packageDefinition).emergency;

const client = new emergencyProto.EmergencyAlertService(
  GRPC_SERVER_ADDRESS,
  grpc.credentials.createInsecure()
);

module.exports = {
  client,
  emergencyProto
};
