const { food_items } = require("../lib/DatabaseConnection");
const fs = require("fs/promises");

class FoodRepository {
  //adding new food items into database
  addItem = async (payload) => {
    const save = await food_items.create(payload);

    if (!save) {
      return false; //if not added then return false
    }
    return save; //if added then return saved item
  };
  //finding one food by id
  findById = async (id) => {
    const find = await food_items.findOne({
      where: {
        id: id,
      },

    });
    if (!find) {
      return false; //if not found then return false
    }
    return find; //if found then return found item
  };
  findByName = async (name) => {
    const find = await food_items.findOne({
      where: {
        item_name: name,
      },

    });
    if (!find) {
      return false; //if not found then return false
    }
    return find; //if found then return found item
  };
  findAll = async () => {
    const Food_Items = await food_items.findAll({

    });
    if (!Food_Items) {
      return false;
    }
    const Total_items = Food_Items.length;

    return { Total_items, Food_Items };
  };
  //find by category
  findByCategoryId = async (id) => {
    const Food_Items = await food_items.findAll({
      where: {
        category_id: id,
      },

    });
    return Food_Items;
  };

  updateItemById = async (data, id) => {
    //finding item by it
    const find = await this.findById(id);
    if (!find) {
      return false; //if not found then return false
    }

    //else update found item
    const updateItem = await food_items.update(data, {
      where: {
        id: id,
      },
    });
    if (!updateItem) {
      return false; //if not updated then return false
    }
    //else find the updated item
    const updatedItem = await this.findById(id);
    //returning updated item
    return updatedItem;
  };
  updateItemByName = async (data, name) => {
    //finding item by name
    const find = await this.findByName(name);
    if (!find) {
      return false; //if not found then return false
    }
    //else update found item
    const updateItem = await food_items.update(data, {
      where: {
        item_name: name,
      },
    });
    if (!updateItem) {
      return false; //if not updated then return false
    }
    //else find the updated item
    const updatedItem = await this.findByName(name);
    //returning updated item
    return updatedItem;
  };

  deleteById = async (id) => {
    //checking if the item is available or not
    const find = await this.findById(id);
    if (!find) {
      return false; //if item not found then return false
    }

    await fs.rm(`Public${find.food_image}`); //  removing image using filesystem(fs)

    //if found then delete the item
    const deleteItem = await food_items.destroy({ where: { id: id } });
    if (!deleteItem) {
      return false; //if not deleted then return false
    }
    return true; //if  deleted then return true
  };

  deleteByName = async (name) => {
    //find item by name
    const find = await this.findByName(name);
    if (!find) {
      return false; //if item not found then return false
    }
    //checking if the item have image or not
    if (find.food_image) {
      await fs.rm(find.food_image); // if found then removing image using filesystem(fs)
    }
    //if found then delete the item
    const deleteItem = await food_items.destroy({ where: { name: name } });
    if (!deleteItem) {
      return false; //if not deleted then return false
    }
    return true; //if  deleted then return true
  };
}
module.exports = new FoodRepository();
