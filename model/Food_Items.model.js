const FoodItems = (sequelize, type) => {
  return sequelize.define("food_items", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_name: {
      type: type.STRING(255),
      allowNull: false,
    },
    price: {
      type: type.DECIMAL(10, 2),
      allowNull: false,
    },
    available: {
      type: type.BOOLEAN,
    },
    category_id: {
      type: type.INTEGER,
      reference: {
        model: "categories",
        key: "id",
      },
    },
    // category: {
    //   type: type.STRING(100),
    //   allowNull: false,
    // },
    food_image: {
      type: type.STRING(255),
      allowNull: false,
    },
  }, { timestamps: false });
};
module.exports = FoodItems;
