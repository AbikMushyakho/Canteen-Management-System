// var token = localStorage.getItem("token")
var category_id = localStorage.getItem("category_id")
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});
$(function () {
    CheckUser();
    FindCategory()
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
function FindCategory() {
    $.ajax({
        url: '/category/find/' + category_id + '',
        type: 'GET',
        success: function (response) {
            console.log(response);
            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
                // response = $.parseJSON(response);
            }
            if (response.status) {
                $('#category_name').text(response.data.Category.name)
                var html = '';
                const data = response.data.Food_Items;
                if (Array.isArray(data)) {
                    $.each(data, function (key, value) {
                        html += '<tr>';
                        html += '<td>' + (key + 1) + '</td>';
                        // html += '<td>' + value.id + '</td>';
                        html += '<td>' + value.item_name + '</td>';
                        html += '<td>' + value.price + '</td>';
                        html += '<td><a onclick="EditFood(' + value.id + ')" class="btn btn-block btn-outline-primary btn-xs">Edit</a> </td>';
                        html += '</tr>';
                    });

                    $('tbody').append(html);
                }
            }
            else if (!response.status) {
                Swal.fire({
                    icon: 'info',
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
function EditFood(id) {
    localStorage.setItem('food_id', id);
    window.location.href = "/editFood"
}