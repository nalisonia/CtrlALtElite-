--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Homebrew)
-- Dumped by pg_dump version 16.4 (Homebrew)

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
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    last_access timestamp without time zone DEFAULT now(),
    user_agent text
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (sid, sess, expire, last_access, user_agent) FROM stdin;
\.


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: idx_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expire ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

