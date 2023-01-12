const bcrypt = require("bcrypt");
const generateUserToken = require("../jwtToken/Jwt.config");
const UserRepo = require("../repository/user.repository");
const UserRoleRepo = require("../repository/user_role.repository");
const RoleRepository = require("../repository/role.repository");
const nodemailer = require("nodemailer")
// const SMTPConnection = require("nodemailer/lib/smtp-connection");
const Email_VerificationService = require("./Email_Verification.service");
require('dotenv').config()

class UserService {
  //register user
  register = async (payload) => {
    const find = await UserRepo.findByEmail(payload.email);
    if (find)
      throw new Error(`User with email ${payload.email} already exists`);
    //hashing password
    const email = payload.email;
    const password = payload.password;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    payload.password = hashPassword;
    const saved = await UserRepo.register(payload);
    if (!saved) throw new Error("Unable to register at this time!!!");
    //if available auto assign role as user
    const data = {
      user_id: saved.id,
      role_id: 2,
    };
    await UserRoleRepo.addUserRole(data);
    let URL = `${process.env.DEPLOY_URL}/verifyEmail?email=${email}`;
    let seMail = await this.SENDMAIL(email, URL);
    if (seMail) {
      return true;
    } else {
      return false;
    }
  };
  SENDMAIL = async (email, URL) => {
    var mailer = {
      pool: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
    };
    let transporter = nodemailer.createTransport(mailer);
    console.log("SMTP Configured");
    const messages = {
      from: process.env.EMAIL, // sender address
      // to: email,
      to: email,
      subject: "Verification ✔", // Subject line
      text: "Email Verification", // plain text body
      html: `<b>Click on this link to be verified:</b>
      <a href='${URL}'>${URL}</a>`, // html body
    };
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    console.log("Sending Mail");
    const info = await transporter.sendMail(messages);
    if (info) {
      console.log("message send success");
      return true;
    }
    return false;
  };
  // Verify registered email
  verify_Registered_Email = async (email) => {
    const find = await UserRepo.findByEmail(email);
    if (!find) throw new Error("User with this email not found");
    const data = {
      verified: true,
    };
    const updateToVerified = await UserRepo.updateByEmail(data, email);
    if (!updateToVerified) throw new Error("User not updated to verified");
    return true;
  };
  //login user by checking password
  login = async (payload) => {
    const _user = await UserRepo.login(payload);
    if (!_user)
      throw new Error("Not Registered Yet?, Or your email is invalid!!");
    if (!_user.verified)
      throw new Error(
        "Email not verified!!!. Please check your registered email to get verified"
      );
    const _Role = await RoleRepository.findById(_user.user_role.role_id);
    if (!_Role) throw new Error("Sorry, No roles are assigned for you!!");
    if (_user && _user.email === payload.email) {
      const pwMatch = bcrypt.compareSync(payload.password, _user.password);
      if (!pwMatch) throw new Error("Invalid Password");
      const generate = {
        id: _user.id,
        full_name: _user.full_name,
        email: _user.email,
        role_id: _Role.id,
        role_name: _Role.role_name,
      };
      const token = generateUserToken(generate);
      return { generate, token };
    } else {
      throw new Error("Email not matched");
    }
  };
  changePassword = async (user_id, payload) => {
    const _user = await UserRepo.findById(user_id);
    if (!_user) throw new Error("No Such User");
    const email = _user.email;
    const User = await UserRepo.findByEmail(email);
    const check_password = bcrypt.compareSync(
      payload.old_password,
      User.password
    );
    if (!check_password) throw new Error("Old password not matched");
    if (check_password) {
      const compare_new = bcrypt.compareSync(
        payload.new_password,
        User.password
      );
      if (compare_new)
        throw new Error("Password already used, so choose new one");
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(payload.new_password, salt);
      const data = {
        password: hashPassword,
      };
      const updated = await UserRepo.updateUser(data, user_id);
      return updated;
    }
  };
  //update user
  updateUser = async (id, payload, token) => {
    if (payload.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(payload.password, salt);
      payload.password = hashPassword;
    }
    const user_id = parseInt(id);
    const findAdminOrUser = await UserRoleRepo.findByUserId(token.id);
    const Role = await RoleRepository.findById(findAdminOrUser.role_id);

    if (user_id == token.id || Role.role_name == "Admin") {
      const updated = await UserRepo.updateUser(payload, id);
      if (!updated) {
        return false;
      }
      return updated;
    } else {
      throw new Error("Only admin has access of updating other users!!");
    }
  };
  recoverPassword = async (payload) => {
    const email = payload.email;
    const FoundUser = await UserRepo.findByEmail(email);
    if (!FoundUser) throw new Error("User by this email not found!");
    const check_password = bcrypt.compareSync(
      payload.password,
      FoundUser.password
    );
    if (check_password)
      throw new Error("Same as previous, please use a new password!!");
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(payload.password, salt);
    const data = {
      password: hashPassword,
    };
    const UpdatePassword = await UserRepo.updateByEmail(data, email);
    if (!UpdatePassword) throw new Error("Password not updated");
    return true;
  };
  // find by email
  findByEmail = async (email) => {
    const UserByEmail = await UserRepo.findByEmail(email);
    if (!UserByEmail) throw new Error("User by email not found");
    const user = {
      full_name: UserByEmail.full_name,
      phone_no: UserByEmail.phone_no,
      email: UserByEmail.email,
    };
    return user;
  };
  // sendEmail
  sendEmail = async (email) => {
    const UserByEmail = await UserRepo.findByEmail(email);
    if (!UserByEmail) throw new Error("User by email not found");
    // hashing Email
    const salt = bcrypt.genSaltSync(10);
    const hashEmail = bcrypt.hashSync(UserByEmail.email, salt);
    const URL = `${process.env.DEPLOY_URL}/changePassword?email=${email}&code=${hashEmail}`;
    const VerificationData = {
      email: UserByEmail.email,
      token: hashEmail,
    };
    const AddVerificationData = await Email_VerificationService.add(
      VerificationData
    );
    if (!AddVerificationData)
      throw new Error(
        "You cannot change because your data not saved, so reload the login place and try again"
      );
    let seMail = await this.SENDMAIL(email, URL);
    if (seMail) {
      return true;
    } else {
      return false;
    }
  };
  // send = async (transporter, email, URL) => {
  //   let info = await transporter.sendMail({
  //     from: process.env.EMAIL, // sender address
  //     // to: email,
  //     to: 'trobajoixareu-4648@yopmail.com',
  //     subject: "Verification ✔", // Subject line
  //     text: "Email Verification", // plain text body
  //     html: `<b>Click on this link to be verified:</b>
  //   <a href='${URL}'>${URL}</a>`, // html body
  //   });
  //   if (info) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }

  //find all users
  findAll = async () => {
    const find = await UserRepo.findAll();
    if (!find) {
      return false;
    }
    return find;
  };
  findByRoleId = async (id) => {
    const findAssignedRoles = await UserRoleRepo.findByRoleId(id);
    const Users = [];
    for (let i = 0; i < findAssignedRoles.length; i++) {
      const UserRoles = findAssignedRoles[i];
      const findUser = await UserRepo.findById(UserRoles.user_id);
      Users.push(findUser);
    }
    const Total_Users = Users.length;
    return { Users, Total_Users };
  };
  //find student by id
  findById = async (id) => {
    let userData = await UserRepo.findById(id);
    if (!userData) throw new Error("User not registered");
    const _Role = await RoleRepository.findById(userData.user_role.role_id);
    if (!_Role) throw new Error("Sorry, No roles are assigned for you!!");
    const ReturnData = {
      id: userData.id,
      full_name: userData.full_name,
      email: userData.email,
      gender: userData.gender,
      phone_no: userData.phone_no,
      address: userData.address,
      role_id: _Role.role_id,
      role_name: _Role.role_name,
    };

    return ReturnData;
  };
  //delete student by id
  deleteById = async (id) => {
    const deleteUser = await UserRepo.deleteById(id);
    if (!deleteUser) {
      return false;
    }
    return true;
  };
}
module.exports = new UserService();
