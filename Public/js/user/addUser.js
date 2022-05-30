var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

$(function () {
  CheckUser();
});
$("#RegisterForm").submit(function (e) {
  e.preventDefault();
  debugger;
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

  else if (password == retype_password) {
    const data = {
      full_name: full_name,
      email: email,
      password: password,
      phone_no: phone_no,
      address: address,
      gender: gender
    }
    AddUser(data);
  }
});
function AddUser(data) {
  $.ajax({
    url: "/user/register",
    method: "post",
    dataType: "json",
    data: data,
    success: function (response) {
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: "Registration Successful",
        });

        $("#fullname").val("");
        $("#email").val("");
        $("#phone_no").val("");
        $("#address").val("");
        $("#password").val("");
        $("#retype_password").val("");
        setInterval(() => {
          window.location.href =
            "/allUsers";
        }, 3000);
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
      // else if (!response.status) 
    },
    error: function (response) {

      return Swal.fire('Server error', "Server not started", 'error');
    }
  });

}