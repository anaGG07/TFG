-- Tabla de enumeraciones
CREATE TYPE profile_type AS ENUM ('GUEST', 'USER', 'ADMIN');
CREATE TYPE cycle_phase AS ENUM ('menstrual', 'folicular', 'ovulacion', 'lutea');
CREATE TYPE guest_type AS ENUM ('partner', 'parental', 'friend');
CREATE TYPE content_type AS ENUM ('recipe', 'exercise', 'article', 'selfcare', 'recommendation');
CREATE TYPE hormone_type AS ENUM ('estrogen', 'progesterone', 'testosterone', 'luteinizing_hormone', 'follicle_stimulating_hormone');

-- Tabla "user"
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_type profile_type NOT NULL DEFAULT 'GUEST',
    gender_identity VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    roles TEXT[] DEFAULT ARRAY['ROLE_USER'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "condition"
CREATE TABLE condition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_chronic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "user_condition"
CREATE TABLE user_condition (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    condition_id INTEGER REFERENCES condition (id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "content" (Nueva)
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    type content_type NOT NULL,
    target_phase cycle_phase,
    tags JSONB,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "content_condition" (Relación muchos a muchos)
CREATE TABLE content_condition (
    content_id INTEGER REFERENCES content (id) NOT NULL,
    condition_id INTEGER REFERENCES condition (id) NOT NULL,
    PRIMARY KEY (content_id, condition_id)
);

-- Tabla "menstrual_cycle"
CREATE TABLE menstrual_cycle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    estimated_next_start DATE NOT NULL,
    average_cycle_length INTEGER NOT NULL DEFAULT 28,
    average_duration INTEGER NOT NULL DEFAULT 5,
    flow_amount VARCHAR(50),
    flow_color VARCHAR(50),
    flow_odor VARCHAR(50),
    pain_level INTEGER,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "cycle_day" (Nueva)
CREATE TABLE cycle_day (
    id SERIAL PRIMARY KEY,
    cycle_id INTEGER REFERENCES menstrual_cycle (id) NOT NULL,
    date DATE NOT NULL,
    day_number SMALLINT NOT NULL,
    phase cycle_phase NOT NULL,
    symptoms JSONB,
    notes JSONB,
    mood JSONB,
    flow_intensity SMALLINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "hormone_level"
CREATE TABLE hormone_level (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    cycle_day_id INTEGER REFERENCES cycle_day (id),
    hormone_type hormone_type NOT NULL,
    level FLOAT NOT NULL,
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "pregnancy_log"
CREATE TABLE pregnancy_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    start_date DATE,
    due_date DATE,
    week INTEGER,
    symptoms TEXT,
    fetal_movements TEXT,
    ultrasound_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "menopause_log"
CREATE TABLE menopause_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    start_date DATE,
    hot_flashes BOOLEAN,
    mood_swings BOOLEAN,
    vaginal_dryness BOOLEAN,
    insomnia BOOLEAN,
    hormone_therapy BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "guest_access"
CREATE TABLE guest_access (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES "user" (id) NOT NULL,
    guest_id INTEGER REFERENCES "user" (id) NOT NULL,
    guest_type guest_type NOT NULL,
    access_to JSONB NOT NULL,
    expires_at TIMESTAMP,
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "notification" (Nueva)
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER REFERENCES "user" (id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    guest_access_id INTEGER REFERENCES guest_access (id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla "alert"
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    send_at TIMESTAMP NOT NULL,
    alert_date TIMESTAMP NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    origin_id INTEGER REFERENCES condition (id),
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla user_alert (relación muchos a muchos)
CREATE TABLE user_alert (
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    alert_id INTEGER REFERENCES alert (id) NOT NULL,
    PRIMARY KEY (user_id, alert_id)
);

-- Tabla "symptom_log"
CREATE TABLE symptom_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id) NOT NULL,
    date DATE NOT NULL,
    symptom VARCHAR(100) NOT NULL,
    intensity INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- ÍNDICES para mejorar rendimiento
CREATE INDEX idx_cycle_user ON menstrual_cycle(user_id);
CREATE INDEX idx_cycle_dates ON menstrual_cycle(start_date, end_date);
CREATE INDEX idx_cycle_day_cycle ON cycle_day(cycle_id);
CREATE INDEX idx_cycle_day_date ON cycle_day(date);
CREATE INDEX idx_cycle_day_phase ON cycle_day(phase);
CREATE INDEX idx_hormone_user ON hormone_level(user_id);
CREATE INDEX idx_hormone_cycle_day ON hormone_level(cycle_day_id);
CREATE INDEX idx_notification_recipient ON notification(recipient_id);
CREATE INDEX idx_notification_scheduled ON notification(scheduled_for, is_sent);
CREATE INDEX idx_guest_access_owner ON guest_access(owner_id);
CREATE INDEX idx_guest_access_guest ON guest_access(guest_id);
CREATE INDEX idx_content_type_phase ON content(type, target_phase);
CREATE INDEX idx_user_condition_user ON user_condition(user_id);
CREATE INDEX idx_symptom_user_date ON symptom_log(user_id, date);

-- Datos de ejemplo actualizados
INSERT INTO "user" (email, username, name, last_name, password, profile_type, gender_identity, birth_date, roles)
VALUES
('ana@example.com', 'ana', 'Ana', 'García', '$2y$13$a1b2c3...', 'USER', 'mujer cis', '1990-05-12', ARRAY['ROLE_USER']),
('carlos@example.com', 'carlos', 'Carlos', 'Pérez', '$2y$13$d4e5f6...', 'USER', 'hombre cis', '1980-07-23', ARRAY['ROLE_USER']),
('mar@example.com', 'mar', 'Mar', 'Rodríguez', '$2y$13$g7h8i9...', 'USER', 'hombre trans', '1995-03-10', ARRAY['ROLE_USER']),
('laura@example.com', 'laura', 'Laura', 'Sánchez', '$2y$13$j0k1l2...', 'GUEST', 'no binario', '2002-11-30', ARRAY['ROLE_USER']),
('sofia@example.com', 'sofia', 'Sofía', 'Martínez', '$2y$13$m3n4o5...', 'USER', 'mujer cis', '1998-01-01', ARRAY['ROLE_USER']);

-- Contenido
INSERT INTO content (title, description, content, type, target_phase, tags)
VALUES
('Smoothie para fase menstrual', 'Bebida antioxidante y rica en hierro', 'Mezcla fresas, espinacas, una cucharada de linaza y leche vegetal.', 'recipe', 'menstrual', '["antioxidante", "hierro", "energía"]'),
('Rutina de yoga suave', 'Ejercicios para aliviar calambres', 'Esta rutina de 15 minutos incluye posiciones como postura de niño y torsiones suaves...', 'exercise', 'menstrual', '["yoga", "dolor", "relajación"]'),
('Receta alta en proteínas', 'Ideal para fase folicular', 'Ensalada de quinoa con pollo, aguacate y nueces.', 'recipe', 'folicular', '["proteína", "energía", "construcción"]'),
('Entrenamiento de alta intensidad', 'Aprovecha tu energía en fase folicular', 'Rutina HIIT de 20 minutos para maximizar tu rendimiento físico.', 'exercise', 'folicular', '["cardio", "fuerza", "energía"]'),
('Cuidados durante la ovulación', 'Tips para esta fase', 'Durante la ovulación, es importante mantener una buena hidratación...', 'article', 'ovulacion', '["fertilidad", "bienestar", "hormonas"]');

-- Condiciones
INSERT INTO condition (name, description, is_chronic)
VALUES 
('Menstruación', 'Ciclo menstrual regular', FALSE),
('Embarazo', 'Gestación en curso', FALSE),
('Menopausia', 'Fin del ciclo fértil', FALSE),
('Endometriosis', 'Condición crónica con tejido endometrial fuera del útero', TRUE),
('Síndrome de Ovario Poliquístico', 'Desequilibrio hormonal común', TRUE);

-- Relaciones content_condition
INSERT INTO content_condition (content_id, condition_id)
VALUES
(1, 1), -- Smoothie para menstruación
(2, 1), -- Yoga para menstruación
(3, 1), -- Receta para ciclo regular
(4, 5), -- Ejercicio para SOP
(5, 1); -- Artículo general

-- Ciclos menstruales
INSERT INTO menstrual_cycle (user_id, start_date, end_date, estimated_next_start, average_cycle_length, average_duration)
VALUES
(1, '2024-03-01', '2024-03-06', '2024-03-29', 28, 5),
(3, '2024-03-02', '2024-03-07', '2024-03-30', 28, 5),
(4, '2024-03-05', '2024-03-08', '2024-04-02', 28, 3);

-- Ciclo días
INSERT INTO cycle_day (cycle_id, date, day_number, phase, symptoms, flow_intensity)
VALUES
(1, '2024-03-01', 1, 'menstrual', '{"dolor_abdominal": 4, "fatiga": 3}', 3),
(1, '2024-03-02', 2, 'menstrual', '{"dolor_abdominal": 3, "fatiga": 2}', 3),
(1, '2024-03-03', 3, 'menstrual', '{"dolor_abdominal": 2, "fatiga": 1}', 2),
(1, '2024-03-04', 4, 'menstrual', '{"dolor_abdominal": 1, "fatiga": 1}', 1),
(1, '2024-03-05', 5, 'menstrual', '{"sensibilidad": 2}', 1),
(1, '2024-03-06', 6, 'folicular', '{}', null),
(2, '2024-03-02', 1, 'menstrual', '{"dolor_abdominal": 6, "dolor_cabeza": 5}', 4),
(2, '2024-03-03', 2, 'menstrual', '{"dolor_abdominal": 5, "dolor_cabeza": 3}', 4);

-- Niveles hormonales
INSERT INTO hormone_level (user_id, cycle_day_id, hormone_type, level)
VALUES
(1, 1, 'estrogen', 20.5),
(1, 1, 'progesterone', 0.8),
(1, 5, 'estrogen', 45.2),
(1, 5, 'progesterone', 0.9),
(3, 7, 'estrogen', 18.7),
(3, 7, 'progesterone', 0.7);

-- Notificaciones
INSERT INTO notification (recipient_id, title, message, scheduled_for, is_sent, sent_at, metadata)
VALUES
(1, 'Tu período comenzará pronto', 'Según nuestros cálculos, tu período comenzará en 3 días', '2024-03-26 08:00:00', TRUE, '2024-03-26 08:01:03', '{"type": "period_reminder"}'),
(3, 'Recordatorio de medicación', 'No olvides tomar tus hormonas hoy', '2024-03-22 09:00:00', TRUE, '2024-03-22 09:00:15', '{"type": "medication_reminder"}'),
(4, 'Fase de ovulación', 'Estás en tu fase de ovulación. Buena energía para ejercicios', '2024-03-19 12:00:00', TRUE, '2024-03-19 12:00:05', '{"type": "phase_info"}'),
(5, 'Recordatorio de suministros', 'Tu período está por comenzar. ¡No olvides comprar lo necesario!', '2024-03-25 15:00:00', FALSE, NULL, '{"type": "supplies_reminder"}');

-- Guest Access
INSERT INTO guest_access (owner_id, guest_id, guest_type, access_to, expires_at)
VALUES
(1, 2, 'partner', '["cycle", "alerts"]', '2024-12-31 23:59:59'),
(3, 4, 'friend', '["alerts"]', '2024-06-30 23:59:59'),
(5, 2, 'partner', '["pregnancy", "alerts"]', '2024-12-31 23:59:59');

-- Alertas
INSERT INTO alert (title, description, send_at, alert_date, is_read, origin_id)
VALUES
('Próximo período', 'Tu próximo período está por comenzar', '2024-03-28 08:00:00', '2024-03-29 00:00:00', FALSE, 1),
('Control médico', 'Recuerda agendar tu visita para control de endometriosis', '2024-04-01 09:00:00', '2024-04-10 10:00:00', FALSE, 4),
('Fase fértil', 'Estás en tus días más fértiles', '2024-03-15 12:00:00', '2024-03-15 00:00:00', TRUE, 1);

-- User_Alert
INSERT INTO user_alert (user_id, alert_id)
VALUES
(1, 1),
(4, 2),
(3, 3);
