
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});
var tbl = $("#example1").DataTable
    ({
        responsive: true,
        lengthChange: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        order: [[0, "desc"]],
        columnDefs: [{
            "orderable": false,
            "targets": [2, 4],

        }],
    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {

    CheckUser();
    LoadPrivilegeName();

});
$('#select_privilege').on('change', function () {
    const privilege = $("#select_privilege").val();
    if (privilege != null) {
        LoadTable(privilege);
    }
});
function LoadPrivilegeName() {
    $.ajax({
        url: '/privilege/all',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                // $('#select_privilege').text('');
                const data = response.data;
                if (Array.isArray(data)) {
                    {
                        const names = data.map((item) => item.privilege_name
                        );
                        const privileges = names.filter((item,
                            index) => names.indexOf(item) === index);
                        var html = ''
                        $.each(privileges, function (key, value) {
                            html += `<option value="${value}">${value}</option>`
                        })
                        $('#select_privilege').append(html)
                    }
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
function LoadTable(privilege) {
    $.ajax({
        url: '/privilege/findBy?name=' + privilege + '',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    tbl.clear().draw();
                    var action = ''
                    $.each(response.data, function (key, value) {
                        action = '<a onclick="Delete(' + value.id + ')" class="btn btn-outline-danger btn-sm">Delete</a>'
                        tbl.row.add([
                            value.id,
                            value.privilege_name,
                            value.route.endpoint,
                            value.route.method,
                            action
                        ]).draw(false);
                        value++;
                    })
                }

            }
            else if (!response.status) {
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
function Add_new() {

    window.location.href = '/add_privilege'
}
function Delete(id) {
    Swal.fire({
        title: 'Are you sure',
        text: `you want to delete???`,
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            AjaxDel(id);
        }
        else if (result.isDismissed) {
            console.log("Cancelled")
        }
    })

}
function AjaxDel(id) {
    $.ajax({
        url: '/privilege/find/' + id + '',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                DeletePrivilege(response.data.privilege_name, response.data.route.endpoint);
            }
            else {
                Swal.fire('Not found', response.message, 'warning')
            }
        },
        error: function (response) {
            Swal.fire('Error', response.message, 'warning')

        }
    })
}
function DeletePrivilege(name, endpoint) {
    const data = {
        endpoint: endpoint,
        privilege_name: name
    }
    $.ajax({
        url: '/privilege/delete',
        type: 'DELETE',
        data: data,
        success: function (response) {
            if (response.status) {
                Swal.fire({
                    title: 'Success',
                    text: response.message,
                    icon: 'success',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })

            }
            else {
                Swal.fire('Not found', response.message, 'warning')
            }
        },
        error: function (response) {
            Swal.fire('Error', response.message, 'warning')

        }
    })

}