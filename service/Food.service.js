const FoodRepository = require("../repository/food.repository");
const CategoryRepo = require("../repository/category.repository")
class FoodService {
  //creating new food
  create = async (payload) => {
    if (payload.quantity !== 0) {
      payload.available = true;
    }
    // checking is available or not
    const check = await this.findByName(payload.item_name);
    if (check) throw new Error("Item Already exists")
    const check_category = await CategoryRepo.findById(payload.category_id);
    if (!check_category) throw new Error(`${payload.category_id} category not found`)
    //saving
    const savedFood = await FoodRepository.addItem(payload);
    if (!savedFood) {
      return false; // if not saved then return false
    }
    return savedFood; //else return saved
  };
  findByName = async (name) => {
    //find item by name
    const found = await FoodRepository.findByName(name);
    if (!found) {
      return false; // if not found return false
    }
    return found; // else return found data
  };
  findById = async (id) => {
    //find item by id
    const found = await FoodRepository.findById(id);
    if (!found) {
      return false; // if not found return false
    }
    return found; // else return found data
  };
  findAll = async () => {
    //finding all Food item
    const find = FoodRepository.findAll();
    if (!find) {
      return false; // if not found return false
    }
    return find; // else return found data
  };
  //find by category name
  findByCategory = async (category) => {
    const find = await FoodRepository.findByCategory(category);
    if (!find) {
      return false;
    }
    return find;
  };
  updateFoodById = async (newData, id) => {
    //updating food item with new data
    const updatedItem = await FoodRepository.updateItemById(newData, id);
    if (!updatedItem) {
      return false; //not updated then return false
    }
    return updatedItem;
  };
  deleteById = async (id) => {
    //deleting item by id
    const deleteItem = await FoodRepository.deleteById(id);
    if (!deleteItem) {
      return false; // if not deleted return false;
    }
    return true; // else return true;
  };
  deleteByName = async (name) => {
    //deleting item by id
    const deleteItem = await FoodRepository.deleteByName(name);
    if (!deleteItem) {
      return false; // if not deleted return false;
    }
    return true; // else return true;
  };
}
module.exports = new FoodService();
