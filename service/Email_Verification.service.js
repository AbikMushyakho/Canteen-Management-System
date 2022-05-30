const Email_Verification_Repository = require("../repository/email_verification.repository");

class Email_Verification_Service {
    add = async (payload) => {
        const find = await Email_Verification_Repository.findByEmail(payload.email);
        if (find) {
            const UpdateData = {
                token: payload.token,
                expired: false
            }
            const Updated = Email_Verification_Repository.updateToken(UpdateData, payload.email);
            if (!Updated) throw new Error("User by this email found but not updated");

            return Updated;

        }
        const add_new_token = await Email_Verification_Repository.add(payload);
        if (!add_new_token) throw new Error("New user token not saved");
        return add_new_token;

    }

    findByEmail = async (email) => {
        const FoundEmail = await Email_Verification_Repository.findByEmail(email);
        if (!FoundEmail) throw new Error("User by this email not found");
        return FoundEmail
    }
    updateToken = async (data, email) => {
        const find = await Email_Verification_Repository.findByEmail(email);
        if (!find) throw new Error("User by this email not found");
        const UpdatedToken = await Email_Verification_Repository.updateToken(data, email);
        if (!UpdatedToken) throw new Error("Not Updated");
        return UpdatedToken;
    }

}
module.exports = new Email_Verification_Service();