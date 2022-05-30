
const Payment_history = (sequelize, type) => {
    return sequelize.define("payment_histories", {
        date: {
            type: type.STRING(100),
            allowNull: false
        },
        time: {
            type: type.STRING(10),
            allowNull: false
        },
        reference_code: {
            type: type.STRING(255),
            allowNull: false
        },
        previous_amount: {
            type: type.DECIMAL(10, 2),
            defaultValue: 0,
        },
        advance_amount: {
            type: type.DECIMAL(10, 2),
            defaultValue: 0,
        },
        remaining_amount: {
            type: type.DECIMAL(10, 2),
            defaultValue: 0,
        },
        paid_amount: {
            type: type.DECIMAL(10, 2),
            defaultValue: 0,
        },
        status: {
            type: type.STRING(10),
            allowNull: false
        }
    }, { timestamps: false });
};
module.exports = Payment_history;
