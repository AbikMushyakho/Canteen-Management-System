const ApiError = require("../errorHandler/ApiError");
const NotificationService = require("../service/Notifications.service");
const SuccessResponse = require("../utils/globalResponse");
class NotificationController {
    add = async (req, res, next) => {
        try {
            const payload = {
                title: req.body.title,
                content: req.body.content,
                user_id: req.user.id
            }
            const saved = await NotificationService.add(payload);
            if (!saved) {
                next(ApiError.BadRequest("Notification not saved"))
            }
            return SuccessResponse(res, 201, "Notification saved successfully", saved)
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    };
    findById = async (req, res, next) => {
        const { id } = req.params;
        try {
            const Notifications = await NotificationService.findById(id);
            if (!Notifications) {
                next(ApiError.BadRequest("No notification found by this id"))
            }
            else {
                return SuccessResponse(res, 200, "Notification by id found successfully", Notifications)

            }
        } catch (error) {
            next(ApiError.BadRequest(error.message))

        }
    };
    findByUserId = async (req, res, next) => {
        const user_id = req.user.id;
        try {
            const Notifications = await NotificationService.findByUserId(user_id);
            if (!Notifications) {
                next(ApiError.BadRequest("No notification found of this user"))
            }
            else {
                return SuccessResponse(res, 200, "Notification by user_token found successfully", Notifications)
            }
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    };
    findAll = async (req, res, next) => {
        // if(req.user.role_name !== "Admin")
        try {
            const Notifications = await NotificationService.findAll();
            if (!Notifications) {
                next(ApiError.BadRequest("No notification found"))
            }
            else {
                return SuccessResponse(res, 200, "Notifications found successfully", Notifications)
            }
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    };
}
module.exports = new NotificationController();
