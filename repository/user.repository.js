const fs = require("fs/promises");
const { user, sequelize, user_role } = require("../lib/DatabaseConnection");

class UserRepo {
  register = async (payload) => {
    const t = await sequelize.transaction();
    try {
      const save = await user.create(payload);
      await t.commit();
      return save;
    } catch (ex) {
      await t.rollback();
      return false;
    }
  };



  login = async (payload) => {
    const email = payload.email;
    const find = await user.findOne({
      where: {
        email: email,
      }, include: {
        model: user_role,

      },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  findByEmail = async (email) => {
    const find = await user.findOne({
      where: {
        email: email,
      },
      include: {
        model: user_role,

      },

    });
    return find;
  };
  findByName = async (name) => {
    const find = await user.findOne({
      where: {
        full_name: name,
      },
      include: {
        model: user_role,

      },
      attributes: {
        exclude: ["password"],
      },
    });
    return find;
  };
  findById = async (id) => {
    const find = await user.findOne({
      where: {
        id: id,
      },
      include: {
        model: user_role,

      },
      attributes: {
        exclude: ["password"]
      }
    });
    if (!find) {
      return false
    }
    return find;

  };
  findAll = async () => {
    const find = await user.findAll({
      include: {
        model: user_role,

      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!find) {
      return false;
    }
    return find;
  };
  updateUser = async (data, id) => {
    const find = await this.findById(id);
    if (!find) throw new Error("User Id not found");
    const UpdatedUser = await user.update(data, { where: { id: id } });
    if (!UpdatedUser) {
      return false;
    }
    const updatedData = await this.findById(id);
    return updatedData;
  };
  updateByEmail = async (data, email) => {

    const UpdatedUser = await user.update(data, { where: { email: email } });
    if (!UpdatedUser) {
      return false;
    }
    const updatedData = await this.findByEmail(email);
    return updatedData;
  };
  deleteById = async (id) => {
    const find = await this.findById(id);

    if (!find) {
      return false;
    }
    const deleteUserId = await user.destroy({ where: { id: id }, force: true });
    if (deleteUserId) {
      return true;
    }
    return false;
  };
}
module.exports = new UserRepo();
