const ApiErr = require("../errorHandler/ApiError");
const SuccessResponse = require("../utils/globalResponse");
const BillService = require("../service/Bill.service");
class BillController {
  generateBill = async (req, res, next) => {
    const payload = req.body;
    try {
      const generate = await BillService.generateBill(payload);
      if (generate) {
        return SuccessResponse(
          res,
          201,
          "Bill generated successfully",
          generate
        );
      }
    } catch (error) {
      next(ApiErr.BadRequest(error));
    }
  };
  CashBills = async (req, res, next) => {
    const { id } = req.user;
    try {
      const generate = await BillService.CashBills(id);
      if (!generate) throw new Error("No generated");
      return SuccessResponse(res, 201, "Your all cash bills", generate);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  CreditBills = async (req, res, next) => {
    const { id } = req.user;
    try {
      const generate = await BillService.CreditBills(id);
      if (!generate) throw new Error("No generated");
      return SuccessResponse(res, 201, "Your all credit bills", generate);
    } catch (error) {
      next(ApiErr.BadRequest(error.message));
    }
  };
  findByUserId = async (req, res, next) => {
    const { id } = req.user;
    try {
      const found = await BillService.findByUserId(id);
      if (found) {
        return SuccessResponse(res, 200, `All Bill of user_id: ${id}`, found);

      }

    } catch (ex) {
      next(ApiErr.BadRequest(ex.message));
    }
  };
  findByReferenceCode = async (req, res, next) => {
    const { code } = req.query;
    try {
      const found = await BillService.findByReferenceCode(code);

      if (!found) {
        return next(ApiErr.BadRequest("Bill not found"));
      }

      return SuccessResponse(
        res,
        200,
        `Found Bill of reference code: ${code}`,
        found
      );
    } catch (ex) {
      return next(ApiErr.BadRequest(ex.message));
    }
  };
  findAll = async (req, res, next) => {
    try {
      const found = await BillService.findAll(req.user.id);
      if (!found) {
        return next(ApiErr.BadRequest("Bill not found"));
      }

      return SuccessResponse(res, 200, `All Bills`, found);
    } catch (ex) {
      return next(ApiErr.BadRequest(ex.message));
    }
  };
  deleteByCode = async (req, res, next) => {
    const { code } = req.query;
    try {
      const deleteBill = await BillService.deleteByReferenceCode(code);
      if (deleteBill) {
        return SuccessResponse(res, 200, `Bill deleted successfully`);
      }
    } catch (err) {
      next(ApiErr.BadRequest(err));
    }
  };
}
module.exports = new BillController();
