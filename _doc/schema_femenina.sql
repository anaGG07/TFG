-- Tabla "user"
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_type VARCHAR(20)  DEFAULT "profile_guest"  NOT NULL, -- profile_women, profile_trans, profile_guest, profile_underage (depende de fecha de nacimiento)
    gender_identity VARCHAR(100),
    birth_date DATE,
    roles TEXT[] DEFAULT ARRAY['ROLE_USER'], 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "condition"
CREATE TABLE condition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) is_chronic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "user_condition"
CREATE TABLE user_condition (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    condition_id INTEGER REFERENCES condition (id),
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state BOOLEAN DEFAULT TRUE
);

-- Tabla "menstrual_cycle"
CREATE TABLE menstrual_cycle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    estimated_next_start DATE,
    average_cycle_length INTEGER DEFAULT 28,
    average_duration INTEGER DEFAULT 4, -- duración en días
    flow_amount VARCHAR(50), -- leve, moderado, abundante
    flow_color VARCHAR(50), -- rojo vivo, marrón, rosado
    flow_odor VARCHAR(50), -- neutro, fuerte, metálico
    pain_level INTEGER, -- 0 a 10
    notes VARCHAR(1000) state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

--  Tabla "pregnancy_log"
CREATE TABLE pregnancy_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    start_date DATE,
    due_date DATE,
    week INTEGER,
    symptoms VARCHAR(1000) fetal_movements VARCHAR(1000),
    ultrasound_date DATE,
    notes VARCHAR(255) state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 🌡️ Tabla "menopause_log"
CREATE TABLE menopause_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    start_date DATE,
    hot_flashes BOOLEAN,
    mood_swings BOOLEAN,
    vaginal_dryness BOOLEAN,
    insomnia BOOLEAN,
    hormone_therapy BOOLEAN,
    notes VARCHAR(255) state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 🚨 Tabla "alert"
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    title VARCHAR(255),
    description VARCHAR(255),
    send_at TIMESTAMP,
    alert_date TIMESTAMP  NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    origin INTEGER REFERENCES "condition" (id),
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 🧪 Tabla "hormone_level"
CREATE TABLE hormone_level (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    phase_name VARCHAR(50),
    hormone_name VARCHAR(50),
    level VARCHAR(50),
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 😖 Tabla "symptom_log"
CREATE TABLE symptom_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id),
    date DATE,
    symptom VARCHAR(100),
    intensity INTEGER,
    notes VARCHAR(255) state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 👥 Tabla "guest_access"
CREATE TABLE guest_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user" (id), -- Usuario que permite ver su informacion
    guest_id INTEGER REFERENCES "user" (id), -- Usuario que accede a la informacion (pareja, madre...etc)
    guest_type VARCHAR(50) DEFAULT 'guest' NOT NULL, -- guest_type || parental_type
    access_to JSON,
    expires_at TIMESTAMP,
    state BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- 📥 INSERTS DE EJEMPLO

-- Users
INSERT INTO "user" (email, password, profile_type, gender_identity, birth_date, roles)
VALUES
('ana@example.com', 'hashed_pass1', 'woman', 'mujer cis', '1990-05-12', ARRAY['ROLE_USER']),
('carlos@example.com', 'hashed_pass2', 'parental', 'hombre cis', '1980-07-23', ARRAY['ROLE_USER']),
('mar@example.com', 'hashed_pass3', 'trans', 'hombre trans', '1995-03-10', ARRAY['ROLE_USER']),
('laura@example.com', 'hashed_pass4', 'guest', 'no binario', '2002-11-30', ARRAY['ROLE_USER']),
('sofia@example.com', 'hashed_pass5', 'woman', 'mujer cis', '1998-01-01', ARRAY['ROLE_USER']);

-- Conditions
INSERT INTO
    condition (name, description, is_chronic)
VALUES (
        'Menstruación',
        'Ciclo menstrual regular',
        FALSE
    ),
    (
        'Embarazo',
        'Gestación en curso',
        FALSE
    ),
    (
        'Menopausia',
        'Fin del ciclo fértil',
        FALSE
    ),
    (
        'Endometriosis',
        'Condición crónica con tejido endometrial fuera del útero',
        TRUE
    ),
    (
        'Síndrome de Ovario Poliquístico',
        'Desequilibrio hormonal común',
        TRUE
    );

-- User Conditions
INSERT INTO
    user_condition (
        user_id,
        condition_id,
        start_date,
        notes
    )
VALUES (
        1,
        1,
        '2023-01-01',
        'Ciclos regulares'
    ),
    (
        2,
        3,
        '2022-06-01',
        'Síntomas menopáusicos'
    ),
    (
        3,
        1,
        '2023-08-10',
        'Inicio de seguimiento hormonal'
    ),
    (
        4,
        4,
        '2020-09-01',
        'Diagnóstico clínico confirmado'
    ),
    (
        5,
        2,
        '2024-04-01',
        'Primer trimestre de embarazo'
    );

-- Menstrual Cycles
INSERT INTO
    menstrual_cycle (
        user_id,
        start_date,
        end_date,
        estimated_next_start,
        average_cycle_length,
        flow_amount,
        flow_color,
        flow_odor,
        pain_level,
        notes
    )
VALUES (
        1,
        '2024-03-01',
        '2024-03-06',
        '2024-03-29',
        28,
        'moderado',
        'rojo vivo',
        'neutro',
        4,
        'Todo normal'
    ),
    (
        3,
        '2024-03-02',
        '2024-03-07',
        '2024-03-30',
        28,
        'abundante',
        'marrón',
        'fuerte',
        7,
        'Dolor fuerte'
    ),
    (
        4,
        '2024-03-05',
        '2024-03-08',
        '2024-04-02',
        28,
        'leve',
        'rosado',
        'neutro',
        2,
        'Leve manchado'
    ),
    (
        1,
        '2024-02-02',
        '2024-02-07',
        '2024-03-01',
        28,
        'moderado',
        'rojo vivo',
        'neutro',
        3,
        'Previo al actual'
    ),
    (
        5,
        '2024-01-15',
        '2024-01-20',
        '2024-02-12',
        28,
        'abundante',
        'rojo oscuro',
        'fuerte',
        5,
        'Último antes del embarazo'
    );

-- Pregnancy Logs
INSERT INTO
    pregnancy_log (
        user_id,
        start_date,
        due_date,
        week,
        symptoms,
        fetal_movements,
        ultrasound_date,
        notes
    )
VALUES (
        5,
        '2024-04-01',
        '2025-01-01',
        8,
        'náuseas, cansancio',
        'aún no detectados',
        '2024-04-20',
        'Primer embarazo'
    ),
    (
        1,
        '2022-02-01',
        '2022-11-01',
        40,
        'controlado',
        'movimientos regulares',
        '2022-03-15',
        'Embarazo anterior'
    ),
    (
        2,
        '2018-05-01',
        '2019-02-01',
        40,
        'ninguno',
        'movimientos normales',
        '2018-06-15',
        'Segundo hijo'
    ),
    (
        3,
        '2021-10-01',
        '2022-07-01',
        35,
        'reflujo, insomnio',
        'movimientos activos',
        '2021-11-10',
        'Complicaciones leves'
    ),
    (
        4,
        '2020-01-01',
        '2020-10-01',
        38,
        'ninguno',
        'movimientos normales',
        '2020-02-10',
        'Todo bien'
    );

-- Menopause Logs
INSERT INTO
    menopause_log (
        user_id,
        start_date,
        hot_flashes,
        mood_swings,
        vaginal_dryness,
        insomnia,
        hormone_therapy,
        notes
    )
VALUES (
        2,
        '2022-06-01',
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        'Inicio de terapia hormonal'
    ),
    (
        1,
        '2023-01-01',
        TRUE,
        FALSE,
        FALSE,
        TRUE,
        FALSE,
        'Síntomas leves'
    ),
    (
        3,
        '2020-05-01',
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        'Seguimiento constante'
    ),
    (
        4,
        '2019-10-01',
        TRUE,
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        'Solo bochornos'
    ),
    (
        5,
        '2021-07-01',
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        'Terapia preventiva'
    );

-- Alerts
INSERT INTO
    alert (
        user_id,
        title,
        description,
        type,
        send_at,
        origin
    )
VALUES (
        1,
        'Próximo ciclo',
        'Tu próximo ciclo comenzará en 3 días',
        'cycle',
        '2024-03-26 08:00:00',
        'system'
    ),
    (
        2,
        'Síntomas menopausia',
        'Recuerda hidratarte bien hoy',
        'health',
        '2024-03-21 10:00:00',
        'AI'
    ),
    (
        3,
        'Control hormonal',
        'Revisa tus niveles de progesterona',
        'hormone',
        '2024-03-22 09:00:00',
        'system'
    ),
    (
        4,
        'Alerta pareja',
        'Hoy es un buen día para acompañar con chocolate 😋',
        'partner_tip',
        '2024-03-23 18:00:00',
        'AI'
    ),
    (
        5,
        'Registro embarazo',
        'Recuerda registrar tus síntomas del día',
        'pregnancy',
        '2024-03-21 08:30:00',
        'system'
    );

-- Hormone Levels
INSERT INTO
    hormone_level (
        user_id,
        phase_name,
        hormone_name,
        level,
        recorded_at
    )
VALUES (
        1,
        'lútea',
        'progesterona',
        'alta',
        '2024-03-18'
    ),
    (
        1,
        'ovulación',
        'estrógeno',
        'alta',
        '2024-03-14'
    ),
    (
        3,
        'menstrual',
        'progesterona',
        'baja',
        '2024-03-02'
    ),
    (
        3,
        'folicular',
        'FSH',
        'media',
        '2024-03-06'
    ),
    (
        5,
        'ovulación',
        'LH',
        'alta',
        '2024-03-10'
    );

-- Symptom Log
INSERT INTO
    symptom_log (
        user_id,
        date,
        symptom,
        intensity,
        notes
    )
VALUES (
        1,
        '2024-03-01',
        'dolor abdominal',
        4,
        'Molestia leve'
    ),
    (
        3,
        '2024-03-02',
        'dolor de cabeza',
        7,
        'Dolor agudo'
    ),
    (
        4,
        '2024-03-05',
        'fatiga',
        6,
        'Cansancio general'
    ),
    (
        5,
        '2024-03-10',
        'náuseas',
        8,
        'Embarazo temprano'
    ),
    (
        2,
        '2024-03-15',
        'bochornos',
        5,
        'Inicio de síntomas'
    );

-- Guest Access
INSERT INTO
    guest_access (
        user_id,
        guest_type,
        access_to,
        expires_at
    )
VALUES (
        1,
        'pareja',
        '["cycle", "alerts"]',
        '2024-04-30 23:59:59'
    ),
    (
        2,
        'parental',
        '["symptoms", "alerts"]',
        '2024-06-01 23:59:59'
    ),
    (
        3,
        'pareja',
        '["cycle"]',
        '2024-05-15 23:59:59'
    ),
    (
        4,
        'invitado',
        '["alerts"]',
        '2024-04-01 23:59:59'
    ),
    (
        5,
        'pareja',
        '["pregnancy", "symptoms"]',
        '2024-07-01 23:59:59'
    );