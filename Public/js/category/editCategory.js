// var token = localStorage.getItem("token");
var category_id = localStorage.getItem('category_id');
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});
$(function () {
    CheckUser()
    Load()
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
function Load() {
    $.ajax({
        url: '/category/find/' + category_id + '',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                $('#category_name').val(response.data.Category.name)
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
            Swal.fire('Error', response.message, 'error');

        }
    })

}
function Cancel() {
    localStorage.removeItem('category_id');
    window.location.href = "/allCategories"
}
$('#editCategory').submit((e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: `You want to update `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
            EditCategory()
            // console.log("ready to update")
            // updateFood()
        }
    })
})
function EditCategory() {
    $.ajax({
        url: '/category/update/' + category_id + '',
        type: 'PUT',
        // headers: { "Authorization": 'Bearer ' + token },
        data: {
            name: $("#new_name").val(),
        },
        success: function (response) {
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                Toast.fire({
                    icon: "success",
                    title: `${response.message}`,
                });
                localStorage.removeItem('category_id');
                setInterval(() => {
                    window.location.href = "/allCategories"
                }, 2000);
            }
            else if (!response.status) {
                Swal.fire("Error", response.message, "error");
            }
        },
        error: function (response) {
            Swal.fire("Error", response, "error");
        }
    });
}