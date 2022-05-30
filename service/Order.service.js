const { todayDate, todayTime } = require("../others/dateGenerator");
const FoodRepository = require("../repository/food.repository");
const NotificationRepository = require("../repository/notifications.repository");
const OrderRepository = require("../repository/order.repository");
const BillService = require("./Bill.service");
const RoleService = require("./Role.service");

class OrderService {
  addList = async (payload, token, io) => {
    //getting user data from token
    payload.user_id = token.id;
    payload.ordered_date = todayDate();
    payload.ordered_time = todayTime();
    //Finding the ordered Food Item
    const FoodItem = await FoodRepository.findById(payload.food_item_id);
    //if not found returns error
    if (!FoodItem) throw new Error("Food not found");

    if (FoodItem.available == false)
      throw new Error("Ordered food item is not available at this time");
    //if item is found but its available is false then returns error

    //multiplying food pice with quantity to generate total bill
    const FoodItemPrice = parseInt(FoodItem.price);
    payload.total_bill = FoodItemPrice * payload.quantity;
    //initially the order status be pending
    payload.order_status = "pending";
    //saving
    const newOrder = await OrderRepository.addOrder(payload);
    if (!newOrder) {
      return false;
    }
    const order = await OrderRepository.findById(newOrder.id);
    const notification_data = {
      title: "Order",
      content: `Food item '${order.food_item.item_name}' of quantity '${order.quantity}' and total bill is Rs. ${order.total_bill}`,
      user_id: order.user_id,
      order_id: order.id
    }
    const saved_Notification = await NotificationRepository.add(notification_data);
    if (saved_Notification) {
      const send_notification_data = {
        notification: saved_Notification,
        order_details: order
      }
      // console.log(send_notification_data)
      io.emit("order_notification", send_notification_data);

    }

    return order;
  };
  //finding all order according to role
  findAllOrder = async (user_id, role_name) => {

    // const found_User_Role = await UserRoleRepository.findByUserId(user_id);
    // const role = await RoleService.findById(role_id);
    // if (!role) throw new Error("Role not found");
    // if role name matches admin and staff then return all records
    if (role_name == "Admin" || role_name == "Staff") {
      const allOrders = await OrderRepository.findAllOrder();
      if (allOrders.length == 0) {
        return 'No any orders '
      }
      return allOrders;
    }
    //  else return single user orders only
    else {
      const findOne = await OrderRepository.findAllOrderOfSingleUser(user_id);
      if (findOne.length == 0) {
        return 'No any orders of this user'
      }
      return findOne;
    }
  };

  //find order by order id
  findById = async (id) => {
    const find = await OrderRepository.findById(id);
    if (!find) {
      return false;
    }
    return find;
  };
  //find order by date
  // searchByDate = async (data) => {
  //   const startDate = data.startDate;
  //   const endDate = data.endDate;

  //   const find = await order_lists.findAll({
  //     where: {
  //       from: {
  //         $between: [startDate, endDate],
  //       },
  //     },
  //   });
  //   return find;
  // };

  //update order by user id
  updateOrderByUser = async (data, id) => {
    // if user order not found then return false
    const findPrev = await OrderRepository.findById(id);
    if (!findPrev) throw new Error("Order not found to update");
    // if the user provides order status then return false
    if (data.order_status) {
      throw new Error("Order status can only be changed by admin ");
    }
    //if the admin has already update the order status then user cannot edit
    if (findPrev.order_status !== "pending")
      throw new Error("Order has already placed to deliver");
    //if the user wants to change food item name then must provide food quantity to generate total bill
    if (data.food_item_id) {
      if (data.food_item_id !== findPrev.food_item_id) {
        const findFood = await FoodRepository.findById(data.food_item_id);
        if (!findFood) {
          return false;
        }
        const NewFoodPrice = parseInt(findFood.price);
        if (!data.quantity)
          throw new Error(
            "If you are updating previous food item to new item then quantity is required"
          );
        data.total_bill = NewFoodPrice * data.quantity;
        const updateOrder = await OrderRepository.updateOrderById(data, id);
        if (!updateOrder) {
          return false;
        }
        return updateOrder;
        // data.total_bill = findPrev.quantity * NewFoodPrice;
      }
    }
    // if the food is same and the quantity is different then update
    const findFood = await FoodRepository.findById(findPrev.food_item_id);
    if (!findFood) throw new Error("Food item not found");
    const FoodPrice = parseInt(findFood.price);
    data.total_bill = data.quantity * FoodPrice;

    const updateOrder = await OrderRepository.updateOrderById(data, id);
    if (!updateOrder) {
      return false;
    }
    return updateOrder;
  };
  //update food status by admin
  updateOrderByAdmin = async (io, payload, id) => {
    const findOrder = await OrderRepository.findById(id);
    if (!findOrder) throw new Error("Order not found");
    if (findOrder.order_status == "delivered")
      throw new Error("Order has been already delivered");
    const updatedOrder = await OrderRepository.updateOrderByAdmin(payload, id);
    const data = { order: updatedOrder, time: payload.complete_within }
    if (!updatedOrder) {
      return false;
    }
    else if (updatedOrder.order_status == 'pending' || updatedOrder.order_status == 'cooking' || updatedOrder.order_status == 'on_road') {
      io.emit("order_update_notification", data);
      return updatedOrder
    }
    else {
      //parsing string total bill amount to integer
      let amount = parseInt(updatedOrder.total_bill);
      //creating object of bill data and generating bill
      let billData = {
        user_id: updatedOrder.user_id,
        food_name: updatedOrder.food_item.item_name,
        date_of_order: updatedOrder.ordered_date,
        quantity: updatedOrder.quantity,
        amount: amount,
        payment_method: updatedOrder.payment_method,
      };
      //saving bill
      await BillService.generateBill(billData);
      io.emit("order_update_notification", data);
      return updatedOrder;
    }
  };
  //delete orders ordered by users
  deleteById = async (role_name, user_id, id) => {
    const find = await OrderRepository.findById(id);
    if (!find) {
      return false;
    }
    if (find.user_id == user_id || role_name == "Admin") {
      const deleted = await OrderRepository.deleteById(id);
      // const data = await order_lists.destroy({ truncate: true });
      if (!deleted) {
        return false;
      }
      return true;
    }
    else {
      throw new Error("You can only delete your order");
    }
  };
}
module.exports = new OrderService();
