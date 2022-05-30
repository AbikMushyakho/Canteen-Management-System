const ApiError = require("../errorHandler/ApiError");
const AccessService = require("../service/Access.service");
const SuccessResponse = require("../utils/globalResponse");
class AccessController {
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const saveAccess = await AccessService.addAccess(data);
      if (saveAccess) {
        return SuccessResponse(
          res,
          201,
          "New Access Saved Successfully",
          saveAccess
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findBySpecific = async (req, res, next) => {
    try {
      const payload = req.body;
      const findOne = await AccessService.findBySpecificRoleModulePrivilege(
        payload
      );
      if (findOne) {
        return SuccessResponse(
          res,
          201,
          "Access By Specific Found Successfully",
          findOne
        );
      }
      return next(ApiError.BadRequest("Not found"));
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  // find access by role id 
  findByRoleId = async (req, res, next) => {
    try {
      const role_id = req.params.id;
      const findAccess = await AccessService.findByRoleId(role_id);
      if (!findAccess) {
        next(ApiError.BadRequest("Access by this role not found"))
      }
      return SuccessResponse(res, 200, "Accesses of specific role found successfully", findAccess);
    } catch (error) {
      next(ApiError.BadRequest(error.message))
    }
  }


  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findOne = await AccessService.findById(id);
      if (findOne) {
        return SuccessResponse(
          res,
          201,
          "Access By Id Found Successfully",
          findOne
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  getAll = async (req, res, next) => {
    try {
      const getAllAccess = await AccessService.getAll();
      if (getAllAccess) {
        return SuccessResponse(res, 200, "List of all Access", getAllAccess);
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new AccessController();
