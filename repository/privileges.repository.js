const { privileges, route } = require("../lib/DatabaseConnection");

class PrivilegeRepository {
  add = async (privilegeName, routeId) => {
    const savePriv = await privileges.create({
      privilege_name: privilegeName,
      route_id: routeId,
    });
    return savePriv;
  };
  findById = async (id) => {
    const PrivilegeData = await privileges.findOne({
      where: { id },
      include: {
        model: route,

      },

    });
    return PrivilegeData;
  };
  findByName = async (name) => {
    const PrivilegeData = await privileges.findAll({
      where: {
        privilege_name: name,
      },
      include: {
        model: route,

      },

    });
    return PrivilegeData;
  };
  findByEndpointAndMethod = async (endpoint, method) => {
    const findAll = await this.getAll();
    const filterRoute = findAll.filter(
      (r) => r.route.endpoint === endpoint && r.route.method === method
    );
    if (filterRoute.length !== 0) {
      return filterRoute;
    }
    return false;
  };
  findSpecificPrivilegeByNameAndRouteId = async (name, routeId) => {
    const find = await privileges.findOne({
      where: {
        privilege_name: name,
        route_id: routeId,
      },
      include: {
        model: route,

      },

    });
    return find;
  };
  deleteById = async (privilege_id) => {
    await privileges.destroy({
      where: {
        id: privilege_id,
      },
    });
    return true;
  };
  getAll = async () => {
    const getPriv = await privileges.findAll({
      include: {
        model: route,

      },

    });
    return getPriv;
  };
}
module.exports = new PrivilegeRepository();
