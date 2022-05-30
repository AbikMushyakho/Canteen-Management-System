const { debit_credit_alc, user } = require("../lib/DatabaseConnection");

class D_C_Repository {
  add = async (payload) => {
    const save = await debit_credit_alc.create(payload);
    if (!save) {
      return false;
    }
    return save;
  };
  findOne = async (user_id) => {
    const find = await debit_credit_alc.findOne({
      where: {
        user_id: user_id,
      },

    });
    if (!find) {
      return false;
    }
    return find;
  };
  findAll = async () => {
    const find = await debit_credit_alc.findAll({
      include: {
        model: user,

        attributes: {
          // include: ["fullName", "role_id", "email", "phone_no"],
          exclude: [

            "password",
            "created_at",
            "updated_at",
            "roleId",
          ],
        },
      },
    });
    if (!find) {
      return false;
    }
    return find;
  };

  updateDue = async (payload, user_id) => {
    const find = await this.findOne(user_id);
    if (!find) {
      return false;
    }
    const update = await debit_credit_alc.update(payload, {
      where: {
        user_id: user_id,
      },
    });
    if (!update) {
      return false;
    }
    const findUpdated = await this.findOne(user_id);
    return findUpdated;
  };

  deleteByUserId = async (user_id) => {
    await debit_credit_alc.destroy({ where: { user_id: user_id }, force: true })
    return true
  }
}
module.exports = new D_C_Repository();
