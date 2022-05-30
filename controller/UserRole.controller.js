const ApiError = require("../errorHandler/ApiError");
const UserRoleService = require("../service/User_Role.service");
const SuccessResponse = require("../utils/globalResponse");

class UserRoleController {
  addUserRole = async (req, res, next) => {
    try {
      const payload = req.body;
      const addRole = await UserRoleService.addUserRole(payload);
      if (addRole) {
        return SuccessResponse(res, 201, "Role to user assigned successfully");
      }
    } catch (ex) {
      next(ApiError.BadRequest(ex.message));
    }
  };
  getAssignedRoles = async (req, res, next) => {
    try {
      const get = await UserRoleService.getAssignedRoles();
      if (get) {
        return SuccessResponse(
          res,
          201,
          "Role to user assigned successfully",
          get
        );
      }
    } catch (ex) {
      next(ApiError.BadRequest(ex.message));
    }
  };
  findByUserId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const find = await UserRoleService.findByUserId(id);
      return SuccessResponse(res, 200, `Found role by id: ${id}`, find);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  updateAssignedRole = async (req, res, next) => {
    try {
      const updateRoles = await UserRoleService.updateAssignedRoles(
        req.body,
        req.params.id
      );
      return SuccessResponse(res, 200, `Update Successful`, updateRoles);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new UserRoleController();
