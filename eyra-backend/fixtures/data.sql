-- Script de inserción de datos de prueba para EYRA
-- Respetando todas las dependencias y restricciones

-- 1. Insertar Usuarios
INSERT INTO "user" (email, username, name, last_name, password, profile_type, birth_date, roles, state, onboarding_completed)
VALUES 
    ('ana@example.com', 'ana', 'Ana', 'García', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1990-01-01', ARRAY['ROLE_USER'], true, true),
    ('maria@example.com', 'maria', 'María', 'López', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1992-05-15', ARRAY['ROLE_USER'], true, true),
    ('juan@example.com', 'juan', 'Juan', 'Martínez', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_guest', '1988-03-20', ARRAY['ROLE_USER'], true, true),
    ('laura@example.com', 'laura', 'Laura', 'Sánchez', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1995-07-10', ARRAY['ROLE_USER'], true, true),
    ('sofia@example.com', 'sofia', 'Sofía', 'Rodríguez', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1993-11-25', ARRAY['ROLE_USER'], true, true),
    ('carlos@example.com', 'carlos', 'Carlos', 'Fernández', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_guest', '1991-04-15', ARRAY['ROLE_USER'], true, true),
    ('patricia@example.com', 'patricia', 'Patricia', 'Gómez', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1989-09-30', ARRAY['ROLE_USER'], true, true),
    ('david@example.com', 'david', 'David', 'Pérez', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_guest', '1994-02-18', ARRAY['ROLE_USER'], true, true),
    ('elena@example.com', 'elena', 'Elena', 'Martín', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_women', '1996-06-22', ARRAY['ROLE_USER'], true, true),
    ('miguel@example.com', 'miguel', 'Miguel', 'Díaz', '$2y$13$5dE.4He69pQTuxhMqInVy.wVH3CsBG8bkNn8knDILAFS1jp080cZq', 'profile_guest', '1992-12-05', ARRAY['ROLE_USER'], true, true);

-- 2. Insertar Onboarding
INSERT INTO onboarding (user_id, profile_type, gender_identity, pronouns, is_personal, stage_of_life, last_period_date)
VALUES 
    (1, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-01'),
    (2, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-05'),
    (3, 'profile_guest', 'Hombre', 'él', true, 'adult', NULL),
    (4, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-10'),
    (5, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-15'),
    (6, 'profile_guest', 'Hombre', 'él', true, 'adult', NULL),
    (7, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-20'),
    (8, 'profile_guest', 'Hombre', 'él', true, 'adult', NULL),
    (9, 'profile_women', 'Mujer', 'ella', true, 'adult', '2024-03-25'),
    (10, 'profile_guest', 'Hombre', 'él', true, 'adult', NULL);

-- 3. Insertar Condiciones Médicas
INSERT INTO condition (name, description, is_chronic, category, severity)
VALUES 
    ('Síndrome de Ovario Poliquístico', 'Trastorno hormonal común en mujeres en edad reproductiva', true, 'hormonal', 'moderate'),
    ('Endometriosis', 'Enfermedad donde el tejido similar al endometrio crece fuera del útero', true, 'reproductive', 'severe'),
    ('Hipotiroidismo', 'Trastorno donde la glándula tiroides no produce suficientes hormonas', true, 'hormonal', 'mild'),
    ('Hipertiroidismo', 'Trastorno donde la glándula tiroides produce demasiadas hormonas', true, 'hormonal', 'moderate'),
    ('Fibromialgia', 'Trastorno que causa dolor muscular y fatiga', true, 'chronic_pain', 'severe'),
    ('Migraña', 'Dolor de cabeza intenso y recurrente', true, 'neurological', 'moderate'),
    ('Ansiedad', 'Trastorno de salud mental caracterizado por preocupación excesiva', true, 'mental_health', 'mild'),
    ('Depresión', 'Trastorno del estado de ánimo que causa sentimientos persistentes de tristeza', true, 'mental_health', 'moderate'),
    ('Asma', 'Enfermedad que afecta las vías respiratorias', true, 'respiratory', 'moderate'),
    ('Artritis', 'Inflamación de las articulaciones', true, 'musculoskeletal', 'severe');

-- 4. Insertar Relaciones Usuario-Condición
INSERT INTO user_condition (user_id, condition_id, start_date, notes)
VALUES 
    (1, 1, '2020-01-01', 'Diagnosticado por Dr. García'),
    (2, 2, '2019-06-15', 'Seguimiento regular'),
    (4, 3, '2021-03-10', 'Control mensual'),
    (5, 4, '2022-01-20', 'Medicación diaria'),
    (7, 5, '2020-11-05', 'Terapia física semanal'),
    (9, 6, '2023-02-15', 'Medicación preventiva'),
    (1, 7, '2022-07-01', 'Terapia psicológica'),
    (4, 8, '2021-09-15', 'Seguimiento psiquiátrico'),
    (7, 9, '2023-01-10', 'Inhalador de rescate'),
    (9, 10, '2022-05-20', 'Fisioterapia semanal');

-- 5. Insertar Ciclos Menstruales
INSERT INTO menstrual_cycle (user_id, phase, cycle_id, start_date, end_date, estimated_next_start, average_cycle_length, average_duration)
VALUES 
    (1, 'menstrual', 'cycle_001', '2024-03-01', '2024-03-05', '2024-03-29', 28, 5),
    (1, 'folicular', 'cycle_001', '2024-03-06', '2024-03-13', '2024-03-29', 28, 5),
    (1, 'ovulacion', 'cycle_001', '2024-03-14', '2024-03-16', '2024-03-29', 28, 5),
    (1, 'lutea', 'cycle_001', '2024-03-17', '2024-03-28', '2024-03-29', 28, 5),
    (2, 'menstrual', 'cycle_002', '2024-03-05', '2024-03-09', '2024-04-02', 28, 5),
    (4, 'menstrual', 'cycle_003', '2024-03-10', '2024-03-14', '2024-04-07', 28, 5),
    (5, 'menstrual', 'cycle_004', '2024-03-15', '2024-03-19', '2024-04-12', 28, 5),
    (7, 'menstrual', 'cycle_005', '2024-03-20', '2024-03-24', '2024-04-17', 28, 5),
    (9, 'menstrual', 'cycle_006', '2024-03-25', '2024-03-29', '2024-04-22', 28, 5),
    (2, 'folicular', 'cycle_002', '2024-03-10', '2024-03-17', '2024-04-02', 28, 5);

-- 6. Insertar Días de Ciclo
INSERT INTO cycle_day (cycle_id, date, day_number, phase, symptoms, notes, mood, flow_intensity)
VALUES 
    (1, '2024-03-01', 1, 'menstrual', ARRAY['cramps', 'fatigue'], 'Día 1 del ciclo', ARRAY['tired'], 'heavy'),
    (1, '2024-03-02', 2, 'menstrual', ARRAY['cramps'], 'Día 2 del ciclo', ARRAY['moody'], 'medium'),
    (2, '2024-03-05', 1, 'menstrual', ARRAY['cramps', 'headache'], 'Día 1 del ciclo', ARRAY['irritable'], 'heavy'),
    (3, '2024-03-10', 1, 'menstrual', ARRAY['cramps', 'backache'], 'Día 1 del ciclo', ARRAY['tired'], 'heavy'),
    (4, '2024-03-15', 1, 'menstrual', ARRAY['cramps', 'nausea'], 'Día 1 del ciclo', ARRAY['sensitive'], 'medium'),
    (5, '2024-03-20', 1, 'menstrual', ARRAY['cramps', 'fatigue'], 'Día 1 del ciclo', ARRAY['moody'], 'heavy'),
    (6, '2024-03-25', 1, 'menstrual', ARRAY['cramps', 'headache'], 'Día 1 del ciclo', ARRAY['irritable'], 'medium'),
    (7, '2024-03-06', 2, 'menstrual', ARRAY['cramps'], 'Día 2 del ciclo', ARRAY['tired'], 'medium'),
    (8, '2024-03-11', 2, 'menstrual', ARRAY['cramps', 'fatigue'], 'Día 2 del ciclo', ARRAY['moody'], 'light'),
    (9, '2024-03-16', 2, 'menstrual', ARRAY['cramps'], 'Día 2 del ciclo', ARRAY['sensitive'], 'medium');

-- 7. Insertar Registros de Síntomas
INSERT INTO symptom_log (user_id, date, symptom, intensity, notes, entity)
VALUES 
    (1, '2024-03-01', 'Dolor de cabeza', 3, 'Dolor moderado', 'menstrual_cycle'),
    (1, '2024-03-01', 'Fatiga', 4, 'Muy cansada', 'menstrual_cycle'),
    (2, '2024-03-05', 'Cólicos', 5, 'Dolor intenso', 'menstrual_cycle'),
    (4, '2024-03-10', 'Dolor de espalda', 4, 'Dolor en zona lumbar', 'menstrual_cycle'),
    (5, '2024-03-15', 'Náuseas', 3, 'Malestar estomacal', 'menstrual_cycle'),
    (7, '2024-03-20', 'Mareos', 2, 'Leve mareo', 'menstrual_cycle'),
    (9, '2024-03-25', 'Sensibilidad mamaria', 4, 'Molestia en senos', 'menstrual_cycle'),
    (1, '2024-03-02', 'Acné', 3, 'Brotes en rostro', 'menstrual_cycle'),
    (4, '2024-03-11', 'Insomnio', 4, 'Dificultad para dormir', 'menstrual_cycle'),
    (7, '2024-03-21', 'Ansiedad', 3, 'Estado de nerviosismo', 'menstrual_cycle');

-- 8. Insertar Niveles Hormonales
INSERT INTO hormone_level (user_id, hormone_type, cycle_day_id, level)
VALUES 
    (1, 'estrogen', 1, 25.5),
    (1, 'progesterone', 1, 0.8),
    (2, 'estrogen', 3, 28.2),
    (4, 'estrogen', 4, 26.8),
    (5, 'estrogen', 5, 27.5),
    (7, 'estrogen', 6, 24.9),
    (9, 'estrogen', 7, 26.2),
    (1, 'progesterone', 2, 0.9),
    (4, 'progesterone', 4, 0.7),
    (7, 'progesterone', 6, 0.8);

-- 9. Insertar Accesos de Invitados
INSERT INTO guest_access (owner_id, guest_id, guest_type, access_to, state, guest_preferences)
VALUES 
    (1, 3, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], true, ARRAY['phase_menstrual']),
    (2, 3, 'friend', ARRAY['phase_menstrual'], true, ARRAY['phase_menstrual']),
    (4, 6, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], true, ARRAY['phase_menstrual']),
    (5, 6, 'friend', ARRAY['phase_menstrual'], true, ARRAY['phase_menstrual']),
    (7, 8, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], true, ARRAY['phase_menstrual']),
    (9, 8, 'friend', ARRAY['phase_menstrual'], true, ARRAY['phase_menstrual']),
    (1, 6, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], true, ARRAY['phase_menstrual', 'phase_ovulacion']),
    (4, 8, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], true, ARRAY['phase_menstrual', 'phase_ovulacion']),
    (7, 10, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], true, ARRAY['phase_menstrual', 'phase_ovulacion']),
    (9, 10, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], true, ARRAY['phase_menstrual']);

-- 10. Insertar Notificaciones
INSERT INTO notification (user_id, title, message, type, priority, context, read, created_at)
VALUES 
    (1, 'Recordatorio de Ciclo', 'Tu próximo periodo está próximo', 'cycle_reminder', 'normal', 'cycle', false, CURRENT_TIMESTAMP),
    (2, 'Actualización de Síntomas', 'No olvides registrar tus síntomas hoy', 'symptom_reminder', 'normal', 'symptoms', false, CURRENT_TIMESTAMP),
    (4, 'Recordatorio de Ciclo', 'Tu próximo periodo está próximo', 'cycle_reminder', 'normal', 'cycle', false, CURRENT_TIMESTAMP),
    (5, 'Actualización de Síntomas', 'No olvides registrar tus síntomas hoy', 'symptom_reminder', 'normal', 'symptoms', false, CURRENT_TIMESTAMP),
    (7, 'Recordatorio de Ciclo', 'Tu próximo periodo está próximo', 'cycle_reminder', 'normal', 'cycle', false, CURRENT_TIMESTAMP),
    (9, 'Actualización de Síntomas', 'No olvides registrar tus síntomas hoy', 'symptom_reminder', 'normal', 'symptoms', false, CURRENT_TIMESTAMP),
    (1, 'Nuevo Contenido', 'Hay nuevo contenido disponible para tu fase actual', 'content_update', 'low', 'content', false, CURRENT_TIMESTAMP),
    (4, 'Nuevo Contenido', 'Hay nuevo contenido disponible para tu fase actual', 'content_update', 'low', 'content', false, CURRENT_TIMESTAMP),
    (7, 'Nuevo Contenido', 'Hay nuevo contenido disponible para tu fase actual', 'content_update', 'low', 'content', false, CURRENT_TIMESTAMP),
    (9, 'Nuevo Contenido', 'Hay nuevo contenido disponible para tu fase actual', 'content_update', 'low', 'content', false, CURRENT_TIMESTAMP);

-- 11. Insertar Contenido
INSERT INTO content (title, description, content, type, target_phase)
VALUES 
    ('Alimentación en Fase Menstrual', 'Guía de nutrición para la fase menstrual', 'Contenido detallado...', 'nutrition', 'menstrual'),
    ('Ejercicios para la Fase Folicular', 'Rutinas recomendadas', 'Contenido detallado...', 'exercise', 'folicular'),
    ('Cuidados en la Ovulación', 'Consejos para esta fase', 'Contenido detallado...', 'selfcare', 'ovulacion'),
    ('Nutrición en Fase Lútea', 'Alimentos recomendados', 'Contenido detallado...', 'nutrition', 'lutea'),
    ('Meditación para la Fase Menstrual', 'Ejercicios de mindfulness', 'Contenido detallado...', 'selfcare', 'menstrual'),
    ('Ejercicios para la Fase Lútea', 'Rutinas suaves', 'Contenido detallado...', 'exercise', 'lutea'),
    ('Alimentación en la Ovulación', 'Nutrientes clave', 'Contenido detallado...', 'nutrition', 'ovulacion'),
    ('Cuidados en la Fase Folicular', 'Consejos de bienestar', 'Contenido detallado...', 'selfcare', 'folicular'),
    ('Ejercicios para la Ovulación', 'Rutinas energéticas', 'Contenido detallado...', 'exercise', 'ovulacion'),
    ('Nutrición en la Fase Folicular', 'Alimentos para la energía', 'Contenido detallado...', 'nutrition', 'folicular');

-- 12. Insertar Códigos de Invitación
INSERT INTO invitation_code (code, creator_id, guest_type, access_permissions, created_at, expires_at, status)
VALUES 
    ('ABC123', 1, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('DEF456', 2, 'friend', ARRAY['phase_menstrual'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('GHI789', 4, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('JKL012', 5, 'friend', ARRAY['phase_menstrual'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('MNO345', 7, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('PQR678', 9, 'friend', ARRAY['phase_menstrual'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('STU901', 1, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('VWX234', 4, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('YZA567', 7, 'healthcare_provider', ARRAY['phase_menstrual', 'phase_folicular', 'phase_ovulacion', 'phase_lutea'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    ('BCD890', 9, 'partner', ARRAY['phase_menstrual', 'phase_ovulacion'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'); 