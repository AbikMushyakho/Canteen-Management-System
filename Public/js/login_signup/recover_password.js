var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
});
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var email = getParameterByName('email');
$(function () {
    VerifyUser()

})
function VerifyUser() {
    $.ajax({
        url: '/email_verified_user',
        method: 'post',
        data: {
            'email': email,
        },
        success: function (response) {
            if (response.status) {
                if (response.data.expired == false) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Invalid redirect.',
                        text: ' Firstly come through forget password and verification process. Redirecting to login page!!'
                        , showConfirmButton: true,
                        confirmButtonText: 'Login'
                    }).then((results) => {
                        if (results.isConfirmed) {
                            window.location.href = '/login'
                        }
                    })
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
            Swal.fire('Server Error', response.message, 'error');
        }
    })
}

$('#check').click(function () {

    if (document.getElementById('check').checked) {
        $('#password').get(0).type = 'text';
        $('#confirm_password').get(0).type = 'text';

    } else {
        $('#password').get(0).type = 'password';
        $('#confirm_password').get(0).type = 'password';

    }
});

$("#recovery_password").submit(function (e) {
    e.preventDefault();
    const password = $("#password").val();
    const conform_password = $("#confirm_password").val();
    if (password !== conform_password) {
        $("#confirm_password").focus();
        Swal.fire('Invalid', 'Confirm password not matched', 'info')
    } else {
        $.ajax({
            url: '/recover_password',
            method: 'post',
            dataType: 'json',
            data: {
                'email': email,
                'password': password
            },
            success: function (response) {
                if (response.status) {
                    $("#confirm_password").val('');
                    $("#password").val('');
                    Swal.fire({
                        icon: 'success',
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
                else {
                    Swal.fire('Error', response.message, 'error');
                }
            },
            error: function (response) {
                Swal.fire('Server Error', response.message, 'error');
            }
        })
    }

})
