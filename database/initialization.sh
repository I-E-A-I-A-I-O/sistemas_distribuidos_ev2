set -e

psql --username "$POSTGRES_USER" <<-EOSQL
CREATE DATABASE dist_sys_ev_2;
EOSQL
psql --dbname "dist_sys_ev_2" --username "$POSTGRES_USER" <<-EOSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA users;
CREATE SCHEMA dogs;
CREATE TABLE users.users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name VARCHAR[75] NOT NULL,
    user_email VARCHAR[75] UNIQUE,
    user_password VARCHAR[256] NOT NULL
);
CREATE TABLE dogs.dogs (
    dog_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dog_name VARCHAR[75] NOT NULL,
    dog_age INT NOT NULL,
    dog_breed VARCHAR[75] NOT NULL,
    dog_owner uuid,
    CONSTRAINT fk_owner FOREIGN KEY(dog_owner) REFERENCES users.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);
EOSQL