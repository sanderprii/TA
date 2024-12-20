--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2024-12-18 22:05:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 232 (class 1259 OID 16826)
-- Name: affiliate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.affiliate (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    trainingtype character varying(255) NOT NULL,
    ownerid integer
);


--
-- TOC entry 231 (class 1259 OID 16825)
-- Name: affiliate_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.affiliate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 231
-- Name: affiliate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.affiliate_id_seq OWNED BY public.affiliate.id;


--
-- TOC entry 234 (class 1259 OID 16840)
-- Name: affiliatetrainer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.affiliatetrainer (
    id integer NOT NULL,
    affiliateid integer,
    trainerid integer
);


--
-- TOC entry 233 (class 1259 OID 16839)
-- Name: affiliatetrainer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.affiliatetrainer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 233
-- Name: affiliatetrainer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.affiliatetrainer_id_seq OWNED BY public.affiliatetrainer.id;


--
-- TOC entry 236 (class 1259 OID 16859)
-- Name: classattendee; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classattendee (
    id integer NOT NULL,
    classid integer,
    userid integer,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 235 (class 1259 OID 16858)
-- Name: classattendee_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classattendee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 235
-- Name: classattendee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classattendee_id_seq OWNED BY public.classattendee.id;


--
-- TOC entry 228 (class 1259 OID 16797)
-- Name: classschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classschedule (
    id integer NOT NULL,
    trainingname character varying(255) NOT NULL,
    "time" timestamp without time zone NOT NULL,
    trainer character varying(255),
    membercapacity integer NOT NULL,
    location character varying(255),
    repeatweekly boolean DEFAULT false,
    ownerid integer
);


--
-- TOC entry 227 (class 1259 OID 16796)
-- Name: classschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 227
-- Name: classschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classschedule_id_seq OWNED BY public.classschedule.id;


--
-- TOC entry 218 (class 1259 OID 16731)
-- Name: defaultwod; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defaultwod (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    description text NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16730)
-- Name: defaultwod_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.defaultwod_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 217
-- Name: defaultwod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.defaultwod_id_seq OWNED BY public.defaultwod.id;


--
-- TOC entry 224 (class 1259 OID 16769)
-- Name: exercise; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercise (
    id integer NOT NULL,
    exercisedata text NOT NULL,
    trainingid integer
);


--
-- TOC entry 223 (class 1259 OID 16768)
-- Name: exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 223
-- Name: exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exercise_id_seq OWNED BY public.exercise.id;


--
-- TOC entry 230 (class 1259 OID 16812)
-- Name: plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    validitydays integer NOT NULL,
    price double precision NOT NULL,
    additionaldata text,
    ownerid integer
);


--
-- TOC entry 229 (class 1259 OID 16811)
-- Name: plan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 229
-- Name: plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.plan_id_seq OWNED BY public.plan.id;


--
-- TOC entry 226 (class 1259 OID 16783)
-- Name: record; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.record (
    id integer NOT NULL,
    type character varying(255),
    name character varying(255),
    date date,
    score character varying(255),
    weight double precision,
    "time" character varying(50),
    userid integer
);


--
-- TOC entry 225 (class 1259 OID 16782)
-- Name: record_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 225
-- Name: record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.record_id_seq OWNED BY public.record.id;


--
-- TOC entry 222 (class 1259 OID 16755)
-- Name: training; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training (
    id integer NOT NULL,
    type character varying(255) NOT NULL,
    wodname character varying(255),
    wodtype character varying(50),
    date date,
    score character varying(255),
    userid integer
);


--
-- TOC entry 221 (class 1259 OID 16754)
-- Name: training_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 221
-- Name: training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.training_id_seq OWNED BY public.training.id;


--
-- TOC entry 220 (class 1259 OID 16742)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    fullname character varying(255),
    dateofbirth date,
    sex character varying(50),
    email character varying(255),
    isaffiliateowner boolean,
    monthlygoal integer
);


--
-- TOC entry 219 (class 1259 OID 16741)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4748 (class 2604 OID 16829)
-- Name: affiliate id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate ALTER COLUMN id SET DEFAULT nextval('public.affiliate_id_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 16843)
-- Name: affiliatetrainer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliatetrainer ALTER COLUMN id SET DEFAULT nextval('public.affiliatetrainer_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16862)
-- Name: classattendee id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classattendee ALTER COLUMN id SET DEFAULT nextval('public.classattendee_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16800)
-- Name: classschedule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classschedule ALTER COLUMN id SET DEFAULT nextval('public.classschedule_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 16734)
-- Name: defaultwod id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaultwod ALTER COLUMN id SET DEFAULT nextval('public.defaultwod_id_seq'::regclass);


--
-- TOC entry 4743 (class 2604 OID 16772)
-- Name: exercise id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise ALTER COLUMN id SET DEFAULT nextval('public.exercise_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16815)
-- Name: plan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan ALTER COLUMN id SET DEFAULT nextval('public.plan_id_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 16786)
-- Name: record id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.record ALTER COLUMN id SET DEFAULT nextval('public.record_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 16758)
-- Name: training id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training ALTER COLUMN id SET DEFAULT nextval('public.training_id_seq'::regclass);


--
-- TOC entry 4741 (class 2604 OID 16745)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4773 (class 2606 OID 16833)
-- Name: affiliate affiliate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate
    ADD CONSTRAINT affiliate_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 16847)
-- Name: affiliatetrainer affiliatetrainer_affiliateid_trainerid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliatetrainer
    ADD CONSTRAINT affiliatetrainer_affiliateid_trainerid_key UNIQUE (affiliateid, trainerid);


--
-- TOC entry 4777 (class 2606 OID 16845)
-- Name: affiliatetrainer affiliatetrainer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliatetrainer
    ADD CONSTRAINT affiliatetrainer_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16867)
-- Name: classattendee classattendee_classid_userid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classattendee
    ADD CONSTRAINT classattendee_classid_userid_key UNIQUE (classid, userid);


--
-- TOC entry 4781 (class 2606 OID 16865)
-- Name: classattendee classattendee_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classattendee
    ADD CONSTRAINT classattendee_pkey PRIMARY KEY (id);


--
-- TOC entry 4769 (class 2606 OID 16805)
-- Name: classschedule classschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classschedule
    ADD CONSTRAINT classschedule_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 16740)
-- Name: defaultwod defaultwod_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaultwod
    ADD CONSTRAINT defaultwod_name_key UNIQUE (name);


--
-- TOC entry 4755 (class 2606 OID 16738)
-- Name: defaultwod defaultwod_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defaultwod
    ADD CONSTRAINT defaultwod_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 16776)
-- Name: exercise exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise
    ADD CONSTRAINT exercise_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 16819)
-- Name: plan plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT plan_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 16790)
-- Name: record record_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT record_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 16762)
-- Name: training training_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_pkey PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 16753)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4759 (class 2606 OID 16749)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 16751)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4787 (class 2606 OID 16834)
-- Name: affiliate affiliate_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate
    ADD CONSTRAINT affiliate_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4788 (class 2606 OID 16848)
-- Name: affiliatetrainer affiliatetrainer_affiliateid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliatetrainer
    ADD CONSTRAINT affiliatetrainer_affiliateid_fkey FOREIGN KEY (affiliateid) REFERENCES public.affiliate(id) ON DELETE CASCADE;


--
-- TOC entry 4789 (class 2606 OID 16853)
-- Name: affiliatetrainer affiliatetrainer_trainerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliatetrainer
    ADD CONSTRAINT affiliatetrainer_trainerid_fkey FOREIGN KEY (trainerid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4790 (class 2606 OID 16868)
-- Name: classattendee classattendee_classid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classattendee
    ADD CONSTRAINT classattendee_classid_fkey FOREIGN KEY (classid) REFERENCES public.classschedule(id) ON DELETE CASCADE;


--
-- TOC entry 4791 (class 2606 OID 16873)
-- Name: classattendee classattendee_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classattendee
    ADD CONSTRAINT classattendee_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 16806)
-- Name: classschedule classschedule_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classschedule
    ADD CONSTRAINT classschedule_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 16777)
-- Name: exercise exercise_trainingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise
    ADD CONSTRAINT exercise_trainingid_fkey FOREIGN KEY (trainingid) REFERENCES public.training(id) ON DELETE CASCADE;


--
-- TOC entry 4786 (class 2606 OID 16820)
-- Name: plan plan_ownerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan
    ADD CONSTRAINT plan_ownerid_fkey FOREIGN KEY (ownerid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 16791)
-- Name: record record_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT record_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 16763)
-- Name: training training_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training
    ADD CONSTRAINT training_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-12-18 22:05:57

--
-- PostgreSQL database dump complete
--

