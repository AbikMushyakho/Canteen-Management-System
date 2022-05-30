const ApiError = require("../errorHandler/ApiError");
const fs = require("fs")
class UserRouteController {

    /* User route start */


    //starter page
    starter = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/home/starter.html", null, function (error, data) {
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
    orders = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/order/orders.html", null, function (error, data) {
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
    credits = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/credit/credits.html", null, function (error, data) {
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
            fs.readFile("./Public/user_views/credit/payments.html", null, function (error, data) {
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
    home = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/home/home.html", null, function (error, data) {
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
    foods = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/home/foods.html", null, function (error, data) {
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
    profile = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/user/profile.html", null, function (error, data) {
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
    secrete = async (req, res, next) => {
        try {
            // console.log(`This is the saved cookie: ${req.cookies.jwt}`);
            // const user = req.user;
            // console.log(user)
            res.writeHead(200);
            fs.readFile("./Public/user_views/home/secrete.html", null, function (error, data) {
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
    payment_success = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/esewa_payment/payment_success.html", null, function (error, data) {
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
    payment_failure = async (req, res, next) => {
        try {
            res.writeHead(200);
            fs.readFile("./Public/user_views/esewa_payment/payment_failure.html", null, function (error, data) {
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
}
module.exports = new UserRouteController();