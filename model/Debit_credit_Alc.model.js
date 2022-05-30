const Debit_Credit_Alc = (sequelize, type) => {
  return sequelize.define("debit_credit_alcs", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    advance_amount: {
      type: type.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_credit_amount: {
      type: type.DECIMAL(10, 2),
      defaultValue: 0,
    },
  }, { timestamps: false });
};
module.exports = Debit_Credit_Alc;
