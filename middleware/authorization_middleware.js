const ApiError = require("../errorHandler/ApiError");
const AccessRepository = require("../repository/access.repository");
const ModuleRepository = require("../repository/module.repository");
const PrivilegesRepository = require("../repository/privileges.repository");
const User_RoleRepository = require("../repository/user_role.repository");
const models = require("./add_module.middleware");
const RoleRepository = require("../repository/role.repository");

class Autho {
  check = async (req, res, next) => {
    try {
      if (!req.user) throw new Error("Authentication is required");
      //getting module from given url like /user/add => user is module
      const modelData = await models.check(req);
      // typecasting to upper case to check in database
      const upperModule = modelData.toUpperCase();
      const findModule = await ModuleRepository.findByName(upperModule);
      if (!findModule) throw new Error("Module Not found");
      //checking role
      const findRole = await User_RoleRepository.findByUserId(req.user.id);
      if (!findRole) throw new Error("No Roles Assigned");
      const role_id = findRole.role_id;
      //getting role name and changing in lower case
      const getRoleName = await RoleRepository.findById(role_id);
      let role_name = getRoleName.role_name;
      role_name = role_name.toLowerCase();
      //checking privilege through url and method
      const url = req.route.path;
      const method = req.method;
      const filteredPrivilege = [];
      const findPrivilegeRouteAndMethod =
        await PrivilegesRepository.findByEndpointAndMethod(url, method);
      if (!findPrivilegeRouteAndMethod) throw new Error("You have no access to this route");
      //return privilege in array cause privilege are saved in (ADMIN_READ,USER_READ) this format which have save route and module id but the privilege name is different
      //using loop to get exact privilege  and pushing in array
      for (let p = 0; p < findPrivilegeRouteAndMethod.length; p++) {
        let privilege = findPrivilegeRouteAndMethod[p];
        let privilege_name = privilege.privilege_name;
        //breaking down privilege name // taking first word only
        let privilegeRole = privilege_name.substring(
          0,
          privilege_name.indexOf("_")
        );
        privilegeRole = privilegeRole.toLowerCase();
        // if matched the role module then push to array but the array with contain only one data
        if (privilegeRole === role_name) {
          filteredPrivilege.push(privilege);
        }
      }
      //as i said above taking privilege id from Array having length 1 which index is 0
      if (filteredPrivilege.length == 0) throw new Error("You have no access to this route")
      const privilege_id = filteredPrivilege[0].id;
      //checking access
      const foundAccess =
        await AccessRepository.findBySpecificRoleModulePrivilege(
          role_id,
          findModule.id,
          privilege_id
        );
      //not found then return no access
      if (!foundAccess) {
        throw new Error("You have no access to this route");
      }
      next();
    } catch (error) {
      next(ApiError.Forbidden(error.message));
    }
  };
}

module.exports = new Autho();
