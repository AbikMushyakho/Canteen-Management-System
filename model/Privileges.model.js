const Privileges = (sequelize, type) => {
  return sequelize.define("privileges", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    privilege_name: {
      type: type.STRING(255),
      required: true,
    },
  }, { timestamps: false });
};
module.exports = Privileges;
