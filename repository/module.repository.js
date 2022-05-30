const {
  module_models,
  privileges,
  sequelize,
} = require("../lib/DatabaseConnection");

class ModuleRepository {
  add = async (name) => {
    try {
      const saveModule = await module_models.create({
        module_name: name,
      });

      return saveModule;
    } catch (error) {
      return false;
    }
  };
  getAll = async () => {
    const getModule = await module_models.findAll({

    });
    return getModule;
  };

  findById = async (id) => {
    const ModuleData = await module_models.findOne({
      where: { id },

    });
    return ModuleData;
  };
  findByName = async (name) => {
    const ModuleData = await module_models.findOne({
      where: { module_name: name },

    });

    return ModuleData;
  };
  findAllByName = async (name) => {
    const ModuleData = await module_models.findAll({
      where: { module_name: name },

    });

    return ModuleData;
  };
  update = async (data, id) => {
    const updatedModule = await module_models.update(data, {
      where: {
        id: id
      }
    });
    if (!updatedModule) {
      return false;
    }
    const findUpdated = await this.findById(id);
    return findUpdated;
  }
}
module.exports = new ModuleRepository();
