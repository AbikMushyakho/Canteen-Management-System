const Payment_History_Repository = require("../repository/payment_histroy.repository");
const D_C_Repository = require("../repository/d&c.repository");
class Payment_History_Service {
    add = async (io, id, payload) => {
        let payment_history = {
            user_id: id,
            previous_amount: 0,
            advance_amount: 0,
            remaining_amount: 0,
            paid_amount: payload.pay_amount,
            reference_code: payload.reference_code,
            status: "success"
        }
        const find_user = await D_C_Repository.findOne(id);
        if (find_user) {
            payment_history.previous_amount = find_user.total_credit_amount;
            payment_history.remaining_amount = find_user.total_credit_amount;
            payment_history.advance_amount = find_user.advance_amount;
            const save = await Payment_History_Repository.add(payment_history);
            if (!save) {
                return false;
            }
            const findSaved = await Payment_History_Repository.findById(save.id);
            if (findSaved) {
                const payment_notification_user = {
                    user_name: findSaved.user.full_name,
                    user_id: findSaved.user_id,
                    paid_amount: findSaved.paid_amount,
                }
                io.emit("esewa_payment_notification", payment_notification_user);
                return findSaved;
            }

        }
        else {
            const save = await Payment_History_Repository.add(payment_history);
            if (!save) throw new Error("Payment history not saved")
            const findSaved = await Payment_History_Repository.findById(save.id);
            if (findSaved) {
                const payment_notification_user = {
                    user_name: findSaved.user.full_name,
                    user_id: findSaved.user_id,
                    paid_amount: findSaved.paid_amount,
                }
                io.emit("esewa_payment_notification", payment_notification_user);
                return findSaved;
            }
            return findSaved;
        }


    }
    findByUserId = async (user_id) => {

        const find = await Payment_History_Repository.findByUserId(user_id);

        return find;
    }
    findByCode = async (code) => {
        const find = await Payment_History_Repository.findByReferenceCode(code);
        if (!find) {
            return false
        }
        return find;
    }
    findAll = async () => {
        const find = await Payment_History_Repository.findAll();
        if (!find) {
            return false
        }
        return find;
    }
}
module.exports = new Payment_History_Service();