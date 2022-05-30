const { sequelize } = require("../lib/DatabaseConnection");
const PrivilegeRepository = require("../repository/privileges.repository");
const ModuleRepository = require("../repository/module.repository");
const RouteRepository = require("../repository/route.repository");
const AccessRepository = require("../repository/access.repository");
class PrivilegeService {
  add = async (payload) => {
    if (typeof payload.privilege_name !== "string")
      throw new Error("Privilege name should be string");
    const routeIds = payload.route_id;

    if (!(typeof routeIds === "object") && !Array.isArray(routeIds))
      throw new Error("Routes should be given on array");
    const t = await sequelize.transaction();
    for (let i = 0; i < routeIds.length; i++) {
      let rou_id = routeIds[i];
      const findRoute = await RouteRepository.findById(rou_id);
      if (!findRoute) throw new Error(`Route id : ${rou_id} not found`);
      const findPrePriv =
        await PrivilegeRepository.findSpecificPrivilegeByNameAndRouteId(
          payload.privilege_name,
          rou_id
        );
      if (findPrePriv)
        throw new Error(
          `Route id : ${rou_id} of Privilege name: ${payload.privilege_name} already exists`
        );
      await PrivilegeRepository.add(payload.privilege_name, rou_id);
    }
    await t.commit();
    return true;
  };
  findById = async (id) => {
    const find = await PrivilegeRepository.findById(id);
    if (!find) throw new Error(`Privilege of id : ${id} doesn't exists`);
    return find;
  };
  //deleting privilege with name and also deleting all accesses related with that privileges
  deleteByNameAndRoute = async (payload) => {
    //finding route
    const route = payload.endpoint;
    const findRoute = await RouteRepository.findByEndPoint(route);
    if (!findRoute) throw new Error("No route exist of this endpoint");

    //getting module name
    let module_name = route.replace("/", ""); //removing http://
    module_name = module_name.substring(0, module_name.indexOf("/"));
    module_name = module_name.toUpperCase();
    const found_module = await ModuleRepository.findByName(module_name);
    if (!found_module) throw new Error("Module not found");
    const module_id = found_module.id;
    const privilege_name = payload.privilege_name;

    const NameArray = await PrivilegeRepository.findByName(privilege_name);
    const checkOne = NameArray.filter((r) => r.route.endpoint === route);
    if (checkOne.length === 0) throw new Error("Endpoint not matched");
    const privilege_id = checkOne[0].id;
    //breaking privilege name to get role id
    let privilege_N = privilege_name.substring(0, privilege_name.indexOf("_"));
    privilege_N = privilege_N.toLowerCase();
    let role_id = 0;
    if (privilege_N === "admin") {
      role_id = 1;
    }
    if (privilege_N === "user") {
      role_id = 2;
    }
    if (privilege_N === "staff") {
      role_id = 3;
    }
    if (privilege_N === "guest") {
      role_id = 4;
    }

    const findAccess = await AccessRepository.findBySpecificRoleModulePrivilege(
      role_id, module_id, privilege_id
    );
    if (findAccess) {
      await AccessRepository.deleteById(findAccess.id);
    }

    const Found =
      await PrivilegeRepository.findSpecificPrivilegeByNameAndRouteId(
        privilege_name,
        findRoute.id
      );
    if (!Found)
      throw new Error(
        `Privilege of name :${privilege_name} having route url : ${payload.endpoint} not found`
      );
    await PrivilegeRepository.deleteById(Found.id);
    return true;
  };
  //finding privilege by privilege name with same module given
  findByName = async (Privilege_name, Module_name) => {
    //empty array
    const Filtered_Privilege_Array = [];
    //finding all privilege with the given name
    const findAll = await PrivilegeRepository.findByName(Privilege_name);
    //changing upper case module name to lower case
    const module_name = Module_name.toLowerCase();
    //looping the found array of privileges
    for (let p = 0; p < findAll.length; p++) {
      let Found_privilege = findAll[p];
      //getting the endpoint of specific privilege
      let endpoint = Found_privilege.route.endpoint;
      let endpointRoute = endpoint.replace("/", "");
      endpointRoute = endpointRoute.substring(0, endpointRoute.indexOf("/"));
      //checking if the privilege route first name after / matches or not
      if (module_name === endpointRoute) {
        //if match then push to array
        Filtered_Privilege_Array.push(Found_privilege);
      }
    }

    //returning matched privileges
    return Filtered_Privilege_Array;
  };

  // get all privilege
  getAll = async () => {
    const getPriv = await PrivilegeRepository.getAll();
    return getPriv;
  };
  findByPrivilegeName = async (name) => {
    const getPriv = await PrivilegeRepository.findByName(name);
    if (!getPriv) throw new Error(`Privilege by name ${name} not found!!`)
    return getPriv;
  }
}
module.exports = new PrivilegeService();
