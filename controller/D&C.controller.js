const ApiError = require("../errorHandler/ApiError");
const SuccessResponse = require("../utils/globalResponse");
const D_C_Service = require("../service/D&C.service");

class D_C_Controller {
  advance = async (req, res, next) => {
    try {
      const payload = req.body;
      const added_advance = await D_C_Service.add(payload);
      if (!added_advance) {
        next(ApiError.BadRequest("Amount not Paid"));
      }
      return SuccessResponse(res, 200, `Advance amount of Rs ${payload.advance_amount} saved successfully`, added_advance);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  findOne = async (req, res, next) => {
    const user_id = req.user.id;
    try {
      const find = await D_C_Service.findOne(user_id);
      if (find) {
        return SuccessResponse(res, 200, "Debit and credit a user", find);
      }

    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  findAll = async (req, res, next) => {
    try {
      const find = await D_C_Service.findAll();
      if (!find) {
        next(ApiError.BadRequest("Not found"));
      }
      return SuccessResponse(res, 200, "All Debit and Credits", find);
    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  pay = async (req, res, next) => {
    try {
      if (req.user.role_name == "Admin" || req.user.role_name == "Staff") {
        const io = req.app.get("io");

        const payload = req.body;
        const user_id = payload.user_id;
        const payAmount = await D_C_Service.pay(io, payload, user_id);
        if (!payAmount) {
          next(ApiError.BadRequest("Amount not Paid"));
        }
        return SuccessResponse(res, 200, "Amount paid successfully", payAmount);
      } else {
        throw new Error("Only admin can pay")
      }
      // const { user_id } = req.params;
      // const user_id = req.user.id;

    } catch (error) {
      next(ApiError.BadRequest(error.message));
    }
  };
  deleteByUserId = async (req, res, next) => {
    try {
      //getting user id
      const { id } = req.params;
      const deleted = await D_C_Service.deleteByUserId(id)
      if (!deleted) {
        next(ApiError.BadRequest("Credit Account not Deleted"));
      }
      return SuccessResponse(res, 200, "User Credit Account deleted successfully");
    } catch (error) {
      next(ApiError.BadRequest(error.message));

    }
  }
}
module.exports = new D_C_Controller();
