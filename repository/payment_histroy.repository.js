const ReferralCodeGenerator = require("referral-code-generator");
const { user, payment_history } = require("../lib/DatabaseConnection");
const { todayDate, todayTime } = require("../others/dateGenerator")

class Payment_History_Repository {
    add = async (payload) => {
        payload.date = todayDate();
        payload.time = todayTime();
        if (!payload.reference_code) {
            const referenceCode = ReferralCodeGenerator.alphaNumeric("uppercase", 3, 3);
            payload.reference_code = referenceCode;

        }

        const created = await payment_history.create(payload);
        if (!created) {
            return false;
        }
        return created;
    };

    findByUserId = async (user_id) => {
        const Payments = await payment_history.findAll({
            where: {
                user_id: user_id,
            },
            include: {
                model: user,
                attributes: {
                    exclude: ["password", "id"],
                },
            },

        });
        // if (Payment.length == 0) {
        //     return false;
        // }
        const Total = Payments.map((payment) => parseFloat(payment.paid_amount));
        const Total_no_of_Payments = Payments.length;
        const Total_Paid_Amount = Total.reduce((p, c) => p + c, 0);
        return { Payments, Total_no_of_Payments, Total_Paid_Amount };
    };

    findByReferenceCode = async (code) => {
        try {
            const found = await payment_history.findOne({
                where: {
                    reference_code: code,
                },
                include: {
                    model: user,
                    attributes: {
                        exclude: ["password", "id"],
                    },
                },
            });
            if (!found) {
                return false
            }
            return found;
        } catch (error) {
            return false
        }
    };
    findById = async (id) => {
        const found = await payment_history.findOne({
            where: {
                id: id,
            },
            include: {
                model: user,
                attributes: {
                    exclude: ["password"],
                },
            },
        });
        if (!found) {
            return false
        }
        return found;
    }
    findAll = async () => {
        const Payments = await payment_history.findAll({
            include: {
                model: user,
                attributes: {
                    exclude: ["id", "password", "ppSizeImage"],
                },
            },

        });
        // if (Payments.length == 0) {
        //     return false;
        // }
        const Total = Payments.map((payment) => parseFloat(payment.paid_amount));
        const Total_no_of_Payments = Payments.length;
        const Total_Paid_Amounts = Total.reduce((p, c) => p + c, 0);
        return { Payments, Total_no_of_Payments, Total_Paid_Amounts };
    };
    deleteByReferenceCode = async (code) => {
        await payment_history.destroy({
            where: {
                reference_code: code,
            },
        });

        return true;
    };
}
module.exports = new Payment_History_Repository();
