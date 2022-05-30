const user_id = localStorage.getItem("user_id");
const full_name = localStorage.getItem("full_name");
const role_name = localStorage.getItem("role_name");

const order_id = localStorage.getItem('order_id');
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
$(function () {
    CheckUser();
    Load();
});
function CheckUser() {
    $.ajax({
        url: '/user/read',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                if (response.data.role_name !== "Admin" | "Staff") {
                    Swal.fire({
                        icon: 'error',
                        title: "Unauthorized Access",
                        text: "Must be admin to access this page",
                        showConfirmButton: true,
                        confirmButtonText: 'Login'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/login'
                        }
                    })
                }
                else {
                    $("#header").load("/views/utils/header.html");
                    $("#aside").load("/views/utils/aside.html");
                    $("#footer").load("/views/utils/footer.html");
                }
            } else if (!response.status) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Message',
                    text: `${response.message}`,
                    showConfirmButton: true,
                    confirmButtonText: "Login"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login'
                    }
                })

            }
        },
        error: function (response) {

            return Swal.fire('Server error', "Server not started", 'error');
        }
    });

}
function Load() {
    $('.role').text(role_name)
    $.ajax({
        url: '/order/find/' + order_id + '',
        type: 'GET',
        success: function (response) {

            if (response.status) {
                $('.Ordered_by').text(`${response.data.user.full_name}`)
                $('.Order_No').text(`${response.data.id}`)
                $('.Ordered_time').text(`${response.data.ordered_time}`)
                $('.Food_item').text(`${response.data.food_item.item_name}`)
                $('.Quantity').text(`${response.data.quantity}`)
                $('.Order_status').text(`${response.data.order_status}`)
                $('.Total_bill').text(`${response.data.total_bill}`)
                $('.Payment_method').text(`${response.data.payment_method}`)
                $("#order_status").val(`${response.data.order_status}`)
            }
            else if (!response.status) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Message',
                    text: `${response.message}`,
                    showConfirmButton: true,
                    confirmButtonText: "Login"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login'
                    }
                })
            }
        },
        error: function (response) {
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}
$('form').submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/order/update/admin/' + order_id + '',
        type: 'PUT',
        data: {
            order_status: $("#order_status").val(),
            complete_within: `${$("#time").val()} ${$("#time_duration").val()}`
        },
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {

                $("#time").val(''),
                    Toast.fire({
                        icon: "success",
                        title: `${response.message}`,
                    });
                setInterval(() => {
                    window.location.href = '/allOrders';

                }, 3000);
            }
            else if (!response.status) {
                Swal.fire("Error", response.message, "error");
                $("#order_status").val('select_status');


            }
        },
        error: function (response) {

            Swal.fire("Error", response, "error");

        }
    });

})
