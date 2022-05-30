var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});

var tbl = $("#example1").DataTable
    ({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        order: [[0, "asc"]]
    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
    CheckUser()
    Load()
});
function Load() {
    $.ajax({
        url: '/debit_credit/findAll',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var _full_name = ''
                    var _action = ''
                    $.each(response.data, function (key, value) {
                        _action = `<a onclick="pay(${value.user.id})" class="btn btn-warning btn-sm">Pay amount</a> <a onclick="DeleteCredit(${value.user.id})" class="btn btn-outline-danger btn-sm">Delete</a>`
                        _full_name = `<a onclick="UserDetails(${value.user.id})" class="btn btn-info">${value.user.full_name}</a>`;
                        tbl.row.add([
                            key + 1,
                            _full_name,
                            // value.user.full_name,
                            value.user.phone_no,
                            value.advance_amount,
                            value.total_credit_amount,
                            _action
                            // 'edit'
                        ]).draw(false);
                        value++;
                    })
                }

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
            // else if (!response.status) 
        },
        error: function (response) {

            return Swal.fire('Server error', "Server not started", 'error');
        }
    });

}

async function pay(id) {
    const { value: pay_amount } = await Swal.fire({
        title: 'Enter Amount',
        input: 'number',
        inputPlaceholder: 'Amount',
        showCancelButton: true,
        confirmButtonText: 'Pay'
    })
    if (pay_amount) {
        // const amount = parseInt(pay_amount)

        $.ajax({
            url: '/debit_credit/pay',
            type: 'POST',
            // headers: { "Authorization": 'Bearer ' + token },
            data: {
                user_id: id,
                pay_amount: pay_amount
            },
            success: function (response) {
                // console.log(response);
                if (response.status) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${response.message}`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setInterval(() => {
                        window.location.href = '/allCredits'
                    }, 1500);
                }
                else if (!response.status) {
                    Swal.fire('Error', response.message, 'error');
                }

            },
            error: function (response) {
                return Swal.fire('Error', response, 'error');

            }
        })
    }

}
function UserDetails(user_id) {
    $.ajax({
        url: '/user/find/' + user_id + '',
        type: 'GET',

        success: function (response) {
            if (response.status) {
                const data = response.data;
                Swal.fire({
                    title: '<strong> <u>User Details</u></strong>',
                    icon: 'info',
                    html:
                        'Full Name <b>' + data.full_name + '</b></br> ' +
                        'Email: <b>' + data.email + '</b></br> ' +
                        'Phone Number: <b>' + data.phone_no + '</b></br> ' +
                        'Address: <b>' + data.address + '</b></br> ',
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
            else {
                Swal.fire('Error', response.message, 'error');

            }
        },
        error: function (response) {
            Swal.fire('Error', response, 'error');

        }
    })

}

function DeleteCredit(user_id) {
    Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete: ${user_id}!!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const id = parseInt(user_id);
            $.ajax({
                url: '/debit_credit/delete/' + id + '',
                type: 'DELETE',
                // headers: { "Authorization": 'Bearer ' + token },
                success: function (response) {
                    console.log(response);
                    if (!response.status) {
                        Swal.fire('Error', response.message, 'error');

                    } else {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `${response.message}`,
                            showConfirmButton: true,
                            timer: 1500
                        })

                        setInterval(() => {
                            window.location.href = '/allCredits'
                        }, 1500);
                    }
                },
                error: function (response) {
                    Swal.fire('Error', response.message, 'error');
                }
            })

        }
    })
}