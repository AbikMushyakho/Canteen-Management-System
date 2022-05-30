const { email_verification } = require("../lib/DatabaseConnection")

class Email_Verification_Repository {
    add = async (payload) => {
        const add_new_token = await email_verification.create(payload);
        if (!add_new_token) {
            return false;
        }
        else {
            return add_new_token;
        }
    }

    findByEmail = async (email) => {
        const FoundEmail = await email_verification.findOne({
            where: {
                email: email
            },

        })
        if (!FoundEmail) {
            return false;
        }
        else {
            return FoundEmail;
        }
    }
    updateToken = async (data, email) => {
        const UpdatedToken = await email_verification.update(data, {
            where: {
                email: email
            }
        })
        if (!UpdatedToken) {
            return false;
        } else {
            const Updated = await this.findByEmail(email);
            return Updated;
        }
    }

}
module.exports = new Email_Verification_Repository();