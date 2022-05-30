const ModuleRepository = require("../repository/module.repository");
class ModuleService {
  //adding new module
  add = async (payload) => {
    //if same module exist in db then returning error
    const name = payload.module_name;
    const findPriv = await ModuleRepository.findByName(name);
    if (findPriv) throw new Error("Module already exists");
    //else saving new one
    const save = await ModuleRepository.add(name);
    if (!save) {
      return false;
    }
    return save;
  };
  //getting all modules
  getAll = async () => {
    const getModule = await ModuleRepository.getAll();
    return getModule;
  };
  // finding module by module_id
  findById = async (id) => {
    const ModuleData = await ModuleRepository.findById(id);
    return ModuleData;
  };
  // finding module by module_name
  findByName = async (name) => {
    const ModuleData = await ModuleRepository.findByName(name);
    if (!ModuleData) throw new Error(`Module by name ${name} not found`);
    return ModuleData;
  };
  updateModule = async (data, id) => {
    const ModuleData = await ModuleRepository.findById(id);
    if (!ModuleData) throw new Error(`Module by id ${id} not found`);
    const updatedModule = await ModuleRepository.update(data, ModuleData.id);
    if (!updatedModule) throw new Error("Module not updated")
    return updatedModule;
  };
}
module.exports = new ModuleService();
