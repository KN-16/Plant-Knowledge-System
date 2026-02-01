// models/Account.js

import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import generateCustomId from "../utils/idGenerator.js";

const Account = sequelize.define(
  "Account",
  {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING(100),
    },

    phone_number: {
      type: DataTypes.STRING(20),
    },

    address: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.ENUM("user", "admin"), // User chỉ là người dùng thêm dữ liệu, không có quyền quản trị bảng Account
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "locked"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["username"] },
      { unique: true, fields: ["email"] },
    ],
  }
);

/* =========================
   HOOKS – HASH PASSWORD
========================= */

Account.beforeValidate(async (account, options) => {
  // Chỉ tạo code nếu chưa có (để tránh ghi đè khi update hoặc nếu đã truyền tay)
  if (!account.code) {
    let transaction = options.transaction || null;
    account.code = await generateCustomId('Account', 'ACC', transaction);
  }
});
Account.beforeCreate(async (account) => {
  if (account.password_hash) {
    account.password_hash = await bcrypt.hash(account.password_hash, 10);
  }
});

Account.beforeUpdate(async (account) => {
  if (account.changed("password_hash")) {
    account.password_hash = await bcrypt.hash(account.password_hash, 10);
  }
});

/* =========================
   INSTANCE METHODS
========================= */
Account.prototype.checkPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password_hash);
};

export default Account;