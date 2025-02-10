import { getAppDataDir } from "#config/index";
import { Sequelize } from "@sequelize/core";
import { SqliteDialect } from '@sequelize/sqlite3';

// Ensure the directory is valid and exists
const storagePath = `${getAppDataDir()}/database.sqlite`;

export const InsideHeartz = new Sequelize({
    dialect: SqliteDialect,
    storage: "database.sqlite"
});
