const Order_List = (sequelize, type) => {
  return sequelize.define("order_lists", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ordered_date: {
      type: type.STRING,
      allowNull: false,
    },
    ordered_time: {
      type: type.STRING(10),
      allowNull: false,
    },
    quantity: {
      type: type.INTEGER,
    },
    total_bill: {
      type: type.DECIMAL(10, 2),
      allowNull: false,
    },
    delivery_location: {
      type: type.STRING(255),
      allowNull: false,
    },
    order_status: {
      type: type.STRING(20),
      allowNull: false,
    },
    payment_method: {
      type: type.STRING(10),
      allowNull: false,
    },
  }, { timestamps: false });
};
module.exports = Order_List;
