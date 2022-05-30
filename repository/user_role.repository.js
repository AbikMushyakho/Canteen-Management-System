const { user_role } = require("../lib/DatabaseConnection");

class UserRoleRepository {
  addUserRole = async (payload) => {
    const assignRole = await user_role.create(payload);
    if (!assignRole) {
      return false;
    }
    return assignRole;
  };
  findAllAssign = async () => {
    const findAllAssign = await user_role.findAll({

    });

    return findAllAssign;
  };
  findByUserIdAndRoleId = async (userId, roleId) => {
    const find = await user_role.findOne({
      where: {
        user_id: userId,
        role_id: roleId
      },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  findByUserId = async (userId) => {
    const find = await user_role.findOne({
      where: {
        user_id: userId,
      },

    });
    return find;
  };
  findByRoleId = async (role_id) => {
    const find = await user_role.findAll({
      where: {
        role_id: role_id,
      },

    });
    if (find.length === 0) {
      return false
    }
    return find;
  };
  updateAssignedRoles = async (data, userId) => {
    await user_role.update(data, {
      where: {
        user_id: userId,
      },
    });
    const result = await this.findByUserId(userId);
    return result;
  };
}
module.exports = new UserRoleRepository();
