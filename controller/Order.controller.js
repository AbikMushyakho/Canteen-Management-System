const ApiError = require("../errorHandler/ApiError");
const OrderService = require("../service/Order.service");
const SuccessResponse = require("../utils/globalResponse");
class OrderController {
  addOrder = async (req, res, next) => {
    try {
      const io = req.app.get("io");

      const payload = req.body;
      const token = req.user;
      const save_order = await OrderService.addList(payload, token, io);
      if (!save_order) {
        return next(ApiError.BadRequest("Order not registered"));
      }
      // const userName = req.user.full_name;
      // save_order.full_name = userName;
      // io.emit("orderNotification", userName);
      // const dataToDisplay = {
      //   FoodName: save_order.food_name,
      //   ordered_time: save_order.ordered_time,
      //   TotalBill: save_order.total_bill,
      // };
      // const data = {
      //   user_name: userName,

      // }
      return SuccessResponse(res, 201, "Item ordered successfully");
    } catch (err) {
      return next(ApiError.BadRequest(err.message));
    }
  };
  updateOrderByUser = async (req, res, next) => {
    try {
      const payload = req.body;
      const { id } = req.params;
      const findPrevOrder = await OrderService.findById(id);
      if (!findPrevOrder) {
        return next(ApiError.BadRequest("Previous order not found"));
      }
      if (req.user.id !== findPrevOrder.user_id) {
        return next(ApiError.BadRequest("You can only update your order"));
      }
      const updatedOrder = await OrderService.updateOrderByUser(payload, id);
      if (!updatedOrder) {
        return next(ApiError.BadRequest("Order not updated"));
      }

      return SuccessResponse(
        res,
        200,
        "Order updated Successfully",
        updatedOrder
      );
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };
  updateOrderByAdmin = async (req, res, next) => {
    try {
      const io = req.app.get("io");
      const payload = req.body;
      const { id } = req.params;
      const updatedOrder = await OrderService.updateOrderByAdmin(io, payload, id);
      if (!updatedOrder) {
        return next(ApiError.BadRequest("Not updated"));
      }
      return SuccessResponse(
        res,
        200,
        "Order updated Successfully",
        updatedOrder
      );
    } catch (error) {
      return next(ApiError.BadRequest(error.message));
    }
  };

  getAllOrders = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const role_name = req.user.role_name

      const allOrders = await OrderService.findAllOrder(user_id, role_name);
      if (!allOrders) {
        return next(ApiError.BadRequest("No any orders"));
      }
      return SuccessResponse(res, 200, "List of All Orders", allOrders);
    } catch (err) {
      return next(ApiError.InternalServerErr(err.message));
    }
  };
  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const find = await OrderService.findById(id);
      if (find) {
        return SuccessResponse(
          res,
          200,
          `Single Order of ${find.user.full_name}`,
          find
        );
      }
      if (!find) {
        return next(ApiError.BadRequest("Order Not found"));
      }
    } catch (err) {
      return next(ApiError.BadRequest(err.message));
    }
  };
  deleteById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      // const token = req.user;
      const role_name = req.user.role_name;
      const deleteOrder = await OrderService.deleteById(role_name, userId, id);
      if (!deleteOrder) {
        return next(ApiError.InternalServerErr("order not found"));
      }
      if (deleteOrder) {
        return SuccessResponse(res, 200, "Order Deleted Successfully");
      }
    } catch (err) {
      return next(ApiError.InternalServerErr(err.message));
    }
  };
}
module.exports = new OrderController();
