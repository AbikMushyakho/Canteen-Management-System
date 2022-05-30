
// $(document).ready(() => {
//     $("#messages").hide();
// })
var socket;
var html = ''
var time = 0
var orderNotifications = []
const socketUrl = 'https://canteen-management-system-abik.herokuapp.com/';
// const socketUrl = 'http://localhost:5000/';

socket = io(socketUrl, {
    reconnection: true,
    // transportOptions: {
    //     polling: {
    //         extraHeaders: {
    //             'user_id': user.id
    //         }
    //     }
    // },
    secure: true
})

// socket.emit('order', data)
socket.on('order_update_notification', (data) => {
    let notificationCount = $("#notificationCount").text();
    notificationCount = parseInt(notificationCount)
    notificationCount = notificationCount + 1;
    $("#notificationCount").text(notificationCount);

    if (data.time) {
        time = data.time;
    }
    const order = data.order;
    orderNotifications.push(data);
    // console.log(data);

    html = `  <a onclick= "NotificationDetails(${order.id}) "  class="dropdown-item">
    <div class="media">
        <img src="${order.food_item.food_image}" alt="Food Image"
            class="img-size-50 mr-3 img-circle">
        <div class="media-body">
            <h3 class="dropdown-item-title">
               ${order.food_item.item_name}
                <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
            </h3>
            <p class="text-sm">Your order is on ${order.order_status}</p>
             <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i>Completes with in ${time}</p>
        </div>
    </div>
    </a>
    <div class="dropdown-divider"></div>`
    $('#order_notification').prepend(html);
})

console.log("Socket page")
function NotificationDetails(order_id) {
    const result = orderNotifications.filter(filteredOrder => filteredOrder.order.id == order_id);
    console.log(result)
    const order_data = result[0];
    Swal.fire({
        title: '<strong> <u>Notification Details</u></strong>',
        icon: 'info',
        html:
            'Ordered Item: <b>' + order_data.order.food_item.item_name + '</b></br> ' +
            'Quantity: <b>' + order_data.order.quantity + '</b></br> ' +
            'Total Bill: <b>' + order_data.order.total_bill + '</b></br> ' +
            'Status: <b>' + order_data.order.order_status + '</b></br> ' +
            'Complete Within: <b>' + time + '</b></br> ',

        // '<a href="/userDetails">links</a> ' +
        // 'and other HTML tags',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
    })

}

socket.on('payment_notification', (data) => {
    let notificationCount = $("#notificationCount").text();
    notificationCount = parseInt(notificationCount)
    notificationCount = notificationCount + 1;
    $("#notificationCount").text(notificationCount);

    const user_id = data.user_id;
    orderNotifications.push(data);
    // console.log(data);

    html = `  <a onclick= "PaymentNotification(${user_id}) "  class="dropdown-item">
    <div class="media">
        <div class="media-body">
            <h3 class="dropdown-item-title">
              Payment Complete
                <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
            </h3>
            <p class="text-sm">You have successfully paid an amount of Rs.${data.paid_amount}.</p>
        </div>
    </div>
    </a>
    <div class="dropdown-divider"></div>`
    $('#order_notification').prepend(html);
})
function PaymentNotification(user_id) {
    const result = orderNotifications.filter(filteredOrder => filteredOrder.user_id == user_id);
    console.log(result)
    const payment_data = result[0];
    Swal.fire({
        title: '<strong> <u>Payment Details</u></strong>',
        icon: 'info',
        html:

            'Paid_Amount: <b>' + payment_data.paid_amount + '</b></br> ' +
            'New Remaining Amount: <b>' + payment_data.remaining_amount + '</b></br> ' +
            'Advance Amount: <b>' + payment_data.advance_amount + '</b></br> ',

        // '<a href="/userDetails">links</a> ' +
        // 'and other HTML tags',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
    })

}