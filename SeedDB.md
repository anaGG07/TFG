-- EYRA Database Inserts
-- Orden de inserción respetando dependencias de claves foráneas

-- ===========================================
-- 1. USUARIOS ADICIONALES (además del admin existente)
-- ===========================================
INSERT INTO "user" (email, roles, password, username, name, last_name, profile_type, birth_date, created_at, state, onboarding_completed, avatar) VALUES
-- Usuario Regular Joven (id=2)
('maria.garcia@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword1', 'maria_garcia', 'María', 'García', 'personal', '2000-03-15', '2024-01-15 10:00:00', true, true, '{"skinColor": "fair", "eyes": "brown", "eyebrows": "thick", "mouth": "smile", "hairStyle": "long", "hairColor": "brown", "facialHair": "none", "clothes": "casual", "fabricColor": "blue", "glasses": "none", "glassOpacity": "0", "accessories": "earrings", "tattoos": "none", "backgroundColor": "pink"}'),

-- Usuario Adulta (id=3)
('ana.lopez@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword2', 'ana_lopez', 'Ana', 'López', 'personal', '1985-07-22', '2024-01-16 11:30:00', true, true, '{"skinColor": "medium", "eyes": "green", "eyebrows": "normal", "mouth": "neutral", "hairStyle": "short", "hairColor": "black", "facialHair": "none", "clothes": "professional", "fabricColor": "black", "glasses": "reading", "glassOpacity": "0.8", "accessories": "watch", "tattoos": "small", "backgroundColor": "blue"}'),

-- Usuario Pareja Masculina (id=4)
('carlos.martinez@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword3', 'carlos_martinez', 'Carlos', 'Martínez', 'partner', '1988-11-08', '2024-01-17 09:15:00', true, true, '{"skinColor": "tan", "eyes": "blue", "eyebrows": "normal", "mouth": "smile", "hairStyle": "short", "hairColor": "blonde", "facialHair": "beard", "clothes": "casual", "fabricColor": "red", "glasses": "none", "glassOpacity": "0", "accessories": "none", "tattoos": "none", "backgroundColor": "green"}'),

-- Usuario Adolescente (id=5)
('sofia.rodriguez@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword4', 'sofia_rodriguez', 'Sofía', 'Rodríguez', 'teen', '2008-09-12', '2024-01-18 14:20:00', true, false, '{"skinColor": "fair", "eyes": "hazel", "eyebrows": "thin", "mouth": "smile", "hairStyle": "curly", "hairColor": "red", "facialHair": "none", "clothes": "trendy", "fabricColor": "purple", "glasses": "none", "glassOpacity": "0", "accessories": "necklace", "tattoos": "none", "backgroundColor": "yellow"}'),

-- Usuario Madre Adulta (id=6)
('laura.fernandez@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword5', 'laura_fernandez', 'Laura', 'Fernández', 'parent', '1978-04-30', '2024-01-19 16:45:00', true, true, '{"skinColor": "medium", "eyes": "brown", "eyebrows": "normal", "mouth": "neutral", "hairStyle": "medium", "hairColor": "brown", "facialHair": "none", "clothes": "casual", "fabricColor": "gray", "glasses": "none", "glassOpacity": "0", "accessories": "bracelet", "tattoos": "none", "backgroundColor": "white"}'),

-- Usuario Embarazada (id=7)  
('patricia.jimenez@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword6', 'patricia_jimenez', 'Patricia', 'Jiménez', 'personal', '1992-12-05', '2024-01-20 12:30:00', true, true, '{"skinColor": "fair", "eyes": "green", "eyebrows": "thick", "mouth": "smile", "hairStyle": "long", "hairColor": "blonde", "facialHair": "none", "clothes": "maternity", "fabricColor": "pink", "glasses": "none", "glassOpacity": "0", "accessories": "ring", "tattoos": "none", "backgroundColor": "lavender"}'),

-- Usuario Menopausia (id=8)
('carmen.santos@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword7', 'carmen_santos', 'Carmen', 'Santos', 'personal', '1965-06-18', '2024-01-21 08:00:00', true, true, '{"skinColor": "tan", "eyes": "brown", "eyebrows": "normal", "mouth": "neutral", "hairStyle": "short", "hairColor": "gray", "facialHair": "none", "clothes": "elegant", "fabricColor": "navy", "glasses": "reading", "glassOpacity": "0.9", "accessories": "earrings", "tattoos": "none", "backgroundColor": "beige"}'),

-- Usuario Pareja Femenina (id=9)
('elena.castro@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword8', 'elena_castro', 'Elena', 'Castro', 'partner', '1990-02-14', '2024-01-22 13:15:00', true, true, '{"skinColor": "medium", "eyes": "blue", "eyebrows": "normal", "mouth": "smile", "hairStyle": "medium", "hairColor": "black", "facialHair": "none", "clothes": "sporty", "fabricColor": "green", "glasses": "none", "glassOpacity": "0", "accessories": "watch", "tattoos": "medium", "backgroundColor": "cyan"}'),

-- Usuario Joven Universitaria (id=10)
('natalia.moreno@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword9', 'natalia_moreno', 'Natalia', 'Moreno', 'personal', '2002-08-25', '2024-01-23 15:40:00', true, true, '{"skinColor": "fair", "eyes": "green", "eyebrows": "thin", "mouth": "smile", "hairStyle": "long", "hairColor": "brown", "facialHair": "none", "clothes": "casual", "fabricColor": "orange", "glasses": "none", "glassOpacity": "0", "accessories": "earrings", "tattoos": "small", "backgroundColor": "coral"}'),

-- Usuario Profesional (id=11)
('isabella.ruiz@email.com', '["ROLE_USER"]', '$2y$13$hashedpassword10', 'isabella_ruiz', 'Isabella', 'Ruiz', 'personal', '1987-01-10', '2024-01-24 17:20:00', true, true, '{"skinColor": "medium", "eyes": "hazel", "eyebrows": "normal", "mouth": "neutral", "hairStyle": "short", "hairColor": "blonde", "facialHair": "none", "clothes": "professional", "fabricColor": "burgundy", "glasses": "stylish", "glassOpacity": "0.7", "accessories": "necklace", "tattoos": "none", "backgroundColor": "gold"}');

-- ===========================================
-- 2. CONDICIONES MÉDICAS
-- ===========================================
INSERT INTO condition (name, description, is_chronic, created_at, state, category, severity) VALUES
-- Condiciones Ginecológicas Comunes
('Síndrome Premenstrual', 'Conjunto de síntomas físicos y emocionales que ocurren antes de la menstruación', false, '2024-01-01 00:00:00', true, 'menstrual', 'mild'),
('Dismenorrea', 'Dolor menstrual intenso que puede interferir con actividades diarias', false, '2024-01-01 00:00:00', true, 'menstrual', 'moderate'),
('Amenorrea', 'Ausencia de menstruación por más de 3 meses consecutivos', false, '2024-01-01 00:00:00', true, 'menstrual', 'severe'),
('Menorragia', 'Sangrado menstrual excesivamente abundante o prolongado', false, '2024-01-01 00:00:00', true, 'menstrual', 'moderate'),
('Endometriosis', 'Tejido endometrial crece fuera del útero causando dolor y inflamación', true, '2024-01-01 00:00:00', true, 'gynecological', 'severe'),
('Síndrome de Ovario Poliquístico', 'Trastorno hormonal común que afecta a mujeres en edad reproductiva', true, '2024-01-01 00:00:00', true, 'hormonal', 'moderate'),
('Miomas Uterinos', 'Tumores benignos en el útero que pueden causar sangrado abundante', false, '2024-01-01 00:00:00', true, 'gynecological', 'moderate'),
('Quistes Ováricos', 'Sacos llenos de líquido que se forman en o sobre los ovarios', false, '2024-01-01 00:00:00', true, 'gynecological', 'mild'),
('Vaginitis', 'Inflamación de la vagina que puede causar picazón y flujo anormal', false, '2024-01-01 00:00:00', true, 'gynecological', 'mild'),
('Menopausia Precoz', 'Cese de la menstruación antes de los 40 años de edad', true, '2024-01-01 00:00:00', true, 'hormonal', 'severe'),
('Trastornos de la Tiroides', 'Alteraciones en la función tiroidea que afectan el ciclo menstrual', true, '2024-01-01 00:00:00', true, 'hormonal', 'moderate'),
('Anemia por Deficiencia de Hierro', 'Niveles bajos de hierro frecuentemente relacionados con menstruación abundante', false, '2024-01-01 00:00:00', true, 'nutritional', 'moderate');

-- ===========================================
-- 3. CONTENIDO EDUCATIVO
-- ===========================================
INSERT INTO content (title, description, content, type, target_phase, tags, image_url, created_at) VALUES
-- Contenido sobre Fases del Ciclo
('Entendiendo la Fase Menstrual', 'Guía completa sobre los primeros días del ciclo menstrual', 'Durante la fase menstrual (días 1-5), el revestimiento uterino se desprende causando el sangrado menstrual. Es normal experimentar calambres, fatiga y cambios de humor. Recomendaciones: descanso adecuado, hidratación, aplicar calor en el abdomen, ejercicio suave como yoga.', 'educational', 'menstrual', '["fase menstrual", "período", "autocuidado", "síntomas"]', 'https://example.com/menstrual-phase.jpg', '2024-01-01 00:00:00'),

('La Fase Folicular: Renovación y Energía', 'Comprende los cambios hormonales durante la fase folicular', 'La fase folicular (días 1-13) se caracteriza por el aumento gradual de estrógenos. Tu energía aumenta, la piel mejora y es un momento ideal para nuevos proyectos. Aprovecha para ejercitarte intensamente y planificar actividades sociales.', 'educational', 'folicular', '["fase folicular", "estrógenos", "energía", "ejercicio"]', 'https://example.com/follicular-phase.jpg', '2024-01-01 00:00:00'),

('Ovulación: El Momento Fértil', 'Todo sobre la ovulación y la fertilidad', 'La ovulación ocurre alrededor del día 14. Los estrógenos alcanzan su pico y luego bajan bruscamente. Señales: aumento de temperatura corporal, cambio en flujo cervical, mayor libido. Es el momento de mayor fertilidad del ciclo.', 'educational', 'ovulacion', '["ovulación", "fertilidad", "temperatura basal", "flujo cervical"]', 'https://example.com/ovulation.jpg', '2024-01-01 00:00:00'),

('Fase Lútea: Preparación y Equilibrio', 'Navegando la segunda mitad del ciclo menstrual', 'La fase lútea (días 15-28) está dominada por la progesterona. Pueden aparecer síntomas premenstruales. Enfócate en actividades relajantes, alimentación balanceada rica en magnesio y vitamina B6, y ejercicio moderado.', 'educational', 'lutea', '["fase lútea", "progesterona", "SPM", "autocuidado"]', 'https://example.com/luteal-phase.jpg', '2024-01-01 00:00:00'),

-- Contenido sobre Nutrición
('Nutrición Durante el Ciclo Menstrual', 'Guía nutricional para cada fase del ciclo', 'Ajusta tu alimentación según la fase del ciclo: Fase menstrual - hierro y vitamina C; Folicular - proteínas y vegetales frescos; Ovulación - antioxidantes; Lútea - carbohidratos complejos y magnesio.', 'nutritional', null, '["nutrición", "alimentación", "vitaminas", "minerales"]', 'https://example.com/nutrition-cycle.jpg', '2024-01-02 00:00:00'),

('Ejercicio y Rendimiento Físico', 'Optimiza tu entrenamiento según tu ciclo', 'Adapta tu rutina de ejercicio: Menstrual - yoga suave, caminata; Folicular - entrenamientos intensos, cardio; Ovulación - máximo rendimiento; Lútea - ejercicios de fuerza moderada, estiramientos.', 'fitness', null, '["ejercicio", "deporte", "rendimiento", "bienestar"]', 'https://example.com/exercise-cycle.jpg', '2024-01-03 00:00:00'),

('Manejo del Estrés y Bienestar Mental', 'Técnicas para mantener el equilibrio emocional', 'El ciclo menstrual afecta el estado de ánimo debido a las fluctuaciones hormonales. Practica mindfulness, meditación, mantén rutinas de sueño regulares y no dudes en buscar apoyo profesional si es necesario.', 'wellness', null, '["bienestar mental", "estrés", "meditación", "autocuidado"]', 'https://example.com/mental-wellness.jpg', '2024-01-04 00:00:00'),

('Productos Menstruales: Guía Completa', 'Conoce todas tus opciones para el período', 'Explora diferentes productos menstruales: toallas sanitarias, tampones, copas menstruales, ropa interior menstrual. Cada opción tiene ventajas específicas según tu estilo de vida y preferencias personales.', 'educational', 'menstrual', '["productos menstruales", "copa menstrual", "sustentabilidad"]', 'https://example.com/menstrual-products.jpg', '2024-01-05 00:00:00'),

('Síntomas Premenstruales: Manejo Natural', 'Alternativas naturales para aliviar el SPM', 'Alivia los síntomas premenstruales naturalmente: infusiones de manzanilla, suplementos de magnesio, aceite de onagra, ejercicio regular, técnicas de relajación, alimentación antiinflamatoria.', 'wellness', 'lutea', '["SPM", "remedios naturales", "inflamación", "relajación"]', 'https://example.com/pms-relief.jpg', '2024-01-06 00:00:00'),

('Fertilidad y Planificación Familiar', 'Comprende tu fertilidad para planificar o prevenir embarazo', 'Métodos naturales de planificación familiar: seguimiento de temperatura basal, observación del moco cervical, calendario menstrual. También información sobre métodos anticonceptivos hormonales y de barrera.', 'educational', 'ovulacion', '["fertilidad", "planificación familiar", "anticonceptivos"]', 'https://example.com/fertility-planning.jpg', '2024-01-07 00:00:00');

-- ===========================================
-- 4. RELACIONES CONTENIDO-CONDICIÓN
-- ===========================================
INSERT INTO content_condition (content_id, condition_id) VALUES
-- Relacionar contenido educativo con condiciones relevantes
(1, 1), (1, 2), -- Contenido menstrual con SPM y dismenorrea
(4, 1), (4, 6), -- Contenido fase lútea con SPM y SOP
(5, 11), (5, 12), -- Contenido nutricional con tiroides y anemia
(9, 1), (9, 2), -- Contenido SPM con síndrome premenstrual y dismenorrea
(6, 5), (6, 6), -- Contenido ejercicio con endometriosis y SOP
(8, 4), (8, 7), -- Contenido productos con menorragia y miomas
(10, 6), (10, 10); -- Contenido fertilidad dengan SOP y menopausia precoz

-- ===========================================
-- 5. PROCESOS DE ONBOARDING
-- ===========================================
INSERT INTO onboarding (user_id, profile_type, gender_identity, pronouns, is_personal, stage_of_life, last_period_date, average_cycle_length, average_period_length, hormone_type, hormone_start_date, hormone_frequency_days, receive_alerts, receive_recommendations, receive_cycle_phase_tips, receive_workout_suggestions, receive_nutrition_advice, share_cycle_with_partner, want_ai_companion, health_concerns, access_code, allow_parental_monitoring, common_symptoms, created_at, completed) VALUES
-- María García - Usuario Joven
(2, 'personal', 'female', 'ella', true, 'reproductive', '2024-01-10', 28, 5, null, null, null, true, true, true, true, true, false, true, '["SPM", "calambres menstruales"]', null, false, '["dolor abdominal", "cambios de humor", "fatiga"]', '2024-01-15 10:00:00', true),

-- Ana López - Adulta
(3, 'personal', 'female', 'ella', true, 'reproductive', '2024-01-05', 30, 4, null, null, null, true, true, false, true, true, true, false, '["endometriosis"]', null, false, '["dolor pélvico severo", "sangrado abundante"]', '2024-01-16 11:30:00', true),

-- Carlos Martínez - Pareja
(4, 'partner', 'male', 'él', false, 'supportive', null, null, null, null, null, null, true, false, false, false, false, true, false, '[]', 'PARTNER2024', false, '[]', '2024-01-17 09:15:00', true),

-- Sofía Rodríguez - Adolescente (onboarding incompleto)
(5, 'teen', 'female', 'ella', true, 'puberty', '2024-01-12', 32, 6, null, null, null, false, true, true, false, true, false, true, '["períodos irregulares"]', null, true, '["calambres", "cambios de humor severos"]', '2024-01-18 14:20:00', false),

-- Laura Fernández - Madre
(6, 'parent', 'female', 'ella', true, 'reproductive', '2024-01-08', 26, 4, null, null, null, true, true, true, false, true, true, false, '["miomas uterinos"]', null, false, '["sangrado abundante", "presión pélvica"]', '2024-01-19 16:45:00', true),

-- Patricia Jiménez - Embarazada  
(7, 'personal', 'female', 'ella', true, 'pregnancy', '2023-10-15', 28, 5, null, null, null, true, true, false, false, true, true, true, '[]', null, false, '[]', '2024-01-20 12:30:00', true),

-- Carmen Santos - Menopausia
(8, 'personal', 'female', 'ella', true, 'menopause', '2023-08-20', 45, 3, 'hormone_therapy', '2024-01-01', 30, true, true, false, true, true, false, false, '["sofocos", "sequedad vaginal"]', null, false, '["insomnio", "cambios de humor", "sofocos"]', '2024-01-21 08:00:00', true),

-- Elena Castro - Pareja Femenina
(9, 'partner', 'female', 'ella', false, 'reproductive', '2024-01-11', 29, 5, null, null, null, true, false, false, false, false, true, false, '[]', 'COUPLE2024', false, '[]', '2024-01-22 13:15:00', true),

-- Natalia Moreno - Universitaria
(10, 'personal', 'female', 'ella', true, 'reproductive', '2024-01-13', 27, 4, 'birth_control', '2023-06-01', 21, true, true, true, true, true, false, true, '["ansiedad menstrual"]', null, false, '["dolor de cabeza", "náuseas"]', '2024-01-23 15:40:00', true),

-- Isabella Ruiz - Profesional
(11, 'personal', 'female', 'ella', true, 'reproductive', '2024-01-07', 31, 5, null, null, null, true, true, false, true, false, false, false, '["SOP", "acné hormonal"]', null, false, '["períodos irregulares", "acné", "aumento de peso"]', '2024-01-24 17:20:00', true);

-- ===========================================
-- 6. CONDICIONES DE USUARIOS  
-- ===========================================
INSERT INTO user_condition (user_id, condition_id, start_date, end_date, notes, created_at, state) VALUES
-- María García
(2, 1, '2023-06-01', null, 'SPM moderado con síntomas emocionales predominantes', '2024-01-15 10:00:00', true),
(2, 2, '2023-06-01', null, 'Dismenorrea leve tratada con antiinflamatorios', '2024-01-15 10:00:00', true),

-- Ana López  
(3, 5, '2022-03-15', null, 'Endometriosis diagnosticada por laparoscopia', '2024-01-16 11:30:00', true),
(3, 12, '2023-01-10', null, 'Anemia secundaria a sangrado abundante', '2024-01-16 11:30:00', true),

-- Sofía Rodríguez
(5, 1, '2023-12-01', null, 'SPM severo con cambios de humor marcados', '2024-01-18 14:20:00', true),

-- Laura Fernández
(6, 7, '2023-05-20', null, 'Múltiples miomas uterinos detectados por ultrasonido', '2024-01-19 16:45:00', true),
(6, 4, '2023-05-20', null, 'Menorragia asociada a miomas uterinos', '2024-01-19 16:45:00', true),

-- Carmen Santos
(8, 10, '2023-08-01', null, 'Menopausia precoz confirmada con estudios hormonales', '2024-01-21 08:00:00', true),

-- Natalia Moreno  
(10, 11, '2023-04-10', null, 'Hipotiroidismo subclínico afectando ciclo menstrual', '2024-01-23 15:40:00', true),

-- Isabella Ruiz
(11, 6, '2022-09-15', null, 'SOP diagnosticado con criterios de Rotterdam', '2024-01-24 17:20:00', true),
(11, 8, '2023-02-01', '2023-11-30', 'Quistes ováricos resueltos con tratamiento', '2024-01-24 17:20:00', false);

-- ===========================================
-- 7. CICLOS MENSTRUALES
-- ===========================================
INSERT INTO menstrual_cycle (user_id, phase, cycle_id, start_date, end_date, estimated_next_start, average_cycle_length, average_duration, flow_amount, flow_color, flow_odor, pain_level, notes, created_at) VALUES
-- María García - Ciclos regulares
(2, 'lutea', 'cycle_2_2024_01', '2024-01-10', '2024-01-14', '2024-02-07', 28, 5, 'moderate', 'red', 'normal', 3, 'Ciclo normal con calambres moderados', '2024-01-10 08:00:00'),
(2, 'menstrual', 'cycle_2_2023_12', '2023-12-13', '2023-12-17', '2024-01-10', 28, 5, 'moderate', 'red', 'normal', 4, 'Mayor dolor premenstrual este mes', '2023-12-13 08:00:00'),

-- Ana López - Endometriosis
(3, 'folicular', 'cycle_3_2024_01', '2024-01-05', '2024-01-09', '2024-02-04', 30, 4, 'heavy', 'dark_red', 'normal', 8, 'Dolor severo, requirió medicación fuerte', '2024-01-05 07:30:00'),
(3, 'menstrual', 'cycle_3_2023_12', '2023-12-06', '2023-12-10', '2024-01-05', 30, 4, 'heavy', 'dark_red', 'normal', 9, 'Episodio particularmente doloroso', '2023-12-06 07:30:00'),

-- Sofía Rodríguez - Ciclos irregulares adolescente
(5, 'ovulacion', 'cycle_5_2024_01', '2024-01-12', '2024-01-18', '2024-02-13', 32, 6, 'light', 'bright_red', 'normal', 2, 'Primer ciclo más regular en meses', '2024-01-12 16:00:00'),

-- Laura Fernández - Miomas
(6, 'lutea', 'cycle_6_2024_01', '2024-01-08', '2024-01-12', '2024-02-03', 26, 4, 'very_heavy', 'dark_red', 'normal', 6, 'Sangrado muy abundante por miomas', '2024-01-08 09:15:00'),

-- Natalia Moreno - Con anticonceptivos
(10, 'menstrual', 'cycle_10_2024_01', '2024-01-13', '2024-01-17', '2024-02-10', 27, 4, 'light', 'light_red', 'minimal', 1, 'Ciclo ligero con anticonceptivos', '2024-01-13 10:30:00'),

-- Isabella Ruiz - SOP ciclos irregulares
(11, 'folicular', 'cycle_11_2024_01', '2024-01-07', '2024-01-12', '2024-02-07', 31, 5, 'moderate', 'brown', 'normal', 5, 'Ciclo tras 45 días de ausencia', '2024-01-07 11:00:00');

-- ===========================================
-- 8. DÍAS DEL CICLO DETALLADOS
-- ===========================================
INSERT INTO cycle_day (cycle_phase_id, cycle_id, phase, date, day_number, symptoms, notes, mood, flow_intensity, created_at) VALUES
-- María García - Detalles del ciclo actual
(1, 2, 'menstrual', '2024-01-10', 1, '["calambres", "fatiga"]', '{"energy_level": "low", "exercise": "yoga suave"}', '{"main_mood": "irritable", "anxiety_level": 3}', 4, '2024-01-10 20:00:00'),
(1, 2, 'menstrual', '2024-01-11', 2, '["calambres", "dolor_espalda"]', '{"energy_level": "low", "exercise": "caminata"}', '{"main_mood": "sad", "anxiety_level": 2}', 5, '2024-01-11 20:00:00'),
(1, 2, 'menstrual', '2024-01-12', 3, '["fatiga"]', '{"energy_level": "moderate", "exercise": "none"}', '{"main_mood": "neutral", "anxiety_level": 1}', 3, '2024-01-12 20:00:00'),

-- Ana López - Endometriosis
(3, 3, 'menstrual', '2024-01-05', 1, '["dolor_severo", "náuseas", "fatiga_extrema"]', '{"energy_level": "very_low", "medication": "ibuprofeno 600mg"}', '{"main_mood": "frustrated", "anxiety_level": 4}', 5, '2024-01-05 21:00:00'),
(3, 3, 'menstrual', '2024-01-06', 2, '["dolor_severo", "vómitos"]', '{"energy_level": "very_low", "medication": "tramadol"}', '{"main_mood": "depressed", "anxiety_level": 5}', 5, '2024-01-06 21:00:00'),

-- Laura Fernández - Miomas
(6, 6, 'menstrual', '2024-01-08', 1, '["sangrado_abundante", "coágulos", "calambres"]', '{"energy_level": "low", "pad_changes": 8}', '{"main_mood": "worried", "anxiety_level": 3}', 5, '2024-01-08 22:00:00'),
(6, 6, 'menstrual', '2024-01-09', 2, '["sangrado_abundante", "mareos"]', '{"energy_level": "very_low", "iron_supplement": true}', '{"main_mood": "tired", "anxiety_level": 2}', 5, '2024-01-09 22:00:00');

-- ===========================================
-- 9. REGISTROS DE SÍNTOMAS
-- ===========================================
INSERT INTO symptom_log (user_id, date, symptom, intensity, notes, state, created_at, entity) VALUES
-- María García - Seguimiento SPM
(2, '2024-01-07', 'cambios_humor', 4, 'Irritabilidad marcada 3 días antes del período', true, '2024-01-07 19:00:00', 'cycle'),
(2, '2024-01-08', 'dolor_senos', 3, 'Sensibilidad mamaria moderada', true, '2024-01-08 19:00:00', 'cycle'),
(2, '2024-01-09', 'hinchazón', 4, 'Distensión abdominal significativa', true, '2024-01-09 19:00:00', 'cycle'),

-- Ana López - Endometriosis
(3, '2024-01-03', 'dolor_pélvico', 8, 'Dolor penetrante constante, empeora al caminar', true, '2024-01-03 18:30:00', 'condition'),
(3, '2024-01-04', 'dolor_espalda_baja', 7, 'Dolor irradiado a zona lumbar', true, '2024-01-04 18:30:00', 'condition'),
(3, '2024-01-15', 'fatiga', 6, 'Cansancio extremo después del período', true, '2024-01-15 18:30:00', 'condition'),

-- Laura Fernández - Miomas
(6, '2024-01-06', 'presión_pélvica', 5, 'Sensación de peso en pelvis', true, '2024-01-06 20:15:00', 'condition'),
(6, '2024-01-08', 'sangrado_abundante', 8, 'Cambio de protección cada hora', true, '2024-01-08 20:15:00', 'cycle'),

-- Carmen Santos - Menopausia
(8, '2024-01-15', 'sofocos', 6, 'Múltiples episodios durante la noche', true, '2024-01-15 21:45:00', 'menopause'),
(8, '2024-01-16', 'insomnio', 7, 'Despertares frecuentes, sudoración nocturna', true, '2024-01-16 21:45:00', 'menopause'),

-- Isabella Ruiz - SOP
(11, '2024-01-20', 'acné', 4, 'Brote hormonal en mentón y frente', true, '2024-01-20 17:30:00', 'condition'),
(11, '2024-01-22', 'hirsutismo', 3, 'Crecimiento de vello facial aumentado', true, '2024-01-22 17:30:00', 'condition');

-- ===========================================
-- 10. NIVELES HORMONALES
-- ===========================================
INSERT INTO hormone_level (user_id, cycle_day_id, hormone_type, level, state, created_at) VALUES
-- María García - Niveles normales
(2, 1, 'estradiol', 45.2, true, '2024-01-10 09:00:00'),
(2, 1, 'progesterone', 2.1, true, '2024-01-10 09:00:00'),
(2, 2, 'estradiol', 38.7, true, '2024-01-11 09:00:00'),
(2, 2, 'progesterone', 1.8, true, '2024-01-11 09:00:00'),

-- Ana López - Alteraciones por endometriosis
(3, 4, 'estradiol', 89.4, true, '2024-01-05 08:30:00'),
(3, 4, 'progesterone', 0.9, true, '2024-01-05 08:30:00'),
(3, 5, 'estradiol', 78.2, true, '2024-01-06 08:30:00'),

-- Carmen Santos - Menopausia
(8, null, 'estradiol', 12.3, true, '2024-01-15 10:00:00'),
(8, null, 'progesterone', 0.2, true, '2024-01-15 10:00:00'),
(8, null, 'fsh', 89.7, true, '2024-01-15 10:00:00'),
(8, null, 'lh', 67.4, true, '2024-01-15 10:00:00'),

-- Isabella Ruiz - SOP alteraciones
(11, 7, 'testosterone', 3.2, true, '2024-01-07 11:30:00'),
(11, 7, 'lh', 24.8, true, '2024-01-07 11:30:00'),
(11, 7, 'fsh', 4.1, true, '2024-01-07 11:30:00');

-- ===========================================
-- 11. REGISTROS DE EMBARAZO
-- ===========================================
INSERT INTO pregnancy_log (user_id, start_date, due_date, week, symptoms, fetal_movements, ultrasound_date, notes, created_at) VALUES
-- Patricia Jiménez - Embarazo actual
(7, '2023-10-15', '2024-07-22', 16, 'Náuseas matutinas han disminuido, mayor energía, acidez ocasional', 'Primeros movimientos sutiles detectados', '2024-01-18', 'Embarazo progresando normalmente, todos los marcadores en rango', '2024-01-20 12:30:00');

-- ===========================================
-- 12. REGISTROS DE MENOPAUSIA
-- ===========================================
INSERT INTO menopause_log (user_id, hot_flashes, mood_swings, vaginal_dryness, insomnia, hormone_therapy, notes, created_at) VALUES
-- Carmen Santos - Seguimiento menopausia
(8, true, true, true, true, true, 'Terapia hormonal iniciada hace 3 meses, mejora gradual de síntomas. Sofocos menos frecuentes pero persiste insomnio. Revisión programada próximo mes.', '2024-01-21 08:00:00');

-- ===========================================
-- 13. CÓDIGOS DE INVITACIÓN
-- ===========================================
INSERT INTO invitation_code (code, creator_id, guest_type, access_permissions, created_at, expires_at, status, redeemed_by_id, redeemed_at) VALUES
-- Códigos creados por diferentes usuarios
('SHARE2024', 2, 'partner', '["cycle_tracking", "mood_data"]', '2024-01-15 15:00:00', '2024-02-15 15:00:00', 'active', null, null),
('FAMILY123', 6, 'teen_monitor', '["basic_cycle", "emergency_alerts"]', '2024-01-19 18:00:00', '2024-03-19 18:00:00', 'active', null, null),
('COUPLE01', 3, 'partner', '["full_access"]', '2024-01-16 12:00:00', '2024-02-16 12:00:00', 'redeemed', 4, '2024-01-17 09:15:00'),
('SUPPORT5', 8, 'healthcare', '["symptoms", "hormone_levels"]', '2024-01-21 10:00:00', '2024-04-21 10:00:00', 'active', null, null),
('MONITOR9', 5, 'parent', '["basic_info", "emergency_only"]', '2024-01-18 16:00:00', '2024-07-18 16:00:00', 'expired', null, null);

-- ===========================================
-- 14. ACCESOS DE INVITADOS
-- ===========================================
INSERT INTO guest_access (owner_id, guest_id, guest_type, access_to, expires_at, state, created_at, invitation_code_id, guest_preferences) VALUES
-- Carlos accede a datos de Ana López
(3, 4, 'partner', '["cycle_tracking", "symptoms", "mood_data"]', '2024-07-16 12:00:00', true, '2024-01-17 09:15:00', 3, '{"show_pain_levels": true, "hide_intimate_details": false}'),

-- Acceso pendiente para María
(2, null, 'partner', '["cycle_tracking", "mood_data"]', '2024-02-15 15:00:00', true, '2024-01-15 15:00:00', 1, '{"show_pain_levels": false, "hide_intimate_details": true}'),

-- Acceso de monitoreo parental para Sofía
(5, 6, 'parent', '["basic_cycle", "emergency_alerts"]', '2024-07-18 16:00:00', true, '2024-01-18 17:00:00', 5, '{"emergency_only": true, "hide_details": true}');

-- ===========================================
-- 15. NOTIFICACIONES
-- ===========================================
INSERT INTO notification (user_id, related_condition_id, guest_access_id, title, message, type, priority, context, read, read_at, scheduled_for, created_at, target_user_type, related_entity_type, related_entity_id, action_url, action_text, metadata, dismissed) VALUES
-- Notificaciones de seguimiento del ciclo
(2, 1, null, 'Fase Lútea Iniciada', 'Has entrado en la fase lútea de tu ciclo. Es normal experimentar algunos síntomas premenstruales.', 'cycle_phase', 'low', 'cycle_tracking', true, '2024-01-20 14:30:00', null, '2024-01-20 14:00:00', 'user', 'cycle', 1, null, null, '{"phase": "luteal", "day": 15}', false),

(3, 5, null, 'Recordatorio Médico', 'Es momento de tu consulta de seguimiento para endometriosis. ¿Has notado cambios en tus síntomas?', 'medical_reminder', 'high', 'health_condition', false, null, '2024-01-25 09:00:00', '2024-01-24 18:00:00', 'user', 'condition', 5, '/appointments', 'Agendar Cita', '{"appointment_type": "follow_up"}', false),

-- Notificaciones de invitaciones
(4, null, 1, 'Acceso Compartido Activado', 'Ana te ha dado acceso a su información de seguimiento menstrual.', 'access_granted', 'medium', 'sharing', true, '2024-01-17 10:00:00', null, '2024-01-17 09:30:00', 'partner', 'guest_access', 1, '/shared-calendar', 'Ver Calendario', '{"owner_name": "Ana López"}', false),

-- Notificaciones de salud
(6, 7, null, 'Seguimiento de Síntomas', 'Registra cómo te sientes hoy para un mejor seguimiento de tu condición.', 'symptom_reminder', 'medium', 'health_tracking', false, null, '2024-01-26 20:00:00', '2024-01-25 20:00:00', 'user', 'condition', 7, '/symptoms/log', 'Registrar', '{"reminder_type": "daily"}', false),

(8, 10, null, 'Terapia Hormonal - Recordatorio', 'No olvides tomar tu medicación hormonal de hoy.', 'medication_reminder', 'high', 'treatment', false, null, '2024-01-26 08:00:00', '2024-01-25 20:00:00', 'user', 'treatment', 1, null, null, '{"medication": "hormone_therapy"}', false),

-- Notificaciones de contenido educativo
(10, null, null, 'Nuevo Contenido Disponible', 'Hemos agregado nueva información sobre nutrición durante el ciclo menstrual.', 'educational_content', 'low', 'learning', false, null, null, '2024-01-25 12:00:00', 'user', 'content', 5, '/content/nutrition', 'Leer Más', '{"content_type": "nutritional"}', false),

(11, 6, null, 'Recomendación Personalizada', 'Basado en tu SOP, te sugerimos revisar estos ejercicios específicos.', 'personalized_tip', 'medium', 'recommendations', false, null, null, '2024-01-25 16:00:00', 'user', 'content', 6, '/content/exercise', 'Ver Ejercicios', '{"condition": "PCOS", "type": "exercise"}', false),

-- Notificación de emergencia
(5, null, 3, 'Alerta de Monitoreo', 'Sofía ha reportado síntomas inusuales que requieren atención.', 'emergency_alert', 'urgent', 'parental_monitoring', false, null, null, '2024-01-24 22:30:00', 'parent', 'symptom', 1, '/emergency/details', 'Ver Detalles', '{"alert_type": "unusual_symptoms"}', false),

-- Notificaciones del sistema
(7, null, null, 'Bienvenida al Seguimiento de Embarazo', 'Configura tus preferencias para recibir información personalizada sobre tu embarazo.', 'system_welcome', 'medium', 'onboarding', true, '2024-01-20 13:00:00', null, '2024-01-20 12:35:00', 'user', 'onboarding', 7, '/pregnancy/setup', 'Configurar', '{"user_type": "pregnancy"}', false),

(2, null, null, 'Recordatorio de Registro Diario', 'No olvides registrar cómo te sientes hoy para un mejor seguimiento.', 'daily_reminder', 'low', 'habit_building', false, null, '2024-01-26 19:00:00', '2024-01-25 19:00:00', 'user', 'daily_log', null, '/daily/log', 'Registrar Día', '{"reminder_frequency": "daily"}', false);

-- ===========================================
-- 16. CONSULTAS DE IA
-- ===========================================
INSERT INTO aiquery (user_id, query, response, created_at, metadata) VALUES
-- Consultas realizadas por diferentes usuarios
(2, '¿Por qué tengo tantos cambios de humor antes de mi período?', 'Los cambios de humor premenstruales son causados principalmente por las fluctuaciones hormonales, especialmente la disminución de estrógenos y progesterona. Esto puede afectar los neurotransmisores como la serotonina. Recomiendo ejercicio regular, alimentación balanceada y técnicas de relajación.', '2024-01-22 16:30:00', '{"mood_score": 3, "cycle_day": 25, "phase": "luteal"}'),

(3, 'Mi dolor menstrual es muy intenso, ¿qué puedo hacer además de medicamentos?', 'Para el dolor menstrual intenso por endometriosis, además de medicación, puedes probar: aplicar calor local, yoga específico para dolor pélvico, alimentación antiinflamatoria, suplementos de magnesio, y técnicas de mindfulness. Es importante mantener seguimiento médico regular.', '2024-01-23 14:15:00', '{"pain_level": 8, "condition": "endometriosis", "cycle_day": 2}'),

(6, '¿Los miomas pueden afectar mi fertilidad?', 'Los miomas pueden afectar la fertilidad dependiendo de su ubicación, tamaño y número. Los miomas submucosos tienen mayor impacto en la fertilidad que los intramurales o subserosos. Es recomendable evaluación con especialista en fertilidad para determinar si requieren tratamiento antes de intentar concebir.', '2024-01-21 11:45:00', '{"condition": "uterine_fibroids", "concern": "fertility", "age": 45}'),

(8, '¿La terapia hormonal es segura a largo plazo?', 'La terapia hormonal para menopausia tiene beneficios y riesgos que deben evaluarse individualmente. Los beneficios incluyen alivio de síntomas y protección ósea. Los riesgos pueden incluir mayor riesgo de coágulos o cáncer de mama. Es importante evaluación médica regular y usar la dosis mínima efectiva.', '2024-01-24 09:20:00', '{"age": 58, "treatment": "hormone_therapy", "duration": "3_months"}'),

(10, '¿Los anticonceptivos pueden causar depresión?', 'Algunos anticonceptivos hormonales pueden afectar el estado de ánimo en ciertas personas sensibles. Los síntomas pueden incluir cambios de humor, ansiedad o depresión. Si experimentas estos síntomas, es importante hablarlo con tu médico para evaluar alternativas o ajustes en tu método anticonceptivo.', '2024-01-25 18:00:00', '{"contraceptive_type": "hormonal", "mood_changes": true, "duration": "6_months"}'),

(11, 'Tengo SOP, ¿qué dieta me recomiendas?', 'Para SOP recomiendo dieta antiinflamatoria con bajo índice glucémico: prioriza proteínas magras, vegetales, grasas saludables (omega-3), y carbohidratos complejos. Evita azúcares refinados y alimentos procesados. El ejercicio regular también es crucial para mejorar la resistencia a la insulina.', '2024-01-26 12:10:00', '{"condition": "PCOS", "bmi": 26, "insulin_resistance": true}'),

(5, '¿Es normal tener períodos irregulares a mi edad?', 'A los 15-16 años es completamente normal tener períodos irregulares. Tu sistema hormonal aún se está desarrollando y puede tomar 1-2 años después de la primera menstruación para establecer un patrón regular. Sin embargo, si hay dolor severo o ausencia prolongada, es recomendable consulta médica.', '2024-01-19 20:30:00', '{"age": 16, "menarche_age": 14, "irregularity_duration": "18_months"}'),

(7, '¿Qué ejercicios puedo hacer durante el embarazo?', 'Durante el embarazo (16 semanas) puedes realizar ejercicios de bajo impacto como: caminata, natación, yoga prenatal, ejercicios de Kegel, y ejercicios de fortalecimiento suave. Evita deportes de contacto, ejercicios boca arriba después del primer trimestre, y actividades con riesgo de caídas. Siempre consulta con tu médico antes de iniciar rutinas.', '2024-01-21 15:45:00', '{"pregnancy_week": 16, "fitness_level": "moderate", "complications": "none"}'),

(9, 'Como pareja, ¿cómo puedo apoyar mejor durante el período?', 'Como pareja puedes: ser comprensivo con los cambios de humor, ofrecer ayuda práctica (calor, medicamentos), respetar su necesidad de espacio o cercanía, educarte sobre el ciclo menstrual, mantener comunicación abierta sobre sus necesidades, y no minimizar su dolor o molestias.', '2024-01-22 19:15:00', '{"relationship_role": "partner", "support_type": "emotional_practical", "education_level": "basic"}'),

(4, '¿Cómo puedo entender mejor el calendario menstrual compartido?', 'El calendario compartido te muestra las fases del ciclo de tu pareja: menstrual (período), folicular (después del período), ovulación (más fértil), y lútea (antes del período). Cada fase tiene características específicas de energía, humor y síntomas. Esto te ayuda a ser más empático y comprensivo con sus cambios naturales.', '2024-01-18 13:30:00', '{"access_type": "partner", "shared_data": ["cycle_phases", "mood"], "education_needed": true}');

-- ===========================================
-- 17. RELACIONES CONSULTA-CONDICIÓN
-- ===========================================
INSERT INTO aiquery_condition (aiquery_id, condition_id) VALUES
-- Relacionar consultas con condiciones específicas
(1, 1), -- Consulta de cambios de humor con SPM
(2, 5), (2, 2), -- Consulta de dolor con endometriosis y dismenorrea
(3, 7), -- Consulta de fertilidad con miomas
(4, 10), -- Consulta de terapia hormonal con menopausia precoz
(6, 6), -- Consulta de dieta con SOP
(8, 5); -- Consulta de ejercicio con endometriosis (usuario embarazada que tenía endometriosis previa)

-- ===========================================
-- 18. TOKENS DE RECUPERACIÓN DE CONTRASEÑA
-- ===========================================
INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at, used) VALUES
-- Tokens de ejemplo (algunos usados, otros activos)
(2, 'reset_token_maria_2024_01_20_a1b2c3d4e5f6', '2024-01-21 15:30:00', '2024-01-20 15:30:00', true),
(5, 'reset_token_sofia_2024_01_23_x9y8z7w6v5u4', '2024-01-24 18:45:00', '2024-01-23 18:45:00', false),
(10, 'reset_token_natalia_2024_01_25_m3n4o5p6q7r8', '2024-01-26 12:15:00', '2024-01-25 12:15:00', false);

-- ===========================================
-- RESUMEN DE REGISTROS INSERTADOS:
-- ===========================================
-- Users: 10 adicionales (admin ya existía)
-- Conditions: 12 condiciones médicas
-- Content: 10 artículos educativos  
-- Content-Condition relations: 7 relaciones
-- Onboarding: 10 procesos de onboarding
-- User-Condition relations: 10 diagnósticos
-- Menstrual Cycles: 6 ciclos
-- Cycle Days: 7 días detallados
-- Symptom Logs: 12 registros de síntomas
-- Hormone Levels: 12 mediciones hormonales  
-- Pregnancy Log: 1 registro de embarazo
-- Menopause Log: 1 registro de menopausia
-- Invitation Codes: 5 códigos
-- Guest Access: 3 accesos compartidos
-- Notifications: 10 notificaciones
-- AI Queries: 10 consultas a IA
-- AI Query-Condition relations: 6 relaciones
-- Password Reset Tokens: 3 tokens
-- ===========================================