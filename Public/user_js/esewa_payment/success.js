var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var Reference_Code = getParameterByName('refId');
var ProductId = getParameterByName('oid');
var Amount = getParameterByName('amt');
var checked_user_id;

$(function () {
    $(".refId").text(Reference_Code);
    $(".oid").text(ProductId);
    $(".amount").text(`Rs. ${Amount}`);
    CheckUser();
});
function CheckUser() {
    debugger
    $.ajax({
        url: '/user/read',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                checked_user_id = response.data.id;
                if (response.data.role_name == "Admin" | "Staff") {
                    $("#header").load("/views/utils/header.html");
                    $("#aside").load("/views/utils/aside.html");
                    $("#footer").load("/views/utils/footer.html");
                    Order();
                } else {
                    $("#header").load("/user_views/utils/header.html");
                    $("#aside").load("/user_views/utils/aside.html");
                    $("#footer").load("/user_views/utils/footer.html");
                    Order();
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'MESSAGE',
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
function Order() {
    const data = JSON.parse(localStorage.getItem("new-order"));
    console.log(data);
    if (!data) {

    } else {
        PaymentHistory();
        $.ajax({
            url: '/order/add',
            type: 'POST',
            data: data,
            success: function (response) {
                if (response.status) {
                    Toast.fire({
                        icon: 'success',
                        animation: true,
                        title: `${response.message}`
                    })
                    localStorage.removeItem("new-order");

                } else {
                    Swal.fire('Error', `${response.message}`, 'error');
                }
            },
            error: function (response) {
                Swal.fire('Error', `${response.message}`, 'error');
            }
        })
    }

}
function PaymentHistory() {
    // /payment/esewa/pay
    const data = {
        user_id: checked_user_id,
        pay_amount: Amount,
        reference_code: Reference_Code
    }
    $.ajax({
        url: '/payment/esewa/pay',
        type: 'POST',
        data: data,
        success: function (response) {
            console.log(response)
            if (response.status) {
                Toast.fire({
                    icon: 'success',
                    animation: true,
                    title: `${response.message}`
                })

            } else {
                Swal.fire('Saving Transaction History Error', `${response.message}`, 'info');
            }
        },
        error: function (response) {
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })

}