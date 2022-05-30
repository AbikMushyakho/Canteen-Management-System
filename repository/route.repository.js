const { route } = require("../lib/DatabaseConnection");

class RouteRepository {
  addRoute = async (data) => {
    const save = await route.create(data);
    if (!save) {
      return false;
    }
    return save;
  };
  findById = async (id) => {
    const find = await route.findOne({
      where: { id: id },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  updateRoute = async (newData, id) => {
    const find = await this.findById(id);
    if (!find) {
      return false;
    }
    const updateRou = await route.update(newData, {
      where: {
        id: id,
      },
    });
    if (!updateRou) {
      return false;
    }
    const returnUpdated = await this.findById(id);
    if (!returnUpdated) {
      return false;
    }
    return returnUpdated;
  };
  getAllRoutes = async () => {
    const getRoute = await route.findAll({

    });
    return getRoute;
  };
  findByEndPoint = async (endpoint) => {
    const find = await route.findOne({
      where: {
        endpoint: endpoint,
      },

    });
    return find;
  };
}
module.exports = new RouteRepository();
