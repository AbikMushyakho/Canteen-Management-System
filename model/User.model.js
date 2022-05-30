const User = (sequelize, type) => {
  return sequelize.define("users",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: type.STRING(100),
        allowNull: false,
      },
      gender: {
        type: type.STRING(20),
        allowNull: false
      },
      email: {
        type: type.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: type.STRING(255),
        allowNull: false,
      },
      phone_no: {
        type: type.STRING(16),
        allowNull: false,
      },
      address: {
        type: type.STRING(255),
        allowNull: false,
      },
      verified: {
        type: type.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    { timestamps: false });
};
module.exports = User;
