const { roles } = require("../lib/DatabaseConnection");

class RoleRepository {
  add = async (payload) => {
    const saveRole = await roles.create(payload);
    return saveRole;
  };
  getAll = async () => {
    const getRoles = await roles.findAll({

    });
    return getRoles;
  };
  findById = async (id) => {
    const find = await roles.findOne({
      where: { id },

    });
    return find;
  };

  findByName = async (name) => {
    const find = await roles.findOne({
      where: {
        role_name: name,
      },

    });
    return find;
  };
}
module.exports = new RoleRepository();
