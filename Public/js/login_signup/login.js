var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
});
$(function () {
    localStorage.clear();
})
$("#LoginForm").submit(function (e) {
    e.preventDefault();
    const email = $("input").first().val();
    const password = $("#password").val();
    $.ajax({
        url: '/user/login',
        method: 'post',
        dataType: 'json',
        data: {
            'email': email,
            'password': password
        },
        success: function (response) {

            if (response.status) {
                Toast.fire({
                    icon: 'success',
                    title: `${response.message}`
                })
                $("input").first().val('');
                $("#password").val('');

                const { id, full_name, role_name } = response.data;

                localStorage.setItem("user_id", id);
                localStorage.setItem("full_name", full_name);
                localStorage.setItem("role_name", role_name);
                setInterval(() => {
                    if (role_name == "Admin" || role_name == "Staff") {
                        window.location.href = "/starter"
                    }
                    else {
                        window.location.href = "/users/starter"
                    }
                }, 1000);

                // redirectStarter()
            }
            else {
                Swal.fire('Message', response.message, 'warning');
            }
        },
        error: function (response) {
            Swal.fire('Server Error', response.message, 'error');
        }
    })
})
$('#check').click(function () {

    if (document.getElementById('check').checked) {
        $('#password').get(0).type = 'text';

    } else {
        $('#password').get(0).type = 'password';

    }
});
function ForgetPassword() {
    Swal.fire({
        title: 'Change Password',
        icon: 'info',
        html: '<label for="email" class="col-sm-10 ">Enter your <b class="bg-warning">Email Address</b> to change password</label>' +
            '<input id="email" type="email" class="swal2-input col-sm-12" placeholder="Enter your email" required> '
        , showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Send Email",

    }).then((result) => {
        if (result.isConfirmed) {
            const email = $("#email").val();
            if (email == "") {
                alert("Email is required");
            }
            else {
                findEmail(email);

            }
        }
    })
}
function findEmail(email) {
    $.ajax({
        url: '/user/email',
        method: 'post',
        dataType: 'json',
        data: {
            'email': email,
        },
        success: function (response) {
            if (response.status) {
                SendEmailToken(response.data.email);
            }
            else {
                Swal.fire('Invalid Email', response.message, 'warning');

            }
        },
        error: function (response) {
            Swal.fire('Server Error', response.message, 'error');
        }
    })
}
function SendEmailToken(email) {
    $.ajax({
        url: '/user/forgetPassword/sendEmail',
        method: 'post',
        dataType: 'json',
        data: {
            'email': email,
        },
        success: function (response) {
            if (response.status) {
                timerSwal()
            }
            else if (!response.status) {
                Swal.fire('Invalid Email', response.message, 'warning');

            }
        },
        error: function (response) {
            Swal.fire('Server Error', response.message, 'error');
        }
    })

}
var
    closeInSeconds = 30,
    // displayText = `I will close in <b id="timeCount">30</b> seconds.`,
    displayText = `A verification email has been send to the provided email. Check it to continue.`,
    timer;

function timerSwal() {
    Swal.fire({
        icon: 'info',
        title: "Verification!",
        html: displayText + '<br>' + 'If not arrived then retry in <b id="timeCount">30</b> seconds',
        timer: closeInSeconds * 1000,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Resend Code",
        cancelButtonText: "Go to email",
    }).then((result) => {
        if (result.isConfirmed) {
            ForgetPassword()
        }
        else if (result.isDismissed) {
            window.location.href = 'https://www.google.com/gmail/';
        }
    })

    timer = setInterval(function () {

        closeInSeconds--;

        // if (closeInSeconds < 0) {

        //     clearInterval(timer);
        // }

        $('#timeCount').text(closeInSeconds);

    }, 1000);
}