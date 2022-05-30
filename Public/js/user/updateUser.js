var id = localStorage.getItem('id');
// var token = localStorage.getItem('token');
var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});
$(function () {
  CheckUser()
  LoadInputs()
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
      // else if (!response.status) 
    },
    error: function (response) {

      return Swal.fire('Server error', "Server not started", 'error');
    }
  });

}
function LoadInputs() {
  $.ajax({
    url: '/user/find/' + id + '',
    type: 'GET',

    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
        // response = $.parseJSON(response);
      }
      if (response.status) {
        const data = response.data;
        $('#fullname').val(data.full_name)
        $('#email').val(data.email)
        $('#phone_no').val(data.phone_no)
        $('#address').val(data.address)

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
      Toast.fire({
        icon: "error",
        title: `${response.message}`,
      });
    }
  });
}

$('form').submit((e) => {
  e.preventDefault();

  $.ajax({
    url: '/user/update/' + id + '',
    type: 'PUT',
    data: {
      full_name: $("#fullname").val(),
      email: $("#email").val(),
      phone_no: $("#phone_no").val(),
      address: $("#address").val()
    },
    success: function (response) {
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }

      if (response.status) {
        localStorage.removeItem('id');
        $("#fullname").val(''),
          $("#email").val(''),
          $("#phone_no").val(''),
          $("#address").val('')
        Swal.fire({
          icon: 'success',
          title: 'Update Success',
          text: response.message,
          showConfirmButton: true,
          confirmButtonText: 'Go to user lists'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/allUsers"
          }
        })
      }
      else if (!response.status) {
        return Swal.fire("Error", response.message, "error");
      }
    },
    error: function (response) {
      return Swal.fire("Error", response, "error");
    }
  });

})

function Cancel() {
  localStorage.removeItem("id");
  window.location.href = "/allUsers"
}