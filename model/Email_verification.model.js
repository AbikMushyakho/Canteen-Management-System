const Email_Verification = (sequelize, type) => {
    return sequelize.define("email_verifications", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: type.STRING(100),
            allowNull: false,
            unique: true,
        },
        token: {
            type: type.STRING(255),
            allowNull: false,
        },
        expired: {
            type: type.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, { timestamps: false });
};
module.exports = Email_Verification;
