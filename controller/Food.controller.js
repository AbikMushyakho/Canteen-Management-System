const ApiError = require("../errorHandler/ApiError");
const FoodService = require("../service/Food.service");
const SuccessResponse = require("../utils/globalResponse");
const fs = require("fs/promises");

class FoodController {
  create = async (req, res, next) => {
    const payload = req.body;
    try {
      const paths = req.file.path;
      let Image_path = paths.replace("Public", ""); //Public
      payload.food_image = Image_path;
      if (!payload.food_image) throw new Error("Must provide food image");
      //saving new food item
      const addFood = await FoodService.create(payload);
      if (!addFood) {
        // if not saved then return message
        return next(ApiError.BadRequest("Item not saved"));
      }
      return SuccessResponse(res, 201, "New item added successfully", addFood);
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  findAll = async (req, res, next) => {
    try {
      //finding all Food item
      const allItem = await FoodService.findAll();
      if (!allItem) {
        // if not found return error message
        return next(ApiError.BadRequest("Item not found"));
      }
      return SuccessResponse(res, 200, "List of All Food Items", allItem);
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  //find by id
  findById = async (req, res, next) => {
    try {
      //getting id from url/params
      const { id } = req.params;
      //finding item by id
      const findOneItem = await FoodService.findById(id);
      if (!findOneItem) {
        // if not found error message
        return next(ApiError.BadRequest("Item not found"));
      }
      return SuccessResponse(
        // else return success response
        res,
        200,
        "Single Item found successfully",
        findOneItem
      );
    } catch (error) {
      return next(error);
    }
  };
  //find by category name
  findByCategory = async (req, res, next) => {
    try {
      //getting id from url/params
      const { category } = req.query;
      //finding item by id
      const find = await FoodService.findByCategory(category);
      if (!find) {
        // if not found error message
        return next(ApiError.BadRequest("Item not found"));
      }
      return SuccessResponse(
        // else return success response
        res,
        200,
        `All items of category ${category} found successfully`,
        find
      );
    } catch (error) {
      return next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      //getting id & data from url/params & body
      const { id } = req.params;
      const newData = req.body;
      //if admin sends new image to update then deleting old one
      const find = await FoodService.findById(id);
      if (!find) {
        return next(ApiError.BadRequest("item not found"));
      }
      if (req.file) {
        if (req.file.path !== find.food_image) {
          await fs.rm(find.food_image);
          newData.food_image = req.file.path;
        }
      }
      //updating food by id
      const updateData = await FoodService.updateFoodById(newData, id);
      if (!updateData) {
        //if not updated return error message
        return next(ApiError.BadRequest("item not updated"));
      }
      //else return success response
      return SuccessResponse(res, 200, "Item Updated Successfully", updateData);
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  delete = async (req, res, next) => {
    try {
      //getting id  from url/params
      const { id } = req.params;
      const deleteData = await FoodService.deleteById(id);
      if (!deleteData) {
        //if not deleted the return error message
        return next(ApiError.BadRequest("Item not Found"));
      }
      //else return success response
      return SuccessResponse(res, 200, "Item Deleted Successfully");
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
}
module.exports = new FoodController();
