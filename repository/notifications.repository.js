const {
    notification, user
} = require("../lib/DatabaseConnection");

class NotificationRepository {
    add = async (payload) => {
        try {
            const saved = await notification.create(payload);
            if (!saved) {
                return false
            }
            return saved;
        } catch (error) {
            return false;
        }
    };
    findById = async (id) => {
        const Notifications = await notification.findOne({
            where: { id },

        });
        return Notifications;
    };
    findByUserId = async (user_id) => {
        const Notifications = await notification.findAll({
            where: { user_id: user_id },


        });
        return Notifications;
    };
    findAll = async () => {
        const Notifications = await notification.findAll({
            include: {
                model: user,
                attributes: {
                    exclude: ["id", "password", "ppSizeImage"],
                },
            },

        });

        return Notifications;
    };
}
module.exports = new NotificationRepository();
