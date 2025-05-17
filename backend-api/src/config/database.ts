import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.DB_NAME || 'your_database_name';
const username = process.env.DB_USER || 'your_database_user';
const password = process.env.DB_PASS || 'your_database_password';
const host = process.env.DB_HOST || 'localhost';
const dialect = process.env.DB_DIALECT || 'postgres';

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
});

export default sequelize;