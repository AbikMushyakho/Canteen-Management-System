const RouteRepository = require("../repository/route.repository");

class RouteService {
  //add new route
  add = async (data) => {
    const find = await RouteRepository.findByEndPoint(data.endpoint);
    if (find) throw new Error("Route already exists");
    const saveRoute = await RouteRepository.addRoute(data);
    return saveRoute;
  };
  //get all routes
  getAll = async () => {
    const find = await RouteRepository.getAllRoutes();
    return find;
  };
  //find route by id
  findById = async (id) => {
    const find = await RouteRepository.findById(id);
    if (!find) {
      return false;
    }
    return find;
  };
  //update route by id
  updateRoute = async (newData, id) => {
    const updateRou = await RouteRepository.updateRoute(newData, id);
    if (!updateRou) {
      return false;
    }

    return updateRou;
  };
}
module.exports = new RouteService();
