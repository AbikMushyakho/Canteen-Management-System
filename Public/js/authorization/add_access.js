
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});


var privilege_list = $('.privilege').select2({
    theme: 'bootstrap4'
})
var module_list = $('.module_list').select2({
    theme: 'bootstrap4'
})
var role_list = $('.role_list').select2({
    theme: 'bootstrap4'
})


$(function () {


    CheckUser();
    LoadRoles();
    LoadModules();
    LoadPrivilegeName();

});
function LoadPrivilegeName() {
    $.ajax({
        url: '/privilege/all',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                const data = response.data;
                if (Array.isArray(data)) {
                    const names = data.map((item) => item.privilege_name
                    );
                    const privileges = names.filter((item,
                        index) => names.indexOf(item) === index);
                    // console.log(privileges);
                    var html = ''
                    $.each(privileges, function (key, value) {
                        html += `<option value="${value}">${value}</option>`
                    })
                    privilege_list.append(html)
                }
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
function LoadRoles() {
    $.ajax({
        url: '/role/all',
        type: 'GET',
        success: function (response) {

            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var html = ''
                    $.each(response.data, function (key, value) {
                        html += '<option value=' + value.id + '>' + value.role_name + '</option>'
                    })
                    role_list.append(html);
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
function LoadModules() {
    $.ajax({
        url: '/module/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var html = ''
                    $.each(response.data, function (key, value) {
                        html += '<option value=' + value.id + '>' + value.module_name + '</option>'
                    })
                    module_list.append(html);
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
function Add() {
    const role = role_list.val();
    const modules = module_list.val();
    const privileges = privilege_list.val();
    if (role == null) {
        Swal.fire({
            title: 'Invalid input',
            icon: 'warning',
            text: 'Role not selected'
        })
    }
    else if (modules.length == 0) {
        Swal.fire({
            title: 'Invalid input',
            icon: 'warning',
            text: 'Modules not selected'
        })
    }
    else if (privileges.length == 0) {
        Swal.fire({
            title: 'Invalid input',
            icon: 'warning',
            text: 'Privileges not selected'
        })
    } else {
        AddAccess(role, modules, privileges)
    }
    console.log(role, modules, privileges)

}
function AddAccess(role, modules, privileges) {

    const data = {
        role_id: role,
        module_id: modules,
        privilege_name: privileges
    }
    $.ajax({
        url: '/access/add',
        type: 'POST',
        data: data,
        success: function (response) {
            console.log(response);
            if (response.status) {
                Swal.fire(
                    {
                        title: 'Success',
                        text: `${response.message}`,
                        icon: 'success',
                        showConfirmButton: true,
                        showCancelButton: true,
                        cancelButtonText: "Back to Access list"
                    }
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                    else if (result.isDismissed) {
                        window.location.href = '/accesses'
                    }
                })


            } else {
                Swal.fire('Problem in adding', response.message, 'warning')
            }
        }
    })

}