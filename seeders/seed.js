const { sequelize } = require("../lib/DatabaseConnection");

module.exports = () => {
    sequelize
        .authenticate()
        .then(() => {
            sequelize.sync({ alter: true });
            console.log("postgres database connected");
        })
        .catch((err) => {
            console.log("Database Error" + err.message);
        });
}