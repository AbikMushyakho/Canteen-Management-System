const Bill = (sequelize, type) => {
  return sequelize.define("bills", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference_code: {
      type: type.STRING(30),
      allowNull: false,
    },
    date_of_order: {
      type: type.STRING(255),
      allowNull: false,
    },
    food_name: {
      type: type.STRING(50),
      allowNull: false,
    },
    quantity: {
      type: type.INTEGER,
      allowNull: false,
    },
    amount: {
      type: type.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: type.STRING(10),
      allowNull: false,
    },
  }, { timestamps: false });
};
module.exports = Bill;
