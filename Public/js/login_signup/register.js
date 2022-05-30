$(function () {
    var Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
    });
    $("#RegisterForm").submit(function (e) {
        e.preventDefault();
        const full_name = $("#fullname").val();
        const email = $("#email").val();
        const phone_no = $("#phone_no").val();
        const address = $("#address").val();
        const password = $("#password").val();
        const retype_password = $("#retype_password").val();
        let gender = "";
        const genderEnum = {
            male: "Male",
            female: "Female"
        }

        if ($('#female').is(":checked")) {
            gender = genderEnum.female;
        }
        else {
            gender = genderEnum.male;
        }

        if (password !== retype_password) {
            Swal.fire("Error", "Password and Retyped Password not matched", "error");
            $("#password").val("");
            $("#retype_password").val("");
        }
        else if (!document.getElementById('agreeTerms').checked) {
            Swal.fire({
                icon: "Warning",
                title: "Terms and Condition",
                text: "Are you agree with it?"
            })
        }
        else {
            const data = {
                full_name: full_name,
                email: email,
                password: password,
                phone_no: phone_no,
                address: address,
                gender: gender
            }
            Register(data);
        }

    });
});
$('#check').click(function () {

    if (document.getElementById('check').checked) {
        $('#password').get(0).type = 'text';
        $('#retype_password').get(0).type = 'text';

    } else {
        $('#password').get(0).type = 'password';
        $('#retype_password').get(0).type = 'password';

    }
});
function Register(data) {

    $.ajax({
        url: "/user/register",
        method: "post",
        dataType: "json",
        data: data,
        success: function (response) {
            console.log(response);
            if (response.status) {
                $("#fullname").val("");
                $("#email").val("");
                $("#phone_no").val("");
                $("#address").val("");
                $("#password").val("");
                $("#retype_password").val("");
                Swal.fire({
                    icon: "success",
                    title: "Registration Success!!",
                    html: `<p>Please verify your Email to get access!!</p><br> 
                    <a href="https://www.google.com/gmail/" target="_blank" class="btn btn-danger">Go to gmail</a> <br>
                    OR
                    `,
                    showConfirmButton: true,
                    confirmButtonText: 'Login',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login';
                    }
                })
            }
            if (!response.status) {

                return Swal.fire("Error", response.message, "error");
            }
        },
        error: function (response) {
            return Swal.fire("Server error", "Server not started", "error");
        },
    });

}
