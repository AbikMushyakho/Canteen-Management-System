const { order_lists, user, food_items } = require("../lib/DatabaseConnection");

class OrderRepo {
  addOrder = async (payload) => {
    const add = await order_lists.create(payload);
    if (!add) {
      return false;
    }
    return add;
  };
  findById = async (id) => {
    const find = await order_lists.findOne({
      where: {
        id: id,
      },
      //returning
      include: [
        {
          model: user,
          required: true,
          attributes: {
            exclude: [
              "id",
              "password",
              "ppSizeImage",

            ],
          },
        },
        {
          model: food_items,
          required: true,
          attributes: {
            exclude: [
              "id",
              "available",

            ],
          },
        },
      ],

    });
    if (!find) {
      return false; // if not found then return false
    }
    return find; // if found then return found order
  };

  //find by users name
  findByUserName = async (name) => {
    const find = await order_lists.findAll({
      where: {
        user_name: name,
      },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  updateOrderById = async (data, id) => {
    const find = await this.findById(id);
    if (!find) {
      return false;
    }

    const updateOrder = await order_lists.update(data, {
      where: {
        id: id,
      },
    });
    if (!updateOrder) {
      return false;
    }
    const findUpdated = await this.findById(id);
    return findUpdated;
  };
  updateOrderByAdmin = async (data, id) => {
    const find = await this.findById(id);
    if (!find) {
      return false;
    }
    const updateOrder = await order_lists.update(data, {
      where: {
        id: id,
      },
    });
    if (!updateOrder) {
      return false;
    }
    const findUpdated = await this.findById(id);
    return findUpdated;
  };

  findAllOrderOfSingleUser = async (userId) => {
    const find = await order_lists.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: user,
          required: true,
          attributes: {
            exclude: [
              "id",
              "password",
              "ppSizeImage",

            ],
          },
        },
        {
          model: food_items,
          required: true,
          attributes: {
            exclude: [
              "id",
              "food_image",
              "available",

            ],
          },
        },
      ],

    });
    if (!find) {
      return false;
    }
    return find;
  };
  findAllOrder = async () => {
    const findA = await order_lists.findAll({
      include: [
        {
          model: user,
          attributes: {
            exclude: [
              "id",
              "password",
              "ppSizeImage",

            ],
          },
        },
        {
          model: food_items,
          required: true,
          attributes: {
            exclude: [
              "id",
              "food_image",
              "available",

            ],
          },
        },
      ],

    });
    if (!findA) {
      return false;
    }
    return findA;
  };
  deleteById = async (id) => {
    const deleteO = await order_lists.destroy({
      where: {
        id: id,
      },
    });
    if (!deleteO) {
      return false;
    }
    return true;
  };
  // deleteAll = async () => {
  //   return await order_lists.destroy({ truncate: true });
  // };
}
module.exports = new OrderRepo();
