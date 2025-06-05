--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aiquery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aiquery (
    id integer NOT NULL,
    user_id integer NOT NULL,
    query text NOT NULL,
    response text,
    created_at timestamp(0) without time zone NOT NULL,
    metadata json
);


ALTER TABLE public.aiquery OWNER TO postgres;

--
-- Name: aiquery_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aiquery_condition (
    aiquery_id integer NOT NULL,
    condition_id integer NOT NULL
);


ALTER TABLE public.aiquery_condition OWNER TO postgres;

--
-- Name: aiquery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aiquery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aiquery_id_seq OWNER TO postgres;

--
-- Name: aiquery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aiquery_id_seq OWNED BY public.aiquery.id;


--
-- Name: condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condition (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    is_chronic boolean NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    state boolean NOT NULL,
    category character varying(100),
    severity character varying(50)
);


ALTER TABLE public.condition OWNER TO postgres;

--
-- Name: condition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.condition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.condition_id_seq OWNER TO postgres;

--
-- Name: condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.condition_id_seq OWNED BY public.condition.id;


--
-- Name: content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    content text NOT NULL,
    type character varying(255) NOT NULL,
    target_phase character varying(255) DEFAULT NULL::character varying,
    tags json,
    image_url character varying(255) DEFAULT NULL::character varying,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    CONSTRAINT check_target_phase_enum CHECK (((target_phase IS NULL) OR ((target_phase)::text = ANY ((ARRAY['menstrual'::character varying, 'folicular'::character varying, 'ovulacion'::character varying, 'lutea'::character varying])::text[]))))
);


ALTER TABLE public.content OWNER TO postgres;

--
-- Name: content_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_condition (
    content_id integer NOT NULL,
    condition_id integer NOT NULL
);


ALTER TABLE public.content_condition OWNER TO postgres;

--
-- Name: content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_id_seq OWNER TO postgres;

--
-- Name: content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.content_id_seq OWNED BY public.content.id;


--
-- Name: cycle_day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycle_day (
    id integer NOT NULL,
    cycle_phase_id integer NOT NULL,
    cycle_id integer NOT NULL,
    phase character varying(50) NOT NULL,
    date date NOT NULL,
    day_number smallint NOT NULL,
    symptoms json,
    notes json,
    mood json,
    flow_intensity smallint,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.cycle_day OWNER TO postgres;

--
-- Name: cycle_day_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cycle_day_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cycle_day_id_seq OWNER TO postgres;

--
-- Name: cycle_day_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cycle_day_id_seq OWNED BY public.cycle_day.id;


--
-- Name: doctrine_migration_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctrine_migration_versions (
    version character varying(191) NOT NULL,
    executed_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    execution_time integer
);


ALTER TABLE public.doctrine_migration_versions OWNER TO postgres;

--
-- Name: guest_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guest_access (
    id integer NOT NULL,
    owner_id integer,
    guest_id integer NOT NULL,
    guest_type character varying(255) NOT NULL,
    access_to json NOT NULL,
    expires_at timestamp(0) without time zone NOT NULL,
    state boolean NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    invitation_code_id integer,
    guest_preferences json
);


ALTER TABLE public.guest_access OWNER TO postgres;

--
-- Name: COLUMN guest_access.guest_preferences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.guest_access.guest_preferences IS 'Preferencias del invitado para filtrar información del anfitrión en calendario compartido';


--
-- Name: guest_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guest_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_access_id_seq OWNER TO postgres;

--
-- Name: guest_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guest_access_id_seq OWNED BY public.guest_access.id;


--
-- Name: hormone_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hormone_level (
    id integer NOT NULL,
    user_id integer NOT NULL,
    cycle_day_id integer,
    hormone_type character varying(255) NOT NULL,
    level double precision NOT NULL,
    state boolean NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.hormone_level OWNER TO postgres;

--
-- Name: hormone_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hormone_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hormone_level_id_seq OWNER TO postgres;

--
-- Name: hormone_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hormone_level_id_seq OWNED BY public.hormone_level.id;


--
-- Name: invitation_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitation_code (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    creator_id integer NOT NULL,
    guest_type character varying(50) NOT NULL,
    access_permissions json NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    expires_at timestamp(0) without time zone NOT NULL,
    status character varying(20) NOT NULL,
    redeemed_by_id integer,
    redeemed_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.invitation_code OWNER TO postgres;

--
-- Name: COLUMN invitation_code.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.invitation_code.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: invitation_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitation_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitation_code_id_seq OWNER TO postgres;

--
-- Name: invitation_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitation_code_id_seq OWNED BY public.invitation_code.id;


--
-- Name: menopause_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menopause_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    hot_flashes boolean,
    mood_swings boolean,
    vaginal_dryness boolean,
    insomnia boolean,
    hormone_therapy boolean,
    notes text,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.menopause_log OWNER TO postgres;

--
-- Name: menopause_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menopause_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menopause_log_id_seq OWNER TO postgres;

--
-- Name: menopause_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menopause_log_id_seq OWNED BY public.menopause_log.id;


--
-- Name: menstrual_cycle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menstrual_cycle (
    id integer NOT NULL,
    user_id integer NOT NULL,
    phase character varying(255) DEFAULT NULL::character varying,
    cycle_id character varying(36) DEFAULT NULL::character varying,
    start_date date NOT NULL,
    end_date date NOT NULL,
    estimated_next_start date NOT NULL,
    average_cycle_length integer NOT NULL,
    average_duration integer NOT NULL,
    flow_amount character varying(50) DEFAULT NULL::character varying,
    flow_color character varying(50) DEFAULT NULL::character varying,
    flow_odor character varying(50) DEFAULT NULL::character varying,
    pain_level integer,
    notes character varying(255) DEFAULT NULL::character varying,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.menstrual_cycle OWNER TO postgres;

--
-- Name: menstrual_cycle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menstrual_cycle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menstrual_cycle_id_seq OWNER TO postgres;

--
-- Name: menstrual_cycle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menstrual_cycle_id_seq OWNED BY public.menstrual_cycle.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    user_id integer NOT NULL,
    related_condition_id integer,
    guest_access_id integer,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) NOT NULL,
    priority character varying(20) NOT NULL,
    context character varying(50) DEFAULT NULL::character varying,
    read boolean NOT NULL,
    read_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    scheduled_for timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    created_at timestamp(0) without time zone NOT NULL,
    target_user_type character varying(30) DEFAULT NULL::character varying,
    related_entity_type character varying(100) DEFAULT NULL::character varying,
    related_entity_id integer,
    action_url character varying(255) DEFAULT NULL::character varying,
    action_text character varying(50) DEFAULT NULL::character varying,
    metadata json,
    dismissed boolean NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: onboarding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.onboarding (
    id integer NOT NULL,
    user_id integer NOT NULL,
    profile_type character varying(255) NOT NULL,
    gender_identity character varying(255) NOT NULL,
    pronouns character varying(100) DEFAULT NULL::character varying,
    is_personal boolean NOT NULL,
    stage_of_life character varying(50) NOT NULL,
    last_period_date date,
    average_cycle_length integer,
    average_period_length integer,
    hormone_type character varying(255) DEFAULT NULL::character varying,
    hormone_start_date date,
    hormone_frequency_days integer,
    receive_alerts boolean NOT NULL,
    receive_recommendations boolean NOT NULL,
    receive_cycle_phase_tips boolean NOT NULL,
    receive_workout_suggestions boolean NOT NULL,
    receive_nutrition_advice boolean NOT NULL,
    share_cycle_with_partner boolean NOT NULL,
    want_ai_companion boolean NOT NULL,
    health_concerns json NOT NULL,
    access_code character varying(20) DEFAULT NULL::character varying,
    allow_parental_monitoring boolean NOT NULL,
    common_symptoms json NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    completed boolean NOT NULL
);


ALTER TABLE public.onboarding OWNER TO postgres;

--
-- Name: onboarding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.onboarding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.onboarding_id_seq OWNER TO postgres;

--
-- Name: onboarding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.onboarding_id_seq OWNED BY public.onboarding.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: COLUMN password_reset_tokens.expires_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.expires_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN password_reset_tokens.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.password_reset_tokens.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: pregnancy_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pregnancy_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    start_date date NOT NULL,
    due_date date NOT NULL,
    week integer,
    symptoms text,
    fetal_movements text,
    ultrasound_date date,
    notes character varying(255) DEFAULT NULL::character varying,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.pregnancy_log OWNER TO postgres;

--
-- Name: pregnancy_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pregnancy_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pregnancy_log_id_seq OWNER TO postgres;

--
-- Name: pregnancy_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pregnancy_log_id_seq OWNED BY public.pregnancy_log.id;


--
-- Name: symptom_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.symptom_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    symptom character varying(255) NOT NULL,
    intensity integer NOT NULL,
    notes text,
    state boolean NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    entity character varying(50) NOT NULL
);


ALTER TABLE public.symptom_log OWNER TO postgres;

--
-- Name: symptom_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.symptom_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.symptom_log_id_seq OWNER TO postgres;

--
-- Name: symptom_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.symptom_log_id_seq OWNED BY public.symptom_log.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying(180) NOT NULL,
    roles json NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    profile_type character varying(255) NOT NULL,
    birth_date date NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    state boolean NOT NULL,
    onboarding_completed boolean DEFAULT false NOT NULL,
    avatar jsonb,
    CONSTRAINT check_avatar_structure CHECK (((avatar IS NULL) OR (((avatar)::text ~~ '%"skinColor"%'::text) AND ((avatar)::text ~~ '%"eyes"%'::text) AND ((avatar)::text ~~ '%"eyebrows"%'::text) AND ((avatar)::text ~~ '%"mouth"%'::text) AND ((avatar)::text ~~ '%"hairStyle"%'::text) AND ((avatar)::text ~~ '%"hairColor"%'::text) AND ((avatar)::text ~~ '%"facialHair"%'::text) AND ((avatar)::text ~~ '%"clothes"%'::text) AND ((avatar)::text ~~ '%"fabricColor"%'::text) AND ((avatar)::text ~~ '%"glasses"%'::text) AND ((avatar)::text ~~ '%"glassOpacity"%'::text) AND ((avatar)::text ~~ '%"accessories"%'::text) AND ((avatar)::text ~~ '%"tattoos"%'::text) AND ((avatar)::text ~~ '%"backgroundColor"%'::text))))
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_condition (
    id integer NOT NULL,
    user_id integer NOT NULL,
    condition_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    notes character varying(255) DEFAULT NULL::character varying,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    state boolean NOT NULL
);


ALTER TABLE public.user_condition OWNER TO postgres;

--
-- Name: user_condition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_condition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_condition_id_seq OWNER TO postgres;

--
-- Name: user_condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_condition_id_seq OWNED BY public.user_condition.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: aiquery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery ALTER COLUMN id SET DEFAULT nextval('public.aiquery_id_seq'::regclass);


--
-- Name: condition id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition ALTER COLUMN id SET DEFAULT nextval('public.condition_id_seq'::regclass);


--
-- Name: content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content ALTER COLUMN id SET DEFAULT nextval('public.content_id_seq'::regclass);


--
-- Name: cycle_day id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_day ALTER COLUMN id SET DEFAULT nextval('public.cycle_day_id_seq'::regclass);


--
-- Name: guest_access id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_access ALTER COLUMN id SET DEFAULT nextval('public.guest_access_id_seq'::regclass);


--
-- Name: hormone_level id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hormone_level ALTER COLUMN id SET DEFAULT nextval('public.hormone_level_id_seq'::regclass);


--
-- Name: invitation_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitation_code ALTER COLUMN id SET DEFAULT nextval('public.invitation_code_id_seq'::regclass);


--
-- Name: menopause_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menopause_log ALTER COLUMN id SET DEFAULT nextval('public.menopause_log_id_seq'::regclass);


--
-- Name: menstrual_cycle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menstrual_cycle ALTER COLUMN id SET DEFAULT nextval('public.menstrual_cycle_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: onboarding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding ALTER COLUMN id SET DEFAULT nextval('public.onboarding_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: pregnancy_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pregnancy_log ALTER COLUMN id SET DEFAULT nextval('public.pregnancy_log_id_seq'::regclass);


--
-- Name: symptom_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.symptom_log ALTER COLUMN id SET DEFAULT nextval('public.symptom_log_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_condition id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_condition ALTER COLUMN id SET DEFAULT nextval('public.user_condition_id_seq'::regclass);


--
-- Name: aiquery_condition aiquery_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery_condition
    ADD CONSTRAINT aiquery_condition_pkey PRIMARY KEY (aiquery_id, condition_id);


--
-- Name: aiquery aiquery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery
    ADD CONSTRAINT aiquery_pkey PRIMARY KEY (id);


--
-- Name: condition condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY (id);


--
-- Name: content_condition content_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_condition
    ADD CONSTRAINT content_condition_pkey PRIMARY KEY (content_id, condition_id);


--
-- Name: content content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT content_pkey PRIMARY KEY (id);


--
-- Name: cycle_day cycle_day_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_day
    ADD CONSTRAINT cycle_day_pkey PRIMARY KEY (id);


--
-- Name: doctrine_migration_versions doctrine_migration_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctrine_migration_versions
    ADD CONSTRAINT doctrine_migration_versions_pkey PRIMARY KEY (version);


--
-- Name: guest_access guest_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_access
    ADD CONSTRAINT guest_access_pkey PRIMARY KEY (id);


--
-- Name: hormone_level hormone_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hormone_level
    ADD CONSTRAINT hormone_level_pkey PRIMARY KEY (id);


--
-- Name: invitation_code invitation_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitation_code
    ADD CONSTRAINT invitation_code_pkey PRIMARY KEY (id);


--
-- Name: menopause_log menopause_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menopause_log
    ADD CONSTRAINT menopause_log_pkey PRIMARY KEY (id);


--
-- Name: menstrual_cycle menstrual_cycle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menstrual_cycle
    ADD CONSTRAINT menstrual_cycle_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: onboarding onboarding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT onboarding_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- Name: pregnancy_log pregnancy_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pregnancy_log
    ADD CONSTRAINT pregnancy_log_pkey PRIMARY KEY (id);


--
-- Name: symptom_log symptom_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.symptom_log
    ADD CONSTRAINT symptom_log_pkey PRIMARY KEY (id);


--
-- Name: invitation_code uniq_ba14fccc77153098; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitation_code
    ADD CONSTRAINT uniq_ba14fccc77153098 UNIQUE (code);


--
-- Name: user_condition user_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_condition
    ADD CONSTRAINT user_condition_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: idx_1b04b8f0a76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_1b04b8f0a76ed395 ON public.menstrual_cycle USING btree (user_id);


--
-- Name: idx_1ca601be5c27d062; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_1ca601be5c27d062 ON public.guest_access USING btree (invitation_code_id);


--
-- Name: idx_1ca601be7e3c61f9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_1ca601be7e3c61f9 ON public.guest_access USING btree (owner_id);


--
-- Name: idx_1ca601be9a4aa658; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_1ca601be9a4aa658 ON public.guest_access USING btree (guest_id);


--
-- Name: idx_2dcdad667f6a902c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_2dcdad667f6a902c ON public.cycle_day USING btree (cycle_phase_id);


--
-- Name: idx_45ff69bd887793b6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_45ff69bd887793b6 ON public.aiquery_condition USING btree (condition_id);


--
-- Name: idx_45ff69bda7d98037; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_45ff69bda7d98037 ON public.aiquery_condition USING btree (aiquery_id);


--
-- Name: idx_64508847a76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_64508847a76ed395 ON public.symptom_log USING btree (user_id);


--
-- Name: idx_7dc9844ba76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_7dc9844ba76ed395 ON public.aiquery USING btree (user_id);


--
-- Name: idx_8d31c04084a0a3ed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_8d31c04084a0a3ed ON public.content_condition USING btree (content_id);


--
-- Name: idx_8d31c040887793b6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_8d31c040887793b6 ON public.content_condition USING btree (condition_id);


--
-- Name: idx_a5929cdca76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_a5929cdca76ed395 ON public.pregnancy_log USING btree (user_id);


--
-- Name: idx_ba14fccc2fbc08ba; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ba14fccc2fbc08ba ON public.invitation_code USING btree (redeemed_by_id);


--
-- Name: idx_ba14fccc61220ea6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ba14fccc61220ea6 ON public.invitation_code USING btree (creator_id);


--
-- Name: idx_bd30c6a8a76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bd30c6a8a76ed395 ON public.hormone_level USING btree (user_id);


--
-- Name: idx_bd30c6a8d4670e26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bd30c6a8d4670e26 ON public.hormone_level USING btree (cycle_day_id);


--
-- Name: idx_bd3605a7887793b6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bd3605a7887793b6 ON public.user_condition USING btree (condition_id);


--
-- Name: idx_bd3605a7a76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bd3605a7a76ed395 ON public.user_condition USING btree (user_id);


--
-- Name: idx_bf5476ca62693ff1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bf5476ca62693ff1 ON public.notification USING btree (related_condition_id);


--
-- Name: idx_bf5476ca8f2f21aa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bf5476ca8f2f21aa ON public.notification USING btree (guest_access_id);


--
-- Name: idx_bf5476caa76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bf5476caa76ed395 ON public.notification USING btree (user_id);


--
-- Name: idx_condition_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_condition_category ON public.condition USING btree (category);


--
-- Name: idx_condition_severity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_condition_severity ON public.condition USING btree (severity);


--
-- Name: idx_condition_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_condition_state ON public.condition USING btree (state);


--
-- Name: idx_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expires_at ON public.password_reset_tokens USING btree (expires_at);


--
-- Name: idx_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_token ON public.password_reset_tokens USING btree (token);


--
-- Name: uniq_23a7bb0ea76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_23a7bb0ea76ed395 ON public.onboarding USING btree (user_id);


--
-- Name: uniq_b9d2b074a76ed395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_b9d2b074a76ed395 ON public.menopause_log USING btree (user_id);


--
-- Name: uniq_identifier_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_identifier_email ON public."user" USING btree (email);


--
-- Name: menstrual_cycle fk_1b04b8f0a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menstrual_cycle
    ADD CONSTRAINT fk_1b04b8f0a76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: guest_access fk_1ca601be5c27d062; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_access
    ADD CONSTRAINT fk_1ca601be5c27d062 FOREIGN KEY (invitation_code_id) REFERENCES public.invitation_code(id);


--
-- Name: guest_access fk_1ca601be7e3c61f9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_access
    ADD CONSTRAINT fk_1ca601be7e3c61f9 FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- Name: guest_access fk_1ca601be9a4aa658; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_access
    ADD CONSTRAINT fk_1ca601be9a4aa658 FOREIGN KEY (guest_id) REFERENCES public."user"(id);


--
-- Name: onboarding fk_23a7bb0ea76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding
    ADD CONSTRAINT fk_23a7bb0ea76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: cycle_day fk_2dcdad667f6a902c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_day
    ADD CONSTRAINT fk_2dcdad667f6a902c FOREIGN KEY (cycle_phase_id) REFERENCES public.menstrual_cycle(id);


--
-- Name: aiquery_condition fk_45ff69bd887793b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery_condition
    ADD CONSTRAINT fk_45ff69bd887793b6 FOREIGN KEY (condition_id) REFERENCES public.condition(id) ON DELETE CASCADE;


--
-- Name: aiquery_condition fk_45ff69bda7d98037; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery_condition
    ADD CONSTRAINT fk_45ff69bda7d98037 FOREIGN KEY (aiquery_id) REFERENCES public.aiquery(id) ON DELETE CASCADE;


--
-- Name: symptom_log fk_64508847a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.symptom_log
    ADD CONSTRAINT fk_64508847a76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: aiquery fk_7dc9844ba76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aiquery
    ADD CONSTRAINT fk_7dc9844ba76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: content_condition fk_8d31c04084a0a3ed; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_condition
    ADD CONSTRAINT fk_8d31c04084a0a3ed FOREIGN KEY (content_id) REFERENCES public.content(id) ON DELETE CASCADE;


--
-- Name: content_condition fk_8d31c040887793b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_condition
    ADD CONSTRAINT fk_8d31c040887793b6 FOREIGN KEY (condition_id) REFERENCES public.condition(id) ON DELETE CASCADE;


--
-- Name: pregnancy_log fk_a5929cdca76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pregnancy_log
    ADD CONSTRAINT fk_a5929cdca76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: menopause_log fk_b9d2b074a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menopause_log
    ADD CONSTRAINT fk_b9d2b074a76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: invitation_code fk_ba14fccc2fbc08ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitation_code
    ADD CONSTRAINT fk_ba14fccc2fbc08ba FOREIGN KEY (redeemed_by_id) REFERENCES public."user"(id);


--
-- Name: hormone_level fk_bd30c6a8a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hormone_level
    ADD CONSTRAINT fk_bd30c6a8a76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: hormone_level fk_bd30c6a8d4670e26; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hormone_level
    ADD CONSTRAINT fk_bd30c6a8d4670e26 FOREIGN KEY (cycle_day_id) REFERENCES public.cycle_day(id);


--
-- Name: user_condition fk_bd3605a7887793b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_condition
    ADD CONSTRAINT fk_bd3605a7887793b6 FOREIGN KEY (condition_id) REFERENCES public.condition(id);


--
-- Name: user_condition fk_bd3605a7a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_condition
    ADD CONSTRAINT fk_bd3605a7a76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: notification fk_bf5476ca62693ff1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk_bf5476ca62693ff1 FOREIGN KEY (related_condition_id) REFERENCES public.condition(id);


--
-- Name: notification fk_bf5476ca8f2f21aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk_bf5476ca8f2f21aa FOREIGN KEY (guest_access_id) REFERENCES public.guest_access(id);


--
-- Name: notification fk_bf5476caa76ed395; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk_bf5476caa76ed395 FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: invitation_code fk_invitation_code_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitation_code
    ADD CONSTRAINT fk_invitation_code_creator FOREIGN KEY (creator_id) REFERENCES public."user"(id);


--
-- Name: password_reset_tokens fk_password_reset_tokens_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT fk_password_reset_tokens_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

