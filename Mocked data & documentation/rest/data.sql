-- Create transport_line table
CREATE TABLE IF NOT EXISTS transport_line (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    line_type VARCHAR(50) NOT NULL,
    line_status VARCHAR(50) NOT NULL,
    description TEXT
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    station_from VARCHAR(255) NOT NULL,
    station_to VARCHAR(255) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    line_id INTEGER NOT NULL,
    FOREIGN KEY (line_id) REFERENCES transport_line(id) ON DELETE CASCADE
);


-- Insert Transport Lines
INSERT INTO transport_line (id, name, line_type, line_status, description) VALUES
                                                                               (1, 'Metro Line M1', 'METRO', 'ACTIVE', 'Main metro line connecting Tunis Center to Charguia'),
                                                                               (2, 'Bus Route 15', 'BUS', 'ACTIVE', 'Downtown circular route via Avenue Habib Bourguiba'),
                                                                               (3, 'TGM Train', 'TRAIN', 'ACTIVE', 'Tunis-Goulette-Marsa coastal train line'),
                                                                               (4, 'Tram T1', 'TRAM', 'MAINTENANCE', 'East-West tram line - temporarily under maintenance'),
                                                                               (5, 'Bus Route 20', 'BUS', 'ACTIVE', 'Express route to Tunis Carthage Airport')
ON CONFLICT (id) DO NOTHING;

-- Insert Schedules for Metro Line M1
INSERT INTO schedule (station_from, station_to, departure_time, arrival_time, line_id) VALUES
                                                                                           ('Tunis Marine', 'République', '06:00:00', '06:05:00', 1),
                                                                                           ('République', 'Barcelona', '06:10:00', '06:15:00', 1),
                                                                                           ('Barcelona', 'Charguia', '06:20:00', '06:30:00', 1),
                                                                                           ('Tunis Marine', 'République', '08:00:00', '08:05:00', 1),
                                                                                           ('République', 'Barcelona', '08:10:00', '08:15:00', 1),
                                                                                           ('Barcelona', 'Charguia', '08:20:00', '08:30:00', 1),
                                                                                           ('Tunis Marine', 'République', '12:00:00', '12:05:00', 1),
                                                                                           ('République', 'Barcelona', '12:10:00', '12:15:00', 1),
                                                                                           ('Barcelona', 'Charguia', '12:20:00', '12:30:00', 1);

-- Insert Schedules for Bus Route 15
INSERT INTO schedule (station_from, station_to, departure_time, arrival_time, line_id) VALUES
                                                                                           ('Tunis Center', 'Bab Bhar', '07:00:00', '07:10:00', 2),
                                                                                           ('Bab Bhar', 'Jardin Thameur', '07:15:00', '07:25:00', 2),
                                                                                           ('Jardin Thameur', 'Tunis Center', '07:30:00', '07:45:00', 2),
                                                                                           ('Tunis Center', 'Bab Bhar', '09:00:00', '09:10:00', 2),
                                                                                           ('Bab Bhar', 'Jardin Thameur', '09:15:00', '09:25:00', 2),
                                                                                           ('Jardin Thameur', 'Tunis Center', '09:30:00', '09:45:00', 2);

-- Insert Schedules for TGM Train
INSERT INTO schedule (station_from, station_to, departure_time, arrival_time, line_id) VALUES
                                                                                           ('Tunis Marine', 'La Goulette', '06:30:00', '06:45:00', 3),
                                                                                           ('La Goulette', 'Sidi Bou Said', '06:50:00', '07:05:00', 3),
                                                                                           ('Sidi Bou Said', 'La Marsa', '07:10:00', '07:20:00', 3),
                                                                                           ('Tunis Marine', 'La Goulette', '10:00:00', '10:15:00', 3),
                                                                                           ('La Goulette', 'Sidi Bou Said', '10:20:00', '10:35:00', 3),
                                                                                           ('Sidi Bou Said', 'La Marsa', '10:40:00', '10:50:00', 3);

-- Insert Schedules for Bus Route 20 (Airport)
INSERT INTO schedule (station_from, station_to, departure_time, arrival_time, line_id) VALUES
                                                                                           ('Tunis Center', 'Ariana Center', '05:30:00', '05:50:00', 5),
                                                                                           ('Ariana Center', 'Tunis Carthage Airport', '05:55:00', '06:15:00', 5),
                                                                                           ('Tunis Center', 'Ariana Center', '08:00:00', '08:20:00', 5),
                                                                                           ('Ariana Center', 'Tunis Carthage Airport', '08:25:00', '08:45:00', 5),
                                                                                           ('Tunis Center', 'Ariana Center', '14:00:00', '14:20:00', 5),
                                                                                           ('Ariana Center', 'Tunis Carthage Airport', '14:25:00', '14:45:00', 5);

-- Reset sequences (if needed)
SELECT setval('transport_line_id_seq', (SELECT MAX(id) FROM transport_line));
SELECT setval('schedule_id_seq', (SELECT MAX(id) FROM schedule));