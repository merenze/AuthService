// models/emailValidation.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnector");
const User = require("./user");

class EmailValidation extends Model {
  isValidated() {
    return this.validatedAt !== null;
  }
}

EmailValidation.init(
  {
    // The token used to validate the email
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // The last time a validation link was sent
    lastSent: {
      type: DataTypes.DATE,
    },
    // The expiration for the last validation link
    validateBy: {
      type: DataTypes.DATE,
    },
    // Time the link was validated, if applicable
    validatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    // Using our own timestamps
    timestamps: false,
  }
);

EmailValidation.associate = (models) => {
  EmailValidation.belongsTo(models.User);
};

module.exports = EmailValidation;
