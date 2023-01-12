
$(document).ready(() => {
    // $("#messages").hide();
})
var socket;
// const socketUrl = 'https://canteen-management-system-abik.herokuapp.com/';
const socketUrl="https://canteen.abik.com.np/";
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
var html = ''
// socket.emit('order', data)
socket.on('order_notification', (data) => {
    debugger
    let notificationCount = $(".notificationCount").text();
    notificationCount = parseInt(notificationCount)
    notificationCount = notificationCount + 1;
    $(".notificationCount").text(notificationCount);

    const notification = data.notification;
    const order = data.order_details;


    html = `  <a onclick= "NotificationDetails(${order.id}) "  class="dropdown-item bg-image hover-overlay">
    <div class="media">
        <img src="${order.food_item.food_image}" alt="Food Image"
            class="img-size-50 mr-3 img-circle">
        <div class="media-body">
            <h3 class="dropdown-item-title">
                ${order.user.full_name}
                <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
            </h3>
            <p class="text-sm">${notification.content}</p>
             <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> ${order.ordered_time}</p>
        </div>
    </div>
    </a>
    <div class="dropdown-divider"></div>`
    $('#order_notification').prepend(html);
})


function NotificationDetails(order_id) {
    localStorage.setItem('order_id', order_id)
    window.location.href = "/order/details"
}
socket.on('esewa_payment_notification', (data) => {
    console.log(data);
    let notificationCount = $(".notificationCount").text();
    notificationCount = parseInt(notificationCount)
    notificationCount = notificationCount + 1;
    $(".notificationCount").text(notificationCount);
    html = `<a onclick= "PaymentNotification(${data.user_id}) "  class="dropdown-item">
    <div class="media">
        <div class="media-body">
            <h3 class="dropdown-item-title">
              Payment Received
                <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
            </h3>
            <p class="text-sm">You received an amount of Rs.${data.paid_amount} from ${data.user_name} through esewa</p>
        </div>
    </div>
    </a>
    <div class="dropdown-divider"></div>`
    $('#order_notification').prepend(html);
})