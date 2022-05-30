
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
});
var duallistbox = $('.duallistbox').bootstrapDualListbox(
    {
        nonSelectedListLabel: 'Non-selected',
        selectedListLabel: 'Selected',
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
    }
)

$(function () {

    CheckUser()
    LoadRoutes()
    LoadPrivilegeName()

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
                    var html = ''
                    $.each(privileges, function (key, value) {
                        html += `<option value="${value}">${value}</option>`
                    })
                    $('#privilege_name').append(html)
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
        },
        error: function (response) {

            return Swal.fire('Server error', "Server not started", 'error');
        }
    });

}
function LoadRoutes() {
    $.ajax({
        url: '/route/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var html = ''
                    $.each(response.data, function (key, value) {
                        html += '<option value=' + value.id + '>' + value.endpoint + '</option>'
                    })
                    duallistbox.append(html);
                    duallistbox.bootstrapDualListbox('refresh');
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
function Add() {
    if ($("#privilege_name").val() && $("#new_priv_name").val()) {
        Swal.fire('Multiple Privilege Name', 'Cannot select and Enter new privilege, if you want to create new the make the select privilege to "Select a privilege"', 'warning')
    }
    else {
        var privilege_name = $("#privilege_name").val();
        if (privilege_name == "") {
            privilege_name = $("#new_priv_name").val();
            if (privilege_name == '') {
                Swal.fire('Empty field', 'Must select or enter privilege name', 'warning')
            }
        }
        const routes = duallistbox.val();
        $.ajax({
            url: '/privilege/add',
            type: 'POST',
            data: {
                privilege_name: privilege_name,
                route_id: routes
            },
            success: function (response) {
                if (response.status) {
                    Swal.fire(
                        {
                            title: 'Success',
                            text: `${response.message}`,
                            icon: 'success',
                            showConfirmButton: true,
                            showCancelButton: true,
                            cancelButtonText: "Back to privilege list"
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        else if (result.isDismissed) {
                            window.location.href = '/privileges'
                        }
                    })


                } else {
                    Swal.fire('Problem in adding', response.message, 'warning')
                }
            }
        })
    }
}