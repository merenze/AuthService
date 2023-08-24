// models/emailValidation.js
const { Model, DataTypes } = require("sequelize");

class EmailValidation extends Model {
  isValidated() {
    return this.validatedAt !== null;
  }
}

module.exports = (sequelize) => {
  EmailValidation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "User",
        },
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

  return EmailValidation;
};
