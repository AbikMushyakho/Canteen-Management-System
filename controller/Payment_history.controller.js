const Payment_History_Service = require("../service/Payment_history.service")
const ApiErr = require("../errorHandler/ApiError");
const SuccessResponse = require("../utils/globalResponse");
class Payment_History_Controller {
    esewaPay = async (req, res, next) => {
        const io = req.app.get("io");
        const { id } = req.user;
        const payload = req.body;
        try {
            const saved = await Payment_History_Service.add(io, id, payload)

            if (saved) {
                const payment_notification_user = {
                    user_name: saved.user.full_name,
                    user_id: saved.user_id,
                    paid_amount: saved.paid_amount,
                }
                io.emit("payment_notification", payment_notification_user);
                return SuccessResponse(res, 201, `Transaction history saved`, saved);
            }
        } catch (ex) {
            next(ApiErr.BadRequest(ex.message));
        }
    };
    findByUserToken = async (req, res, next) => {
        const { id } = req.user;
        try {
            const found = await Payment_History_Service.findByUserId(id);
            return SuccessResponse(res, 200, `All Payment history of user_id: ${id}`, found);
        } catch (ex) {
            next(ApiErr.BadRequest(ex.message));
        }
    };
    findByUserId = async (req, res, next) => {
        const { id } = req.params;
        try {
            const found = await Payment_History_Service.findByUserId(id);
            if (!found) throw new Error("Payment history of this user not found");
            return SuccessResponse(res, 200, `All Payment history of user_id: ${id}`, found);
        } catch (ex) {
            next(ApiErr.BadRequest(ex.message));
        }
    };
    findByReferenceCode = async (req, res, next) => {
        const { code } = req.query;
        try {
            const found = await Payment_History_Service.findByCode(code);

            if (!found) {
                return next(ApiErr.BadRequest("Payment history not found"));
            }

            return SuccessResponse(
                res,
                200,
                `Payment history of reference code: ${code}`,
                found
            );
        } catch (ex) {
            return next(ApiErr.BadRequest(ex.message));
        }
    };
    findAll = async (req, res, next) => {
        try {
            const found = await Payment_History_Service.findAll();
            if (!found) {
                return next(ApiErr.BadRequest("Payment history not found"));
            }

            return SuccessResponse(res, 200, `All Payment Histories`, found);
        } catch (ex) {
            return next(ApiErr.BadRequest(ex.message));
        }
    };
}
module.exports = new Payment_History_Controller();