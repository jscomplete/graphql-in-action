import dotenv from 'dotenv';

dotenv.config();

export const isDev = process.env.NODE_ENV !== 'production';

export const port = process.env.PORT;

export const pgConnectionString = process.env.PG_CONNECTION_STRING;

export const mdbConnectionString = process.env.MDB_CONNECTION_STRING;
