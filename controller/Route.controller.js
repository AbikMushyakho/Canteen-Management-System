const ApiError = require("../errorHandler/ApiError");
const RouteService = require("../service/Route.service");
const SuccessResponse = require("../utils/globalResponse");
class RouteController {
  add = async (req, res, next) => {
    try {
      const data = req.body;
      const saveRoute = await RouteService.add(data);
      if (!saveRoute) {
        return next(ApiError.BadRequest("Route not saved"));
      }
      return SuccessResponse(res, 201, "Route created successfully");
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findOne = await RouteService.findById(id);
      if (!findOne) {
        return next(ApiError.BadRequest("Route not found"));
      }
      return SuccessResponse(
        res,
        200,
        "Single route found successfully",
        findOne
      );
    } catch (ex) {
      return next(ApiError.BadRequest(ex.message));
    }
  };
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const newData = req.body;
      const updateData = await RouteService.updateRoute(newData, id);
      if (!updateData) {
        return next(ApiError.BadRequest("Route Id not updated"));
      }
      return SuccessResponse(
        res,
        200,
        "Route data updated Successfully",
        updateData
      );
    } catch (error) {
      return next(ApiError.BadRequest(error));
    }
  };
  getAll = async (req, res, next) => {
    try {
      const allRoutes = await RouteService.getAll();
      if (!allRoutes) {
        return next(ApiError.BadRequest("Error finding all routes"));
      }
      return SuccessResponse(res, 200, "List of all routes", allRoutes);
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new RouteController();
