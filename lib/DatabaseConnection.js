// const postgres = require('postgres');
const Sequelize = require("sequelize");
const User = require("../model/User.model");
const User_Role = require("../model/User_Role.model");
const Bills = require("../model/Bills.model");
const Food_items = require("../model/Food_Items.model");
const Order_List = require("../model/Order_list.model");
const Roles = require("../model/Role.model");
const ModuleMode = require("../model/Module.model");
const Privileges = require("../model/Privileges.model");
const Route = require("../model/Routes.model");
const Access = require("../model/Access.model");
const Debit_Credit_Alc = require("../model/Debit_credit_Alc.model");
const Payment_history = require("../model/Payment_history.model");
const Categories = require("../model/Category.model");
const Notifications = require("../model/Notification.model");
const Email_Verification = require("../model/Email_verification.model");

const DB_HOST = "localhost";
const DB_PORT = "5432";
const DB_DATABASE = "postgres";
const DB_NAME = "final_project";
const DB_USERNAME = "postgres";
const DB_PASSWORD = "1234";
const DIALECT = "postgres";
const database = {};
// const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
//   dialect: DIALECT,
//   host: DB_HOST,
//   port: DB_PORT,
//   pool: {
//     max: 20,
//     idle: 20000,
//     min: 5,
//   },
//   define: {
//     underscored: true,
//   },
// });
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  "dialect": DIALECT,
  "dialectOptions": {
    ssl: { rejectUnauthorized: false }

  }
});

const UserModel = User(sequelize, Sequelize.DataTypes);
const Email_Verification_Model = Email_Verification(sequelize, Sequelize.DataTypes);
const RoleModel = Roles(sequelize, Sequelize.DataTypes);
const User_Role_Model = User_Role(sequelize, Sequelize.DataTypes);
const AccessModel = Access(sequelize, Sequelize.DataTypes);
const ModuleModel = ModuleMode(sequelize, Sequelize.DataTypes);
const PrivilegeModel = Privileges(sequelize, Sequelize.DataTypes);
const RoutesModel = Route(sequelize, Sequelize.DataTypes);
const CategoryModel = Categories(sequelize, Sequelize.DataTypes);
const FoodItemsModel = Food_items(sequelize, Sequelize.DataTypes);
const Order_List_Model = Order_List(sequelize, Sequelize.DataTypes);
const BillsModel = Bills(sequelize, Sequelize.DataTypes);
const Debit_Credit_Alc_Model = Debit_Credit_Alc(sequelize, Sequelize.DataTypes);
const Payment_history_Model = Payment_history(sequelize, Sequelize.DataTypes);
const Notifications_Model = Notifications(sequelize, Sequelize.DataTypes)
UserModel.hasMany(Order_List_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
});
Order_List_Model.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(Notifications_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
})
Notifications_Model.belongsTo(UserModel, { foreignKey: "user_id" })

FoodItemsModel.hasMany(Order_List_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "food_item_id",
  },
});
Order_List_Model.belongsTo(FoodItemsModel, { foreignKey: "food_item_id" });
// CategoryModel.hasMany(FoodItemsModel, {
//   foreignKey: {
//     type: Sequelize.DataTypes.INTEGER,
//     allowNull: false,
//     name: "category_id",
//   },
// });
// FoodItemsModel.belongsTo(CategoryModel);
UserModel.hasMany(BillsModel, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
});
BillsModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasOne(Debit_Credit_Alc_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
});
Debit_Credit_Alc_Model.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasOne(Payment_history_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
});
Payment_history_Model.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasOne(User_Role_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "user_id",
  },
});
User_Role_Model.belongsTo(UserModel, { foreignKey: "user_id" });
RoleModel.hasMany(User_Role_Model, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "role_id",
  },
});
User_Role_Model.belongsTo(RoleModel, { foreignKey: "role_id" });
RoutesModel.hasOne(PrivilegeModel, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "route_id",
  },
});
PrivilegeModel.belongsTo(RoutesModel, { foreignKey: "route_id" });

RoleModel.hasMany(AccessModel, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "role_id",
  },
});
AccessModel.belongsTo(RoleModel, { foreignKey: "role_id" });
ModuleModel.hasMany(AccessModel, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "module_id",
  },
});
AccessModel.belongsTo(ModuleModel, { foreignKey: "module_id" });
PrivilegeModel.hasMany(AccessModel, {
  foreignKey: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    name: "privilege_id",
  },
});
AccessModel.belongsTo(PrivilegeModel, { foreignKey: "privilege_id" });

database.user = UserModel;
database.email_verification = Email_Verification_Model;
database.notification = Notifications_Model;
database.roles = RoleModel;
database.user_role = User_Role_Model;
database.access = AccessModel;
database.module_models = ModuleModel;
database.privileges = PrivilegeModel;
database.route = RoutesModel;
database.categories = CategoryModel;
database.food_items = FoodItemsModel;
database.order_lists = Order_List_Model;
database.debit_credit_alc = Debit_Credit_Alc_Model;
database.bills = BillsModel;
database.payment_history = Payment_history_Model;


database.sequelize = sequelize;
module.exports = database;
