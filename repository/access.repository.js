const { access, sequelize, roles, module_models, privileges } = require("../lib/DatabaseConnection");

class AccessRepository {
  add = async (payload) => {
    const t = await sequelize.transaction();

    try {
      const save = await access.create(payload);
      await t.commit();
      return save;
    } catch (ex) {
      await t.rollback();
      return false;
    }
  };
  getAll = async () => {
    const getAllAccess = await access.findAll(
      {
        include: [
          {
            model: roles,

          },
          {
            model: module_models,

          },
          {
            model: privileges,

          },

        ],

      }
    );

    return getAllAccess;
  };
  // find by role Id
  findByRoleId = async (role_id) => {
    const getAllAccess = await access.findAll(
      {
        where: {
          role_id: role_id
        },
        include: [
          {
            model: roles,

          },
          {
            model: module_models,

          },
          {
            model: privileges,

          },

        ],

      }
    );

    return getAllAccess;
  };
  findById = async (id) => {
    const data = await access.findOne({
      where: { id },

    });
    return data;
  };
  findAllByRoleIdAndModuleId = async (role_id, module_id) => {
    const data = await access.findAll({
      where: { role_id: role_id, module_id: module_id },

    });
    return data;
  };

  findBySpecificRoleModulePrivilege = async (
    role_id,
    module_id,
    privilege_id
  ) => {
    const find = await access.findOne({
      where: {
        role_id: role_id,
        module_id: module_id,
        privilege_id: privilege_id,
      },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  deleteById = async (id) => {
    const find = await this.findById(id);
    if (!find) throw new Error("Access not found");
    await access.destroy({
      where: {
        id: find.id,
      },
    });
    return true;
  };
}
module.exports = new AccessRepository();
