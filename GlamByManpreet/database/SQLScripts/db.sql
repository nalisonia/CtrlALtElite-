-- PostgreSQL database dump

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 16.4 (Postgres.app)

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

-- Drop the users table if it exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop the users_id_seq sequence if it exists
DROP SEQUENCE IF EXISTS public.users_id_seq;

-- Create the users table
CREATE TABLE public.users (
    id integer NOT NULL,
    firstnameandlastname character varying(100) NOT NULL,
    phonenumber character varying(15),
    emailaddress character varying(100) NOT NULL,
    eventtime time without time zone,
    eventtype character varying(50),
    eventname character varying(50),
    clientshairandmakeup integer,
    clientshaironly integer,
    clientsmakeuponly integer,
    locationaddress text,
    additionalnotes text,
    eventdate date
);

ALTER TABLE public.users OWNER TO postgres;

-- Create the sequence for id
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

-- Set the sequence ownership to the id column
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- Set default for id column
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

-- Add columns for notification preferences
ALTER TABLE public.users ADD COLUMN notify_via_sms boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN notify_via_email boolean DEFAULT true;


-- Data for the table users
COPY public.users (id, firstnameandlastname, phonenumber, emailaddress, eventtime, eventtype, eventname, clientshairandmakeup, clientshaironly, clientsmakeuponly, locationaddress, additionalnotes, eventdate) FROM stdin;
\.

-- Set sequence to 6 (if needed)
SELECT pg_catalog.setval('public.users_id_seq', 6, true);

-- Add unique constraint on emailaddress
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_emailaddress_key UNIQUE (emailaddress);

-- Add primary key constraint on id
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- PostgreSQL database dump complete
