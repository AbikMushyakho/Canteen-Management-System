const Route = (sequelize, type) => {
  return sequelize.define("routes", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    endpoint: {
      type: type.STRING(255),
      required: true,
    },
    method: {
      type: type.STRING(255),
      required: true,
    },
  }, { timestamps: false });
};
module.exports = Route;
