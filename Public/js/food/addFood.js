var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});
const user_id = localStorage.getItem("user_id");
const full_name = localStorage.getItem("full_name");
const role_name = localStorage.getItem("role_name");
$(function () {
  CheckUser()
  LoadCategory()
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
function LoadCategory() {
  $.ajax({
    url: '/category/all',
    type: 'GET',
    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        const data = response.data._Category;
        if (Array.isArray(data)) {
          var html = '';
          $.each(data, function (key, value) {
            html += '<option value="' + value.id + '">' + value.name + '</option>';
          });
          $('.category').append(html);
        }
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
      return Swal.fire('Server error', response[0], 'error');
    }
  });

}
function formsData() {
  let formData = new FormData();
  formData.append('item_name', $("#food_name").val())
  formData.append('price', $("#price").val());
  formData.append('category_id', $(".category").val());
  formData.append('food_image', $('input[name=food_image]')[0].files[0]);
  return formData;
}
$("#addFood").submit(function (e) {
  e.preventDefault();

  $.ajax({
    url: "/food/add",
    method: "post",
    // headers: { "Authorization": 'Bearer ' + token },
    data: formsData(),
    processData: false,  // tell jQuery not to process the data
    contentType: false,  // tell jQuery not to set contentType
    success: function (response) {
      if (response.status) {
        $("#food_name").val('')
        $("#price").val('')
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 1500
        })
        setInterval(() => {
          window.location.href =
            "/allFoods";
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
      Swal.fire("Server error", response.message, "error");
    },
  });
})
