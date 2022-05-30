
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
    CheckUser();
    LoadTable();

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
    // /access/findByRole /: id
    $.ajax({
        url: '/role/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                tbl.clear().draw();
                const data = response.data;
                if (Array.isArray(data)) {
                    var action = ''
                    $.each(data, function (key, value) {
                        action = '<a href="/allUsers" class=" btn btn-outline-info btn-sm">Details</a>'
                        tbl.row.add([
                            value.id,
                            value.role_name,
                            value.role_description,
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
    Swal.fire({
        title: 'Add new role',
        html: `
        <label for="role_name" class="col col-md-4">Role Name</label> <input class="col col-md-6 mb-4" type="text" id="role_name" name="role_name" placeholder= "Enter role name">
        <label for="description" class="col col-md-4">Description</label> 
        <textarea class="col col-md-6" id="description" name="description" rows="3" cols="20">
</textarea>
        
        `,
        showConfirmButton: true,
        confirmButtonText: 'Add',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            let role_name = $("#role_name").val();
            let description = $("#description").val();
            if (!role_name) {
                Swal.fire({
                    title: 'Invalid input',
                    text: 'role_name is required'
                })
            }
            else {
                const data = {
                    role_name: role_name,
                    role_description: description
                }
                // alert(description)
                Add_New_Role(data);
            }
        } else if (result.isDismissed) {
            console.log("Cancelled")
        }
    })
}
function Add_New_Role(data) {

    $.ajax({
        url: '/role/add',
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
            return Swal.fire('Server error', response.message, 'error');
        }
    });

}