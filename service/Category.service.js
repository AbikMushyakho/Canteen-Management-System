const CategoryRepository = require("../repository/category.repository");
const FoodRepository = require("../repository/food.repository");
class CategoryService {
  addCategory = async (payload) => {
    const ifExists = await CategoryRepository.findByName(payload.name);
    if (ifExists) throw new Error(` Category by name ${payload.name} already exists`)
    const save = await CategoryRepository.addCategory(payload);
    if (!save) {
      return false;
    }
    return save;
  };
  //finding one food by id
  findById = async (id) => {
    const Category = await CategoryRepository.findById(id);
    if (!Category) throw new Error("Category not found");
    const Food_Items = await FoodRepository.findByCategoryId(id);
    return { Category, Food_Items };
  };
  //finding by name
  findByName = async (name) => {
    const Category = await CategoryRepository.findByName(name);
    if (!Category) throw new Error(`Category by name ${name} not found`);
    const Food_Items = await FoodRepository.findByCategoryId(Category.id);
    return { Category, Food_Items };
  };
  findAll = async () => {
    const _Category = await CategoryRepository.findAll();
    const Total_Category = _Category.length;
    return { Total_Category, _Category };
  };

  updateById = async (data, id) => {
    //finding item by it
    const find = await CategoryRepository.findById(id);
    if (!find) throw new Error("Category not found");
    //else updated found item
    const updated = await CategoryRepository.updateById(data, id);
    if (!updated) {
      return false; //if not updated then return false
    }
    return updated;
  };
  updateByName = async (data, name) => {
    //finding item by name
    const find = await CategoryRepository.findByName(name);
    if (!find) throw new Error("Category not found");
    //else updated found item
    const updated = await CategoryRepository.updateByName(data, name);
    if (!updated) {
      return false; //if not updated then return false
    }
    return updated;
  };

  deleteById = async (id) => {
    //checking if the item is available or not
    const PreviousCategory = await CategoryRepository.findById(id);
    if (!PreviousCategory) throw new Error("Category not found");

    //checking Category has food items or not
    const findFoods = await FoodRepository.findByCategoryId(id);
    if (findFoods.length !== 0) throw new Error("Contains food items, So change or remove them to delete this category")
    //if found then delete the item
    const deleteItem = await CategoryRepository.deleteById(id);
    if (!deleteItem) throw new Error("item not deleted");
    return true; //if  deleted then return true
  };

  deleteByName = async (name) => {
    //find item by name
    const PreviousCategory = await CategoryRepository.findByName(name);
    if (!PreviousCategory)
      throw new Error(`Category by name ${name} not found`);

    //if found then delete the item
    const deleteItem = await CategoryRepository.deleteByName(
      PreviousCategory,
      name
    );
    if (!deleteItem) {
      return false; //if not deleted then return false
    }
    return true; //if  deleted then return true
  };
}
module.exports = new CategoryService();
