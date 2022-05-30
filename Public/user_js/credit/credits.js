// var token = localStorage.getItem("token");
var user_id = localStorage.getItem("user_id");
var full_name = localStorage.getItem("full_name");
var role_name = localStorage.getItem("role_name");
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});
$(function () {
    $("#header").load("/user_views/utils/header.html");
    $("#aside").load("/user_views/utils/aside.html");
    $("#footer").load("/user_views/utils/footer.html");
    Load()
});

//load Advance amount credit amount
function Load() {
    $.ajax({
        url: '/debit_credit/user',
        type: 'GET',
        success: function (response) {
            if (response.status) {

                const advance_amount = response.data.advance_amount;
                const credit_amount = response.data.total_credit_amount;
                $('#advance_amount').text(`Rs. ${advance_amount}`)

                $('#credit_amount').text(`Rs. ${credit_amount}`)
            } else {
                Swal.fire('Message', `${response.message}`, 'info');
            }

        },
        error: function (response) {
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
    })
    //load Total paid amount amount
    $.ajax({
        url: '/payment/user',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },
        success: function (response) {

            if (response.status) {
                const paid_amounts = response.data.Total_Paid_Amount;
                $('#paid_amounts').text(`Rs. ${paid_amounts}`)
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
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
    //load credit bills
    $.ajax({
        url: '/bills/credit_bills',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                const credit_bills = response.data.TotalAmount;
                $('#credit_bills').text(`Rs. ${credit_bills}`)
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
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
    //load cash bills
    $.ajax({
        url: '/bills/cash_bills',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                const cash_bills = response.data.TotalAmount;
                $('#cash_bills').text(`Rs. ${cash_bills}`)
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
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
    // load total of both cash and credit bills
    $.ajax({
        url: '/bills/find/user',
        type: 'GET',
        success: function (response) {

            if (response.status) {
                const total_bills = response.data.TotalAmount;
                $('#total_bills').text(`Rs. ${total_bills}`)
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
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
}