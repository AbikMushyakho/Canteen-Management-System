const Access = (sequelize, type) => {
  return sequelize.define("accesses", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // role_id: {
    //   type: type.INTEGER,
    //   allowNull: false,
    //   reference: {
    //     model: {
    //       tableName: "roles",
    //     },
    //     key: "id",
    //   },
    // },
    // module_id: {
    //   type: type.INTEGER,
    //   allowNull: false,
    //   reference: {
    //     model: {
    //       tableName: "module_models",
    //     },
    //     key: "id",
    //   },
    // },
    // privilege_id: {
    //   type: type.INTEGER,
    //   allowNull: false,
    //   reference: {
    //     model: {
    //       tableName: "privileges",
    //     },
    //     key: "id",
    //   },
    // },
  }, { timestamps: false });
};
module.exports = Access;
