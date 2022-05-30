const AccessRepository = require("../repository/access.repository");
const RoleRepository = require("../repository/role.repository");
const ModuleRepository = require("../repository/module.repository");
const PrivilegeService = require("./Privilege.service");

class AccessService {
  addAccess = async (payload) => {
    payload.role_id = parseInt(payload.role_id)
    if (typeof payload.role_id !== "number")
      throw new Error("The given role id must be number");

    //checking roles
    const findRoleId = await RoleRepository.findById(payload.role_id);
    if (!findRoleId)
      throw new Error(`Role id ${payload.role_id} doesn't exists`);
    //checking Modules
    const Module_Ids = payload.module_id;
    if (!(typeof Module_Ids === "object") && !Array.isArray(Module_Ids))
      throw new Error("Module should be given on array");

    // checking privileges names

    //looping module to get single
    for (let m = 0; m < Module_Ids.length; m++) {
      let Module_id = Module_Ids[m];

      let Found_Module = await ModuleRepository.findById(Module_id);
      if (!Found_Module)
        throw new Error(`module id ${Module_id}  doesn't exists`);
      // get module name
      let Module_name = Found_Module.module_name;

      //Working on privilege Names
      const Privilege_names = payload.privilege_name;
      if (
        !(typeof Privilege_names === "object") &&
        !Array.isArray(Privilege_names)
      )
        throw new Error("Privilege names should be given on array");

      //looping the given privilege names from payload
      for (let pn = 0; pn < Privilege_names.length; pn++) {
        let Privilege_name = Privilege_names[pn];
        //searching privilege
        let Found_privilege = await PrivilegeService.findByName(
          Privilege_name,
          Module_name
        );
        //privilege returns in array so looping it
        for (let newP = 0; newP < Found_privilege.length; newP++) {
          let Privilege = Found_privilege[newP];
          //getting privilege id
          let Privilege_Id = Privilege.id;
          //searching if the access is previously available or not
          const SearchPrevious =
            await AccessRepository.findBySpecificRoleModulePrivilege(
              payload.role_id,
              Module_id,
              Privilege_Id,
            );
          //if exists then delete it and create new
          if (SearchPrevious) {
            await AccessRepository.deleteById(SearchPrevious.id);
          }

          //if all ok then save access
          await AccessRepository.add({
            role_id: payload.role_id,
            module_id: Module_id,
            privilege_id: Privilege_Id,
          });
        }
      }
    }
    return true;
  };
  //getting all accesses
  getAll = async () => {
    const AllAccess = await AccessRepository.getAll();
    const total = AllAccess.length;
    return { Accesses: AllAccess, Total_Accesses: total };
  };
  // find by role id
  findByRoleId = async (role_id) => {
    const check_role = await RoleRepository.findById(role_id);
    if (!check_role) throw new Error("Role does not exists");
    const AllAccess = await AccessRepository.findByRoleId(role_id);
    const total = AllAccess.length;
    return { Accesses: AllAccess, Total_Accesses: total };
  };
  //find One access by id
  findById = async (id) => {
    const data = await AccessRepository.findById(id);
    if (!data) throw new Error("Access by id not found")
    return data;
  };
  //find access by specific role_id module_id and privilege_id
  findBySpecificRoleModulePrivilege = async (payload) => {
    const find = await AccessRepository.findBySpecificRoleModulePrivilege({
      role_id: payload.role_id,
      module_id: payload.module_id,
      privilege_id: payload.privilege_id,
    });
    if (!find) {
      return false;
    }
    return find;
  };
}
module.exports = new AccessService();
