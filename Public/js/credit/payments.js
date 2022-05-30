// var token = localStorage.getItem("token");
var user_id = '';
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});
var tbl = $("#example1").DataTable
    ({
        lengthChange: true,
        scrollCollapse: true,
        pageLength: 5,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        responsive: true,
        order: [[0, "desc"]],

    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
    CheckUser()
    LoadTable()
});
function CheckUser() {
    $.ajax({
        url: '/user/read',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                if (response.data.role_name !== "Admin" | "Staff") {
                    window.location.href = '/login'
                } else {
                    $("#header").load("/views/utils/header.html");
                    $("#aside").load("/views/utils/aside.html");
                    $("#footer").load("/views/utils/footer.html");
                }
            }
            else {
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

            return Swal.fire('Server error', `${response.message}`, 'error');
        }
    });


}
function LoadTable() {

    $.ajax({
        url: '/payment/all',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },
        success: function (response) {

            if (typeof (response) != 'object') {
                response = JSON.stringify(response);

            }
            if (response.status) {
                const data = response.data.Payments;
                var _full_name = ''
                var _status = ''
                if (Array.isArray(data)) {
                    $.each(data, function (key, value) {
                        _full_name = `<span onClick="UserDetails(${value.user_id})" class="user btn btn-info">${value.user.full_name}</span>`;
                        _status = `<span  class="badge badge-success">${value.status}</span>`;
                        tbl.row.add([
                            value.id,
                            value.date,
                            value.time,
                            value.reference_code,
                            _full_name,
                            // value.user.full_name,
                            value.advance_amount,
                            value.previous_amount,
                            value.paid_amount,
                            value.remaining_amount,
                            _status
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
async function UserDetails(user_id) {

    $.ajax({
        url: '/user/find/' + user_id + '',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },

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
                        '<i class="fa fa-thumbs-up"></i> Nice!',
                    confirmButtonAriaLabel: 'Thumbs up, great!',
                    cancelButtonText:
                        '<i class="fa fa-thumbs-down"></i>',
                    cancelButtonAriaLabel: 'Thumbs down'
                })
            }
            else {
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
            Swal.fire('Error', response, 'error');

        }
    })
}