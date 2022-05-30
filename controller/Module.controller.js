const ApiError = require("../errorHandler/ApiError");
const ModuleService = require("../service/Module.service");
const SuccessResponse = require("../utils/globalResponse");
class ModuleController {
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const saveModule = await ModuleService.add(data);
      if (saveModule)
        return SuccessResponse(res, 201, "Module created successfully");
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findOne = await ModuleService.findById(id);
      if (findOne) {
        return SuccessResponse(
          res,
          200,
          "Single module found successfully",
          findOne
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findByName = async (req, res, next) => {
    try {
      const { name } = req.query;
      const findOne = await ModuleService.findByName(name);
      if (findOne) {
        return SuccessResponse(
          res,
          200,
          `All module by name ${name} successfully`,
          findOne
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  updateModule = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedModule = await ModuleService.updateModule(data, id);
      if (!updatedModule) {
        next(ApiError.BadRequest("Module not updated"));
      }
      return SuccessResponse(res, 200, "Module updated successfully", updatedModule);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  getAll = async (req, res, next) => {
    try {
      const moduleS = await ModuleService.getAll();
      if (moduleS) {
        return SuccessResponse(res, 200, "List of all modules", moduleS);
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new ModuleController();
