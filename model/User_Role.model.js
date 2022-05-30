const Roles = (sequelize, type) => {
  return sequelize.define("user_roles", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // user_id: {
    //   type: type.INTEGER,
    //   reference: {
    //     model: "users",
    //     key: "id",
    //   },
    // },
    // role_id: {
    //   type: type.INTEGER,
    //   reference: {
    //     model: "roles",
    //     key: "id",
    //   },
    // },
  }, { timestamps: false });
};
module.exports = Roles;
