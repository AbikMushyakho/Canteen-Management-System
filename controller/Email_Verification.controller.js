const ApiError = require("../errorHandler/ApiError");
const Email_Verification_Service = require("../service/Email_Verification.service");
const UserService = require("../service/User.service");
const SuccessResponse = require("../utils/globalResponse");

class Email_Verification_Controller {
    findByEmail = async (req, res, next) => {
        const payload = req.body;

        try {
            const checkUserAccount = await UserService.findByEmail(payload.email);
            if (!checkUserAccount) throw new Error("User Account not exists")
            const find = await Email_Verification_Service.findByEmail(payload.email)
            if (find) {
                return SuccessResponse(res, 200, "Found Users token", find)
            } else {
                next(ApiError.BadRequest("Not found"));
            }
        } catch (error) {
            next(ApiError.BadRequest(error.message));
        }
    }
}
module.exports = new Email_Verification_Controller();