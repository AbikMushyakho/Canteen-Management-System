const ApiError = require("../errorHandler/ApiError");
const PrivilegeService = require("../service/Privilege.service");
const SuccessResponse = require("../utils/globalResponse");
class PrivilegeController {
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const savePriv = await PrivilegeService.add(data);
      if (savePriv)
        return SuccessResponse(res, 201, "Privilege created successfully");
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findOne = await PrivilegeService.findById(id);
      if (findOne) {
        return SuccessResponse(
          res,
          200,
          "Single privilege found successfully",
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
      const findOne = await PrivilegeService.findByPrivilegeName(name);
      if (findOne) {
        return SuccessResponse(
          res,
          200,
          "Single privilege found successfully",
          findOne
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  getAll = async (req, res, next) => {
    try {
      const getPrivileges = await PrivilegeService.getAll();
      if (getPrivileges) {
        return SuccessResponse(
          res,
          200,
          "List of all Privileges",
          getPrivileges
        );
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  deleteByNameAndRoute = async (req, res, next) => {
    try {
      const payload = req.body;
      const deleteOne = await PrivilegeService.deleteByNameAndRoute(payload);
      if (deleteOne) {
        return SuccessResponse(res, 200, " Privilege deleted successfully");
      }
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new PrivilegeController();
