const jwt = require("jsonwebtoken");
require("dotenv").config();

const ApiError = require("../errorHandler/ApiError");
const UserService = require("../service/User.service");
const fs = require("fs");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            next(ApiError.BadRequest("Token Expired, Please login!!"))
        }
        else {
            const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
            const user = verifyUser.sub;
            const gotUser = await UserService.findById(user.id);
            if (!gotUser) throw new Error("User with token not found")
            // gotUser.role_id = user.role_id;
            req.user = user;
            req.token = token;
            // console.log(gotUser)
            next()
        }
    } catch (error) {
        next(ApiError.BadRequest(error.message))

    }
}
module.exports = auth;