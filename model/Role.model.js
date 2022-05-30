const Roles = (sequelize, type) => {
  return sequelize.define("roles", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: type.STRING(50),
      allowNull: false,
    },
    role_description: {
      type: type.STRING(255),
      allowNull: true,
    },
  }, { timestamps: false });
};
module.exports = Roles;
