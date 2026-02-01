// // models/Counter.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Counter = sequelize.define('Counter', {
    model_name: { 
        type: DataTypes.STRING, 
        primaryKey: true, 
        allowNull: false 
    },
    seq: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    }
}, { timestamps: false, tableName: 'counters' });

export default Counter;