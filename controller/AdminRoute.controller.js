const ApiError = require("../errorHandler/ApiError");
const fs = require("fs");
const UserController = require("./User.controller");
const SuccessResponse = require("../utils/globalResponse");
class AdminRouteController {
    //checking
    demo = async (req, res, next) => {

        console.log("Client started");
        // res.sendFile(path.join(__dirname, "/starter.html"));
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/home/demo.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    /* User route start */
    authorization = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/index.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    routes = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/routes.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    privileges = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/privilege.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    add_privileges = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/add_privilege.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    modules = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/modules.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    accesses = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/accesses.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    add_access = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/add_access.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    roles = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/authorization/roles.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    //login page
    login = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/login_signup/login.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    recover_password = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/login_signup/recover_password.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    //register page
    register = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/login_signup/register.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    //starter page
    starter = async (req, res, next) => {

        try {
            res.writeHead(200);
            fs.readFile("./Public/views/home/starter.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    //add user by admin page
    addUser = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/user/addUser.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    //All Users page
    allUsers = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/user/allUsers.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    updateUser = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/user/updateUser.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    assignRole = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/user/assignRole.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    /* User route end */

    /* Order route start */
    allOrders = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/order/allOrders.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    orderDetails = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/order/orderDetails.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    /* Order route end */

    /* Food route start */
    allFoods = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/food/allFoods.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    addFood = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/food/addFood.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    editFood = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/food/editFood.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    allCategories = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/category/allCategories.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }

    }
    addCategory = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/category/addCategory.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    categoryDetails = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/category/categoryDetails.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    editCategory = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/category/editCategory.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    allCredits = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/credit/allCredits.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    payments = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/credit/payments.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    notifications = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/views/notifications/notification.html", null, function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write("File not found");
                } else {
                    res.write(data);
                }
                res.end();
            });
        } catch (error) {
            next(ApiError.BadRequest(error));
        }
    }
    logout = async (req, res, next) => {
        try {
            res.clearCookie("jwt");
            return SuccessResponse(res, 200, "Logout successful")
        } catch (error) {
            next(ApiError.BadRequest(error));

        }
    }
}
module.exports = new AdminRouteController();