-- Limpiar tablas existentes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE hormone_level;
TRUNCATE TABLE cycle_day;
TRUNCATE TABLE menstrual_cycle;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;

-- Insertar usuario de prueba
INSERT INTO user (id, email, roles, password, first_name, last_name, birth_date, created_at, updated_at)
VALUES 
(1, 'usuario@test.com', '["ROLE_USER"]', '$2y$13$hxX5J5J5J5J5J5J5J5J5O5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'Usuario', 'Test', '1990-01-01', NOW(), NOW()),
(2, 'admin@test.com', '["ROLE_ADMIN"]', '$2y$13$hxX5J5J5J5J5J5J5J5J5O5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'Admin', 'Test', '1990-01-01', NOW(), NOW());

-- Insertar ciclos menstruales
INSERT INTO menstrual_cycle (id, user_id, phase, cycle_id, start_date, end_date, estimated_next_start, average_cycle_length, average_duration, flow_amount, flow_color, flow_odor, pain_level, notes, created_at, updated_at)
VALUES
-- Ciclo 1
(1, 1, 'MENSTRUATION', 'cycle_1', '2024-01-01', '2024-01-28', '2024-01-29', 28, 5, 'MEDIUM', 'RED', 'NORMAL', 3, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 2
(2, 1, 'MENSTRUATION', 'cycle_2', '2024-01-29', '2024-02-25', '2024-02-26', 28, 5, 'LIGHT', 'RED', 'NORMAL', 2, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 3
(3, 1, 'MENSTRUATION', 'cycle_3', '2024-02-26', '2024-03-24', '2024-03-25', 28, 5, 'MEDIUM', 'RED', 'NORMAL', 4, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 4
(4, 1, 'MENSTRUATION', 'cycle_4', '2024-03-25', '2024-04-22', '2024-04-23', 28, 5, 'HEAVY', 'RED', 'NORMAL', 3, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 5
(5, 1, 'MENSTRUATION', 'cycle_5', '2024-04-23', '2024-05-21', '2024-05-22', 28, 5, 'MEDIUM', 'RED', 'NORMAL', 2, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 6
(6, 1, 'MENSTRUATION', 'cycle_6', '2024-05-22', '2024-06-19', '2024-06-20', 28, 5, 'LIGHT', 'RED', 'NORMAL', 3, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 7
(7, 1, 'MENSTRUATION', 'cycle_7', '2024-06-20', '2024-07-18', '2024-07-19', 28, 5, 'MEDIUM', 'RED', 'NORMAL', 4, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 8
(8, 1, 'MENSTRUATION', 'cycle_8', '2024-07-19', '2024-08-16', '2024-08-17', 28, 5, 'HEAVY', 'RED', 'NORMAL', 3, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 9
(9, 1, 'MENSTRUATION', 'cycle_9', '2024-08-17', '2024-09-14', '2024-09-15', 28, 5, 'MEDIUM', 'RED', 'NORMAL', 2, 'Ciclo regular', NOW(), NOW()),
-- Ciclo 10
(10, 1, 'MENSTRUATION', 'cycle_10', '2024-09-15', '2024-10-13', '2024-10-14', 28, 5, 'LIGHT', 'RED', 'NORMAL', 3, 'Ciclo regular', NOW(), NOW()); 