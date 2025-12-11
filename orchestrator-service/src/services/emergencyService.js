const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Path to the proto file
const PROTO_PATH = path.join(__dirname, '../../proto/emergency.proto');

// gRPC server address
const host = process.env.EMERGENCY_SERVICE_HOST || 'localhost';
const port = process.env.EMERGENCY_SERVICE_PORT || '50051';
const GRPC_SERVER_ADDRESS = `${host}:${port}`;

// Suggested options for protoLoader (matches official gRPC examples)
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const emergency_proto = grpc.loadPackageDefinition(packageDefinition).emergency;

let grpcClient = null;

function createClient() {
    if (!grpcClient) {
        grpcClient = new emergency_proto.EmergencyAlertService(
            GRPC_SERVER_ADDRESS,
            grpc.credentials.createInsecure() // Use insecure for local development
        );
    }
    return grpcClient;
}

async function getAlertsByZone(zone, statusFilter = null) {
    const client = createClient();
    const request = {
        zone: zone,
        status_filter: statusFilter // PENDING, IN_PROGRESS, RESOLVED, CANCELLED
    };

    return new Promise((resolve, reject) => {
        client.GetAlertsByZone(request, (error, response) => {
            if (error) {
                console.error('Error calling gRPC GetAlertsByZone:', error.message);
                return reject(new Error(`Failed to get alerts for zone ${zone}: ${error.message}`));
            }
            resolve(response.alerts); // Assuming response.alerts is an array of Alert objects
        });
    });
}

// Enum for AlertStatus, useful for filtering
const AlertStatus = emergency_proto.AlertStatus;


module.exports = {
    getAlertsByZone,
    AlertStatus,
};
