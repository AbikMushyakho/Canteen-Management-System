const NotificationRepository = require("../repository/notifications.repository");
class NotificationService {
    add = async (payload) => {
        try {
            const saved = await NotificationRepository.add(payload);
            if (!saved) {
                return false
            }
            return saved;
        } catch (error) {
            return false;
        }
    };
    findById = async (id) => {
        const Notifications = await NotificationRepository.findById(id);
        if (!Notifications) {
            throw new Error("No notification found by this id")
        }
        else {
            return Notifications;
        }
    };
    findByUserId = async (user_id) => {
        const Notifications = await NotificationRepository.findByUserId(user_id);
        if (!Notifications) {
            throw new Error("No notification found of this user")
        }
        else {
            return Notifications;
        }
    };
    findAll = async () => {
        const Notifications = await NotificationRepository.findAll();
        if (!Notifications) {
            throw new Error("No notification found of this user")
        }
        else {
            return Notifications;
        }
    };
}
module.exports = new NotificationService();
