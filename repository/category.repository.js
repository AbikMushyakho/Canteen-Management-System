const { categories, food_items } = require("../lib/DatabaseConnection");
const foodRepository = require("./food.repository");

class CategoryRepository {
  addCategory = async (payload) => {
    const save = await categories.create(payload);
    if (!save) {
      return false;
    }
    return save;
  };

  findById = async (id) => {
    const Category = await categories.findOne({
      where: {
        id: id,
      },

    });
    if (!Category) {
      return false;
    }
    return Category;
  };

  findByName = async (name) => {
    const Category = await categories.findOne({
      where: {
        name: name,
      },

    });
    if (!Category) {
      return false;
    }
    return Category;
  };
  findAll = async () => {
    const _Category = await categories.findAll({

    });
    if (!_Category) {
      return false;
    }
    return _Category;
  };

  updateById = async (data, id) => {
    const find = await this.findById(id);
    if (!find) {
      return false;
    }
    const updateCategory = await categories.update(data, {
      where: {
        id: id,
      },
    });
    if (!updateCategory) {
      return false;
    }
    const updatedCategory = await this.findById(id);
    return updatedCategory;
  };
  updateByName = async (data, name) => {
    const find = await this.findByName(name);
    if (!find) {
      return false;
    }

    const updateCategory = await categories.update(data, {
      where: {
        name: name,
      },
    });
    if (!updateCategory) {
      return false;
    }
    return true;
  };

  deleteById = async (id) => {
    // checking food item having given category id
    // if exist then deleting all where category_id = id
    // const foods = await foodRepository.findByCategoryId(id);
    // if (foods != 0) {
    //   await food_items.destroy({ where: { category_id: id } });
    // }
    //deleting Category
    const deleteItem = await categories.destroy({ where: { id: id } });
    if (!deleteItem) {
      return false;
    }
    return true; //if  deleted then return true
  };

  deleteByName = async (PreviousCategory, name) => {
    // checking food item having previous category id
    // if exist then deleting all where category_id = PreviousCategory.id
    // const foods = await foodRepository.findByCategoryId(PreviousCategory.id);
    // if (foods != 0) {
    //   await food_items.destroy({ where: { category_id: PreviousCategory.id } });
    // }

    const deleteItem = await categories.destroy({ where: { name: name } });
    if (!deleteItem) {
      return false;
    }
    return true;
  };
}
module.exports = new CategoryRepository();
