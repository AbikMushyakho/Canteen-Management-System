const ApiError = require("../errorHandler/ApiError");
const RoleService = require("../service/Role.service");
const SuccessResponse = require("../utils/globalResponse");
class RoleController {
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const saveRole = await RoleService.add(data);
      if (saveRole)
        return SuccessResponse(res, 201, "Role created successfully");
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };

  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findOne = await RoleService.findById(id);
      if (findOne) {
        return SuccessResponse(
          res,
          200,
          "Single role found successfully",
          findOne
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  getAll = async (req, res, next) => {
    try {
      const roles = await RoleService.getAll();
      if (roles) {
        return SuccessResponse(res, 200, "List of all roles", roles);
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new RoleController();
