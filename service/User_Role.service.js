const UserRepository = require("../repository/user.repository");
const UserRoleRepository = require("../repository/user_role.repository");
const RoleRepository = require("../repository/role.repository");

class UserRoleService {
  //assign new role to the user
  addUserRole = async (payload) => {
    const checkUserByName = await UserRepository.findByName(payload.user_name);
    if (!checkUserByName) throw new Error(`User of name:${payload.user_name} not found`);
    const checkRoleByName = await RoleRepository.findByName(payload.role_name);
    if (!checkRoleByName) throw new Error(`Role of name:${payload.role_name} not found`);
    const findByUserId = await UserRoleRepository.findByUserId(checkUserByName.id);
    if (findByUserId.role_id === checkRoleByName.id) throw new Error(`Role ${payload.role_name} has been already assigned to the User ${payload.user_name}`)
    // const findByUserIdAndRoleId = await UserRoleRepository.findByUserIdAndRoleId(checkUserByName.id, checkRoleByName.id);
    if (findByUserId) {
      const updateRole = await UserRoleRepository.updateAssignedRoles(
        { role_id: checkRoleByName.id },
        findByUserId.user_id
      );
      return updateRole;
    }

    // if (findByUserIdAndRoleId) throw new Error("A role has been already assigned to this user")

    // const checkUser = await UserRepository.findById(payload.user_id);
    // if (!checkUser) throw new Error(`User of id:${payload.user_id} not found`);
    // const checkRole = await RoleRepository.findById(payload.role_id);
    // if (!checkRole) throw new Error(`Role of id:${payload.role_id} not found`);
    // const find = await UserRoleRepository.findByUserId(payload.user_id);
    // if (find) {
    //   const updateRole = await UserRoleRepository.updateAssignedRoles(
    //     { role_id: payload.role_id },
    //     find.user_id
    //   );
    //   return updateRole;
    // }
    const data = {
      user_id: checkUserByName.id,
      role_id: checkRoleByName.id
    }
    const add = await UserRoleRepository.addUserRole(data);
    return add;
  };
  //get assigned roles
  getAssignedRoles = async () => {
    const findAllAssign = await UserRoleRepository.findAllAssign();
    return findAllAssign;
  };
  //find role by user id
  findByUserId = async (userId) => {
    const find = await UserRoleRepository.findByUserId(userId);
    if (!find)
      throw new Error("Non of the role has been assigned to this user");
    return find;
  };
  //update assigned role by id
  updateAssignedRoles = async (data, userId) => {
    const find = await UserRoleRepository.findByUserId(userId);
    if (!find) throw new Error("User Role not found");
    const updateAssigned = await UserRoleRepository.updateAssignedRoles(
      data,
      find.user_id
    );
    return updateAssigned;
  };
}
module.exports = new UserRoleService();
