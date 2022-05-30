var tbl = $("#example2").DataTable({
    lengthChange: true,
    scrollCollapse: true,
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    responsive: true,
    order: [[1, "desc"]],
    columnDefs: [{
        "orderable": false,
        "targets": [0, 2, 3, 4, 5],
    }],
})

$(function () {
    CheckUser()
    List();
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
function List() {

    $.ajax({
        url: '/notification/all',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var _action = ''
                    $.each(response.data, function (key, value) {

                        _action = '<a onclick="Details(' + value.order_id + ')"  class="btn btn-block btn-outline-primary btn-xs">Details</a>'
                        tbl.row.add([
                            key + 1,
                            value.order_id,
                            value.user.full_name,
                            value.title,
                            value.content,
                            _action,

                            // 'edit'
                        ]).draw(false);
                        value++;
                    });
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
function Details(order_id) {
    localStorage.setItem('order_id', order_id)
    window.location.href = "/order/details"

}

