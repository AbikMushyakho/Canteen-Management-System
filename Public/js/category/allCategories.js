// var token = localStorage.getItem("token");
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});
var tbl = $("#example1").DataTable
    ({
        responsive: true,
        lengthChange: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],

    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
    CheckUser()
    ListCategory()
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

            return Swal.fire('Server error', "Server not started", 'error');
        }
    });


}
function ListCategory() {
    $.ajax({
        url: '/category/all',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },

        // data: {},
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
                // response = $.parseJSON(response);
            }
            if (response.status) {
                const data = response.data._Category;
                if (Array.isArray(data)) {
                    tbl.clear().draw();
                    $.each(data, function (key, value) {
                        var _action = '<a onclick="CategoryDetails(' + value.id + ')" class="btn btn-outline-secondary btn-sm mr-2">Details</a><a onclick="EditCategory(' + value.id + ')" class="btn btn-outline-primary btn-sm mr-2">Edit</a> <a onclick="DeleteCategory(' + value.id + ')"   class="btn btn-outline-danger btn-sm">Delete</a> '
                        tbl.row.add([
                            key + 1,
                            value.name,
                            _action
                        ]).draw(false);
                        value++;
                        // html += '<tr>';
                        // html += '<td>' + (key + 1) + '</td>';
                        // // html += '<td>' + value.id + '</td>';
                        // html += '<td>' + value.name + '</td>';
                        // html += '<td> </td>';
                        // html += '</tr>';
                    });
                }
                // $('tbody').append(html);
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
function EditCategory(id) {
    localStorage.setItem('category_id', id)
    window.location.href = "/editCategory"
}
function CategoryDetails(id) {
    localStorage.setItem('category_id', id)
    window.location.href = "/categoryDetails"
}
function DeleteCategory(id) {
    // alert(id)
    Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete Category of ID: ${id}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Del(id)
        }
    })
}
function Del(id) {
    $.ajax({
        url: '/category/delete/' + id + '',
        type: 'DELETE',
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                Toast.fire({
                    icon: "success",
                    title: `${response.message}`,
                });
                setInterval(() => {
                    window.location.href =
                        "/allCategories";
                }, 2000);

            }
            else if (!response.status) {
                return Swal.fire('Error', response.message, 'error');
            }
        },
        error: function (response) {
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}