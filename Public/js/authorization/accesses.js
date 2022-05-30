
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
            "targets": [1, 3],

        }],
    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
    CheckUser()
    LoadRoles()
    // LoadTable()

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
function LoadRoles() {
    $.ajax({
        url: '/role/all',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                const data = response.data;

                var html = ''
                $.each(data, function (key, value) {
                    html += `<option value="${value.id}">${value.role_name}</option>`
                })
                $('#select_role').append(html)
            }
            else {
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
$('#select_role').on('change', function () {
    const role = $("#select_role").val();
    if (role != null) {
        LoadTable(role);
    }
});
function LoadTable(role_id) {
    // /access/findByRole /: id
    $.ajax({
        url: '/access/findByRole/' + role_id + '',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                const data = response.data.Accesses;
                if (Array.isArray(data)) {
                    tbl.clear().draw();
                    var action = ''
                    $.each(data, function (key, value) {
                        action = '<a onclick="Details(' + value.id + ')" class=" btn btn-outline-info btn-sm">Details</a>'
                        tbl.row.add([
                            value.id,
                            value.role.role_name,
                            value.module_model.module_name,
                            value.privilege.privilege_name,
                            action
                        ]).draw(false);
                        value++;
                    })
                }


            }
            else if (!response.status) {
                Swal.fire({
                    icon: 'info',
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
            // return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}
function Add_new() {
    window.location.href = '/add_access'
}

function Details(id) {
    alert(`Details of access_id:${id} coming soon...`)
}