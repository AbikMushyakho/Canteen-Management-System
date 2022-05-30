
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
            "targets": [1, 2],

        }],
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
                    icon: 'info',
                    title: 'Token_expired',
                    text: "Please login to have access",
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
function LoadTable() {

    $.ajax({
        url: '/module/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var action = ''
                    $.each(response.data, function (key, value) {
                        action = '<a onclick="Update(' + value.id + ')" class=" btn btn-outline-info btn-sm">Update</a>'
                        tbl.row.add([
                            value.id,
                            value.module_name,
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
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}
function Add_new() {
    Swal.fire({
        title: 'Add new module',
        html: `<label for="module_name" class="col col-md-4">Module Name</label> <input class="col col-md-6 mb-4" type="text" id="module_name" name="module_name" placeholder= "Enter module name">
        `,
        showConfirmButton: true,
        confirmButtonText: 'Add',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            let module_name = $("#module_name").val();
            if (!module_name) {
                Swal.fire({
                    title: 'Invalid input',
                    text: 'module_name is required'
                })
            }
            else {
                module_name = module_name.toUpperCase();
                Add_New_Module(module_name);
            }
        } else if (result.isDismissed) {
            console.log("Cancelled")
        }
    })
}
function Add_New_Module(module_name) {
    const data = {
        module_name: module_name
    }
    $.ajax({
        url: '/module/add',
        type: 'POST',
        data: data,
        success: function (response) {
            if (response.status) {
                Swal.fire(
                    {
                        title: 'Success',
                        text: `${response.message}`,
                        icon: 'success',
                        showConfirmButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        } else {
                            window.location.reload();
                        }
                    });

            } else {
                Swal.fire('Problem in adding', `${response.message}`, 'warning');

            }
        },
        error: function (response) {
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });

}
function Update(id) {
    Swal.fire({
        title: 'Are you sure',
        text: 'You want to update???',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            FindModule(id);
        }
        else if (result.isDismissed) {
            console.log("Cancelled")
        }
    })
}
function FindModule(id) {
    $.ajax({
        url: '/module/find/' + id + '',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                Swal.fire({
                    title: 'Update Route',
                    html: `<label for="p_module_name" class="col col-md-4">Previous module name</label>
                    <input id="p_module_name" value="${response.data.module_name}" class="col col-md-6 mb-4" disabled>
                    <label for="n_module_name" class="col col-md-4">New endpoint</label>
                    <input id="n_module_name" class="col col-md-6" placeholder="Enter new module name">
                    `,
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Update'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const module_name = $("#n_module_name").val();
                        if (module_name == '') {

                            Swal.fire('Invalid input', 'Must provide new module_name', 'warning')
                        }
                        else {
                            UpdateModule(module_name, id);

                        }
                    }
                    else {
                        console.log("Cancelled")
                    }
                })
            }
            else {
                Swal.fire('Error', `${response.message}`, 'warning')
            }
        }
        , error: function (response) {
            Swal.fire('Error', `${response.message}`, 'warning')
        }

    })
}
function UpdateModule(module_name, id) {
    const module_n = module_name.toUpperCase();
    const data = {
        module_name: module_n
    }
    $.ajax({
        url: '/module/update/' + id + '',
        type: 'PUT',
        data: data,
        success: function (response) {
            if (response.status) {
                Swal.fire({
                    title: 'Success',
                    text: `${response.message}`,
                    icon: 'success',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                    else {
                        window.location.reload();
                    }
                })
            } else {
                Swal.fire('Update Error', `${response.message}`, 'warning')
            }
        },
        error: function (response) {
            Swal.fire(' Error', `${response.message}`, 'error')

        }
    })
}
