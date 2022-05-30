const Categories = (sequelize, type) => {
  return sequelize.define("categories", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: type.STRING(200),
      allowNull: false,
    },
  }, { timestamps: false });
};

module.exports = Categories;
