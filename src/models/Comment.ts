import { InsideHeartz } from '#database/init';
import { DataTypes } from '@sequelize/core';

export const CommentDB = InsideHeartz.define(
    'comment',
    {
        username: DataTypes.STRING,
        video_url: DataTypes.STRING,
        comment_status: DataTypes.STRING,
        comment: DataTypes.STRING
    },
    {
        tableName: 'comment',
        freezeTableName: true
    }
);
