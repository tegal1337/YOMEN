import { InsideHeartz } from '#database/init';
import { DataTypes } from '@sequelize/core';

export const SessionDB = InsideHeartz.define(
    'session',
    {
        username: DataTypes.STRING,
        sessionDir: DataTypes.STRING,
        login_status: DataTypes.STRING,
    },
    { tableName: 'session',freezeTableName: true }
);