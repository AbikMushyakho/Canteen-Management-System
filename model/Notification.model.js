const Notifications = (sequelize, type) => {
    return sequelize.define("notifications", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: type.STRING(100),
            allowNull: false,
        },
        content: {
            type: type.STRING(255),
            allowNull: false,
        },
        order_id: {
            type: type.INTEGER,
            reference: {
                model: "order_lists",
                key: "id",
            },
        }

    }, { timestamps: false });
};
module.exports = Notifications;
