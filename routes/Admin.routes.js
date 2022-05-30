const AdminRouteController = require("../controller/AdminRoute.controller")
const auth = require("../jwtToken/auth");

module.exports = (app) => {
    app.route("/authorization").get(
        AdminRouteController.authorization
    )
    app.route("/routes").get(
        AdminRouteController.routes
    )
    app.route("/privileges").get(
        AdminRouteController.privileges
    )
    app.route("/add_privilege").get(
        AdminRouteController.add_privileges
    )
    app.route("/modules").get(
        AdminRouteController.modules
    )
    app.route("/accesses").get(
        AdminRouteController.accesses
    )
    app.route("/add_access").get(
        AdminRouteController.add_access
    )
    app.route("/roles").get(
        AdminRouteController.roles
    )
    app.route("/login").get(
        AdminRouteController.login
    )
    app.route("/register").get(
        AdminRouteController.register
    )
    app.route("/create_new_password").get(
        AdminRouteController.recover_password
    )
    app.route("/logout").get(


        AdminRouteController.logout
    )
    // User controlling Routes start
    app.route("/starter").get(


        AdminRouteController.starter
    )
    app.route("/addUser").get(

        AdminRouteController.addUser
    )
    app.route("/allUsers").get(

        AdminRouteController.allUsers
    )
    app.route("/updateUser").get(

        AdminRouteController.updateUser
    )
    app.route("/assignRole").get(

        AdminRouteController.assignRole
    )
    // User controlling Routes end

    // Order controlling Routes start
    app.route("/allOrders").get(

        AdminRouteController.allOrders
    )
    app.route("/order/details").get(

        AdminRouteController.orderDetails
    )
    // Order controlling Routes end

    // Food controlling Routes start
    app.route("/allFoods").get(

        AdminRouteController.allFoods
    )
    app.route("/addFood").get(

        AdminRouteController.addFood
    )
    app.route("/editFood").get(

        AdminRouteController.editFood
    )

    app.route("/allCategories").get(

        AdminRouteController.allCategories
    )
    app.route("/addCategory").get(

        AdminRouteController.addCategory
    )
    app.route("/categoryDetails").get(

        AdminRouteController.categoryDetails
    )
    app.route("/editCategory").get(

        AdminRouteController.editCategory
    )
    // Food controlling Routes end


    // Debit and Credit Account start
    app.route("/allCredits").get(

        AdminRouteController.allCredits
    )
    app.route("/payments").get(

        AdminRouteController.payments
    )

    // Debit and Credit Account end
    // Notifications
    app.route("/notifications").get(

        AdminRouteController.notifications
    )

}