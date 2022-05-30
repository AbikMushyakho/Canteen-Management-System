var user_id = localStorage.getItem("user_id");
var full_name = localStorage.getItem("full_name");
var role_name = localStorage.getItem("role_name");
var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});
$(function () {
    $("#header").load("/user_views/utils/header.html");
    $("#aside").load("/user_views/utils/aside.html");
    $("#footer").load("/user_views/utils/footer.html");
    Load()
});

function Load() {
    $('.role').text(role_name);
    $.ajax({
        url: '/user/read',
        type: 'GET',
        success: function (response) {
            const gender = {
                male: "Male",
                female: "Female"
            }
            if (response.status) {
                $('.user_name').text(`${response.data.full_name}`)
                $('.email').text(`${response.data.email}`)
                $('.phone_no').text(`${response.data.phone_no}`)
                $('.gender').text(`${response.data.gender}`)
                if (response.data.gender == gender.male) {
                    $("#profile_pic").attr({ "src": "/images/men.png" });

                } else {
                    $("#profile_pic").attr({ "src": "/images/women.png" });

                }
                $('.address').text(`${response.data.address}`)
                $('#full_name').val(`${response.data.full_name}`)
                $('#email').val(`${response.data.email}`)
                $('#phone_no').val(`${response.data.phone_no}`)
                $('#address').val(`${response.data.address}`)
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
$('form').submit((e) => {
    e.preventDefault();
    if (!document.getElementById('agreeTerms').checked) {
        Swal.fire({
            icon: "Warning",
            title: "Terms and Condition",
            text: "Are you agree with the terms and condition?"
        })
    } else {
        $.ajax({
            url: '/user/update/' + user_id + '',
            type: 'PUT',
            data: {
                email: $("#email").val(),
                phone_no: $("#phone_no").val(),
                address: $("#address").val()
            },
            success: function (response) {
                if (typeof (response) != 'object') {
                    response = JSON.stringify(response);
                }

                if (response.status) {
                    $("#full_name").val(''),
                        $("#email").val(''),
                        $("#phone_no").val(''),
                        $("#address").val('')
                    Toast.fire({
                        icon: "success",
                        title: `${response.message}`,
                    });
                    setInterval(() => {
                        window.location.reload();

                    }, 3000);
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
})
function ChangePassword() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to change password!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I want to change it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Change Password',
                html: '<input id="old_password" type="text" class="swal2-input" placeholder="Enter old password" required> ' +
                    '<input id="new_password" type="text" class="swal2-input"  placeholder="Enter new password" required>'
                ,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "CHANGE",
                cancelButtonText: "CANCEL",
                returnInputValueOnDeny: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const old_password = $("#old_password").val();
                    const new_password = $("#new_password").val();
                    if (old_password == '') {
                        Swal.fire('Error', "Old password is required", 'error');
                    }
                    else if (new_password == '') {
                        Swal.fire('Error', "New password is required", 'error');
                    }
                    else {
                        const data = {
                            old_password: old_password,
                            new_password: new_password
                        }
                        $.ajax({
                            url: '/user/change_password',
                            type: 'POST',
                            // headers: { "Authorization": 'Bearer ' + token },
                            data: data,
                            success: function (response) {
                                if (response.status) {
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: `${response.message}`,
                                        showConfirmButton: true,
                                        // timer: 2000,
                                        // timerProgressBar: true,
                                        // didOpen: (toast) => {
                                        //     toast.addEventListener('mouseenter', Swal.stopTimer)
                                        //     toast.addEventListener('mouseleave', Swal.resumeTimer)
                                        // }
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            localStorage.clear();
                                            setInterval(() => {
                                                window.location.href = "/login"
                                            }, 2000);
                                        }
                                    })
                                }
                                else if (!response.status) {
                                    Swal.fire('Error', response.message, 'error');
                                }
                            },
                            error: function (response) {
                                Swal.fire('Server error', "Server not started", 'error');
                            }
                        });
                    }
                }
                else if (result.isDismissed) {
                    console.log("Cancel")

                }
            })
        } else if (result.isDismissed) {
            console.log("Cancelled")
        }
    })


}