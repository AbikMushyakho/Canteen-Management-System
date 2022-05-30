
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
        url: '/route/all',
        type: 'GET',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                if (Array.isArray(response.data)) {
                    var action = ''
                    $.each(response.data, function (key, value) {
                        action = '<a onclick="Update(' + value.id + ')" class=" btn btn-outline-info btn-sm mr-1">Update</a><a onclick="Delete(' + value.id + ')" class=" btn btn-outline-danger btn-sm">Delete</a>'
                        tbl.row.add([
                            value.id,
                            value.endpoint,
                            value.method,
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
        title: 'Add new Route',
        html: `<label for="endpoint" class="col col-md-4">Endpoint</label> <input class="col col-md-6 mb-4" type="text" id="endpoint" name="endpoint" placeholder= "Enter endpoint">
        <label for="method" class="col col-md-4">Select Method</label> 
        <select class="col col-md-6" id="method"> 
        <option disabled selected>Select</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>        
        </select>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Add',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            const endpoint = $("#endpoint").val();
            const method = $('#method').val();
            if (endpoint == '') {
                Swal.fire({
                    title: 'Invalid input',
                    text: 'endpoint is required'
                })
            }
            else {
                RoutePost(endpoint, method);
            }
        } else if (result.isDismissed) {
            Swal.fire('Cancelled', '', 'info')
        }
    })
}
function RoutePost(endpoint, method) {
    const data = {
        endpoint: endpoint,
        method: method
    }
    $.ajax({
        url: '/route/add',
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
    $.ajax({
        url: '/route/find/' + id + '',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                Swal.fire({
                    title: 'Update Route',
                    html: `<label for="p_endpoint" class="col col-md-4">Previous endpoint</label>
                    <input id="p_endpoint" value="${response.data.endpoint}" class="col col-md-6 mb-4" disabled>
                    <label for="n_endpoint" class="col col-md-4">New endpoint</label>
                    <input id="n_endpoint" class="col col-md-6" placeholder="Enter new endpoint">
                    `,
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Update'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const endpoint = $("#n_endpoint").val();
                        if (endpoint == '') {
                            Swal.fire('Invalid input', 'Must provide endpoint to update', 'warning')
                        }
                        else {
                            UpdateRoute(endpoint, id);

                        }
                    }
                    else {
                        Swal.fire('Cancelled', '', 'warning')
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
function UpdateRoute(endpoint, id) {
    const data = {
        endpoint: endpoint
    }
    $.ajax({
        url: '/route/update/' + id + '',
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
