const CategoryService = require("../service/Category.service");
const ApiErr = require("../errorHandler/ApiError");
const SuccessResponse = require("../utils/globalResponse");
class CategoryController {
  addCategory = async (req, res, next) => {
    const user = req.user;
    if (user.role_name !== 'Admin') throw new Error("Only admin can add category")
    const payload = req.body;
    try {
      const add = await CategoryService.addCategory(payload);
      if (!add) throw new Error("Category not saved");
      return SuccessResponse(res, 201, "Category Created SuccessFully", add);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  //finding one food by id
  findById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const Category = await CategoryService.findById(id);
      if (!Category) throw new Error("Category not found");
      return SuccessResponse(res, 200, `Category by id: ${id}`, Category);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  //finding by name
  findByName = async (req, res, next) => {
    const { name } = req.query;
    try {
      const Category = await CategoryService.findByName(name);
      if (!Category) throw new Error("Category not found");
      return SuccessResponse(res, 200, `Category by name: ${name}`, Category);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  findAll = async (req, res, next) => {
    try {
      const _Category = await CategoryService.findAll();
      return SuccessResponse(res, 200, "List of all categories", _Category);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };

  updateById = async (req, res, next) => {
    const role = req.user.role_name;
    if (role !== "Admin") throw new Error("Only admin can update category")
    const data = req.body;
    const { id } = req.params;
    try {
      const updatedCategory = await CategoryService.updateById(data, id);
      if (!updatedCategory) throw new Error("Category not updated");
      return SuccessResponse(
        res,
        200,
        "Category updated successfully ",
        updatedCategory
      );
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  updateByName = async (req, res, next) => {
    const payload = req.body;
    const { name } = req.query;
    try {
      const updatedCategory = await CategoryService.updateByName(payload, name);
      if (!updatedCategory) throw new Error("Category not updated");
      return SuccessResponse(
        res,
        200,
        "Category updated successfully ",
        updatedCategory
      );
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };

  deleteById = async (req, res, next) => {
    const user = req.user;
    if (user.role_name !== 'Admin') throw new Error("Only admin can delete category")

    const { id } = req.params;
    try {
      const deleted = await CategoryService.deleteById(id);
      if (!deleted) throw new Error("item not deleted");
      return SuccessResponse(res, 200, "Category deleted successfully ");
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };

  deleteByName = async (req, res, next) => {
    const { name } = req.query;
    try {
      const deleted = await CategoryService.deleteByName(name);
      if (!deleted) throw new Error(`${name} not deleted`);
      return SuccessResponse(res, 200, `${name}  deleted successfully `);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
}
module.exports = new CategoryController();
