// var token = localStorage.getItem("token");
var role = "";
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});
$(function () {
    CheckUser();

});
$("#addCategory").submit(function (e) {
    e.preventDefault();

    $.ajax({
        url: "/category/add",
        method: "post",
        // headers: { "Authorization": 'Bearer ' + token },
        data: {
            name: $('#category_name').val()
        },
        success: function (response) {
            console.log(response)
            if (response.status) {

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${response.message}`,
                    showConfirmButton: false,
                    timer: 1500
                })
                setInterval(() => {
                    window.location.href =
                        "/allCategories";
                }, 2000);
            }
            if (!response.status) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${response.message}`,
                })
            }
        },
        error: function (response) {
            Swal.fire("Server error", response, "error");
        },
    });
})
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