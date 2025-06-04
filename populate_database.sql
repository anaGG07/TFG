-- Script para poblar la base de datos con datos de prueba
-- Primero limpiamos las tablas existentes (excepto las enumeraciones)
TRUNCATE TABLE user_alert CASCADE;
TRUNCATE TABLE alert CASCADE;
TRUNCATE TABLE notification CASCADE;
TRUNCATE TABLE guest_access CASCADE;
TRUNCATE TABLE hormone_level CASCADE;
TRUNCATE TABLE cycle_day CASCADE;
TRUNCATE TABLE menstrual_cycle CASCADE;
TRUNCATE TABLE symptom_log CASCADE;
TRUNCATE TABLE user_condition CASCADE;
TRUNCATE TABLE content_condition CASCADE;
TRUNCATE TABLE content CASCADE;
TRUNCATE TABLE condition CASCADE;
TRUNCATE TABLE pregnancy_log CASCADE;
TRUNCATE TABLE menopause_log CASCADE;
TRUNCATE TABLE "user" CASCADE;

-- Insertar usuarios de prueba
INSERT INTO "user" (email, username, name, last_name, password, profile_type, gender_identity, birth_date, roles)
VALUES
    ('maria@example.com', 'maria', 'María', 'González', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'USER', 'mujer cis', '1995-06-15', ARRAY['ROLE_USER']),
    ('juan@example.com', 'juan', 'Juan', 'Martínez', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'USER', 'hombre cis', '1990-03-20', ARRAY['ROLE_USER']),
    ('ana@example.com', 'ana', 'Ana', 'Rodríguez', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'USER', 'mujer cis', '1988-11-30', ARRAY['ROLE_USER']),
    ('carlos@example.com', 'carlos', 'Carlos', 'López', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'USER', 'hombre cis', '1992-07-25', ARRAY['ROLE_USER']),
    ('laura@example.com', 'laura', 'Laura', 'Sánchez', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'USER', 'mujer cis', '1993-09-10', ARRAY['ROLE_USER']),
    ('admin@gmail.com', 'admin', 'admin', 'admin', '$2y$13$wHk6Qw6Qw6Qw6Qw6Qw6QOeQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 'ADMIN', 'mujer cis', '1990-01-01', ARRAY['ROLE_ADMIN']);

-- Insertar condiciones médicas
INSERT INTO condition (name, description, is_chronic)
VALUES
    ('Síndrome Premenstrual', 'Conjunto de síntomas físicos y emocionales que ocurren antes de la menstruación', FALSE),
    ('Endometriosis', 'Enfermedad crónica donde el tejido endometrial crece fuera del útero', TRUE),
    ('Síndrome de Ovario Poliquístico', 'Trastorno hormonal común en mujeres en edad reproductiva', TRUE),
    ('Amenorrea', 'Ausencia de menstruación', FALSE),
    ('Dismenorrea', 'Menstruación dolorosa', FALSE);

-- Insertar contenido
INSERT INTO content (title, description, content, type, target_phase, tags)
VALUES
    ('Alimentación durante la menstruación', 'Guía nutricional para la fase menstrual', 'Durante la menstruación es importante consumir alimentos ricos en hierro...', 'nutrition', 'menstrual', '["nutrición", "hierro", "energía"]'),
    ('Ejercicios para aliviar el dolor menstrual', 'Rutina suave para días de menstruación', 'Esta rutina de 15 minutos incluye estiramientos y posturas de yoga...', 'exercise', 'menstrual', '["ejercicio", "dolor", "bienestar"]'),
    ('Cuidados durante la ovulación', 'Consejos para la fase ovulatoria', 'Durante la ovulación es importante mantener una buena hidratación...', 'article', 'ovulacion', '["salud", "ovulación", "consejos"]'),
    ('Recetas para la fase folicular', 'Alimentos recomendados', 'Recetas ricas en proteínas y nutrientes esenciales...', 'nutrition', 'folicular', '["recetas", "nutrición", "energía"]'),
    ('Meditación para la fase lútea', 'Ejercicios de mindfulness', 'Técnicas de meditación para manejar el estrés...', 'selfcare', 'lutea', '["meditación", "bienestar", "estrés"]');

-- Relacionar contenido con condiciones
INSERT INTO content_condition (content_id, condition_id)
VALUES
    (1, 1), -- Alimentación durante la menstruación - Síndrome Premenstrual
    (2, 5), -- Ejercicios para aliviar el dolor - Dismenorrea
    (3, 3), -- Cuidados durante la ovulación - SOP
    (4, 1), -- Recetas para la fase folicular - Síndrome Premenstrual
    (5, 1); -- Meditación para la fase lútea - Síndrome Premenstrual

-- Insertar ciclos menstruales
INSERT INTO menstrual_cycle (user_id, start_date, end_date, estimated_next_start, average_cycle_length, average_duration, flow_amount, flow_color, pain_level, notes)
VALUES
    (1, '2024-01-01', '2024-01-05', '2024-01-29', 28, 5, 'moderado', 'rojo', 3, 'Ciclo normal'),
    (1, '2024-01-29', '2024-02-02', '2024-02-26', 28, 4, 'moderado', 'rojo', 2, 'Ciclo normal'),
    (2, '2024-01-05', '2024-01-09', '2024-02-02', 28, 5, 'abundante', 'rojo oscuro', 4, 'Dolor moderado'),
    (3, '2024-01-10', '2024-01-14', '2024-02-07', 28, 5, 'moderado', 'rojo', 3, 'Ciclo regular');

-- Insertar días del ciclo
INSERT INTO cycle_day (cycle_id, date, day_number, phase, symptoms, notes, mood, flow_intensity)
VALUES
    (1, '2024-01-01', 1, 'menstrual', '{"dolor": "moderado", "fatiga": "leve"}', '{"notas": "Día normal"}', '{"estado": "tranquila"}', 3),
    (1, '2024-01-02', 2, 'menstrual', '{"dolor": "leve", "fatiga": "moderada"}', '{"notas": "Mejorando"}', '{"estado": "cansada"}', 2),
    (2, '2024-01-29', 1, 'menstrual', '{"dolor": "moderado", "fatiga": "leve"}', '{"notas": "Ciclo normal"}', '{"estado": "tranquila"}', 3),
    (3, '2024-01-05', 1, 'menstrual', '{"dolor": "intenso", "fatiga": "moderada"}', '{"notas": "Dolor fuerte"}', '{"estado": "irritable"}', 4);

-- Insertar niveles hormonales
INSERT INTO hormone_level (user_id, cycle_day_id, hormone_type, level)
VALUES
    (1, 1, 'estrogen', 50.5),
    (1, 1, 'progesterone', 0.8),
    (1, 2, 'estrogen', 45.2),
    (1, 2, 'progesterone', 0.6),
    (2, 3, 'estrogen', 55.3),
    (2, 3, 'progesterone', 0.9);

-- Insertar registros de síntomas
INSERT INTO symptom_log (user_id, date, symptom, intensity, notes)
VALUES
    (1, '2024-01-01', 'Dolor de cabeza', 3, 'Dolor moderado en la frente'),
    (1, '2024-01-02', 'Fatiga', 2, 'Cansancio general'),
    (2, '2024-01-05', 'Cólicos', 4, 'Dolor intenso en el bajo vientre'),
    (3, '2024-01-10', 'Dolor de espalda', 3, 'Dolor en la zona lumbar');

-- Insertar notificaciones
INSERT INTO notification (recipient_id, title, message, is_read, scheduled_for, sent_at, is_sent)
VALUES
    (1, 'Recordatorio de ciclo', 'Tu próximo ciclo está próximo a comenzar', false, '2024-02-25 08:00:00', '2024-02-25 08:00:00', true),
    (2, 'Consejo del día', 'Recuerda mantenerte hidratada durante tu ciclo', false, '2024-02-26 10:00:00', '2024-02-26 10:00:00', true),
    (3, 'Actualización de síntomas', '¿Cómo te sientes hoy?', false, '2024-02-27 09:00:00', '2024-02-27 09:00:00', true);

-- Insertar alertas
INSERT INTO alert (title, description, send_at, alert_date, is_read, origin_id)
VALUES
    ('Cambio en el patrón', 'Se ha detectado un cambio en tu patrón menstrual', '2024-02-25 08:00:00', '2024-02-25 08:00:00', false, 1),
    ('Recordatorio de medicación', 'No olvides tomar tu medicación', '2024-02-26 10:00:00', '2024-02-26 10:00:00', false, 2);

-- Relacionar alertas con usuarios
INSERT INTO user_alert (user_id, alert_id)
VALUES
    (1, 1),
    (2, 2); 