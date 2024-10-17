-- CREATE TABLE accounts (
--   id SERIAL PRIMARY KEY,
--   firstname VARCHAR(50) NOT NULL,
--   lastname VARCHAR(50) NOT NULL,
--   email VARCHAR(100) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Table: public.accounts

-- Drop the table if it exists
DROP TABLE IF EXISTS public.accounts;

-- Create the accounts table
CREATE TABLE public.accounts (
    id SERIAL PRIMARY KEY,  -- Automatically increments
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Set the owner of the table
ALTER TABLE public.accounts
    OWNER TO postgres;
