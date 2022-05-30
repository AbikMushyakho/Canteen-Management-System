const Module = (sequelize, type) => {
  return sequelize.define("module_models", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    module_name: {
      type: type.STRING(255),
      allowNull: false,
    },
  }, { timestamps: false });
};
module.exports = Module;
