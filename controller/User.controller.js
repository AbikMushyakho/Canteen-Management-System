const UserService = require("../service/User.service.js");
const ApiErr = require("../errorHandler/ApiError");
const SuccessResponse = require("../utils/globalResponse.js");
const bcrypt = require("bcrypt");
const Email_VerificationService = require("../service/Email_Verification.service.js");

class UserController {
  register = async (req, res, next) => {
    try {
      const payload = req.body;
      const saveUser = await UserService.register(payload);
      if (!saveUser) {
        throw new Error("User not saved");
      }
      return SuccessResponse(res, 201, "User created successfully");
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  verify_Registered_Email = async (req, res, next) => {
    try {
      const { email } = req.query;
      const verify_Registered_Email = await UserService.verify_Registered_Email(email);
      if (!verify_Registered_Email) throw new Error("Email not verified, try again!!!");
      res.send(` <div style="text-align:center;">
      <h1>Canteen Management System</h1>
      <h2>Verification Success</h2>
      <span>Congratulation your email has been verified successfully.Now you can have access by clicking on this link:</span> <br>
      <a href="/login">Login with verified email.</a>
      </div> `)
    } catch (error) {
      next(ApiErr.BadRequest(error.message))
    }
  }
  login = async (req, res, next) => {
    try {
      const payload = req.body;
      const LoginUser = await UserService.login(payload);
      if (LoginUser) {
        const { token } = LoginUser.token
        // Expires in 1 hour
        const expiresIn = new Date(Date.now() + 900000)

        //setting http only browser cookie
        res.cookie('jwt', token, {
          expires: expiresIn,
          httpOnly: true
        })

        return SuccessResponse(res, 200, "Login Successful", LoginUser.generate);
      } else {
        return next(ApiErr.BadRequest("Invalid email or password"));
      }
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  Email_Verification = async (req, res, next) => {

    const { code, email } = req.query;
    try {
      const checked = await Email_VerificationService.findByEmail(email);
      if (!checked) throw new Error("Verification token of this email not found");
      if (checked.expired == true) throw new Error("Token has already been expired");
      if (checked.token !== code) throw new Error('Token not matched');
      const update = {
        expired: true
      }
      const make_expired = await Email_VerificationService.updateToken(update, email);
      if (!make_expired) throw new Error("Token not expired")
      res.send(` <div style="text-align:center;">
      <h1>Canteen Management System</h1>
      <h2>Verification success.</h2>
      <span>Click on this link to add new password:</span> <br>
      <a href="/create_new_password?email=${checked.email}">create_new_password</a>
      </div> `)
      // res.redirect('/login')

    } catch (error) {
      return next(ApiErr.BadRequest(error.message));
    }
  }
  recoverPassword = async (req, res, next) => {
    const payload = req.body;
    try {
      const changedPassword = await UserService.recoverPassword(payload);
      if (changedPassword) {
        return SuccessResponse(res, 201, "New password saved successfully")
      }
      return next(ApiErr.BadRequest("Password not changed"));
    } catch (error) {
      return next(ApiErr.BadRequest(error.message));
    }
  }
  changePassword = async (req, res, next) => {
    const user_id = req.user.id;
    const payload = req.body;
    try {
      const changedPassword = await UserService.changePassword(user_id, payload);
      if (changedPassword) {
        return SuccessResponse(res, 200, "Password Changed Successfully")
      }
      return next(ApiErr.BadRequest("Password not changed"));
    } catch (error) {
      return next(ApiErr.BadRequest(error.message));
    }
  }
  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const token = req.user;
      // const file = req.file;
      // if (file) {
      //   payload.ppSizeImage = file.path;
      // }
      const update = await UserService.updateUser(id, payload, token);
      if (update) {
        return SuccessResponse(res, 200, "Update Successful", update);
      }
    } catch (ex) {
      return next(ApiErr.BadRequest(ex.message));
    }
  };
  // find by email
  findByEmail = async (req, res, next) => {
    try {
      const email = req.body.email;
      const UserByEmail = await UserService.findByEmail(email);
      return SuccessResponse(res, 200, "User by email found successfully", UserByEmail);
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  // Send Email
  sendEmail = async (req, res, next) => {
    try {
      const email = req.body.email;
      const SendEmailToUser = UserService.sendEmail(email);
      return SuccessResponse(res, 200, "An conformation mail has been sent to your Email address, check it to continue", SendEmailToUser);

    } catch (err) {
      next(ApiErr.BadRequest(err.message))
    }
  }

  findAll = async (req, res, next) => {
    try {
      const allUser = await UserService.findAll();
      return SuccessResponse(res, 200, "List of all users", allUser);
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  findByRoleId = async (req, res, next) => {
    try {
      const { id } = req.params
      const allUser = await UserService.findByRoleId(id);
      return SuccessResponse(res, 200, "List of all users by role", allUser);
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  findByToken = async (req, res, next) => {
    try {
      const { id } = req.user
      const find = await UserService.findById(id);
      return SuccessResponse(res, 200, "Found User", find);
    } catch (err) {
      return next(ApiErr.BadRequest(err.message));
    }
  };
  findById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const foundUser = await UserService.findById(id);
      if (!foundUser) {
        return next(ApiErr.BadRequest("User Not found"));
      }
      if (foundUser) {
        return SuccessResponse(
          res,
          200,
          "Single user found successfully",
          foundUser
        );
      }
    } catch (error) {
      return next(ApiErr.BadRequest(error.message));
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleteUser = await UserService.deleteById(id);
      if (!deleteUser) {
        return next(ApiErr.BadRequest("User Not found"));
      }
      if (deleteUser) {
        return SuccessResponse(res, 200, "User deleted successfully");
      }
    } catch (error) {
      return next(ApiErr.BadRequest(error.message));
    }
  };
}
module.exports = new UserController();
