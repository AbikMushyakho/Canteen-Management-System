$(function () {
    CheckUser()
    ListRoles()
    ListUsers()

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
            // else if (!response.status) 
        },
        error: function (response) {

            return Swal.fire('Server error', "Server not started", 'error');
        }
    });

}
function ListUsers() {
    $.ajax({
        url: '/user/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
                // response = $.parseJSON(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var html = '';
                    $.each(response.data, function (key, value) {

                        html += '<option>' + value.full_name + '</option>';
                    });
                    $('.users').append(html);
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

function ListRoles() {
    $.ajax({
        url: '/role/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var html = '';
                    $.each(response.data, function (key, value) {

                        html += '<option>' + value.role_name + '</option>';
                    });
                    $('.roles').append(html);
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
$("#assignRole").click(function () {
    // alert("Assigning the role")
    const user_name = $('.users').val();
    const role_name = $('.roles').val();
    AssignRole(user_name, role_name)
})
//Assigning role by user name and role name
function AssignRole(user_name, role_name) {
    $.ajax({
        url: "/role/add/user",
        method: "post",
        dataType: "json",
        data: {
            user_name: user_name,
            role_name: role_name
        },
        success: function (response) {
            if (response.status) {

                Swal.fire(
                    {
                        icon: 'success',
                        Title: 'Assigned Successfully',
                        text: `${response.message}`,
                        showConfirmButton: true,
                        confirmButtonText: 'Users List'
                    }
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/allUsers'
                    }
                })
            }
            if (!response.status) {
                return Swal.fire("Error", response.message, "error");
            }
        },
        error: function (response) {
            return Swal.fire("Server error", "Server not started", "error");
        },
    });
}