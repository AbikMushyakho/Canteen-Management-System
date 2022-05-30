const RoleRepository = require("../repository/role.repository");

class RoleService {
  //adding role
  add = async (payload) => {
    const find = await RoleRepository.findByName(payload.role_name);
    if (find) throw new Error("Role Already exists");
    const saveRole = await RoleRepository.add(payload);
    return saveRole;
  };
  //get all roles
  getAll = async () => {
    const findAll = await RoleRepository.getAll();
    return findAll;
  };
  //find role by id
  findById = async (id) => {
    const find = await RoleRepository.findById(id);
    if (!find) throw new Error(` role not found`);
    return find;
  };
  //find role by role name
  findByName = async (name) => {
    const find = await RoleRepository.findByName(name);
    if (!find) throw new Error(`${name} role not found`);
    return find;
  };
}
module.exports = new RoleService();
