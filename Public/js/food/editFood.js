// var token = localStorage.getItem("token")
const user_id = localStorage.getItem("user_id");
const full_name = localStorage.getItem("full_name");
const role_name = localStorage.getItem("role_name");
var food_id = localStorage.getItem("food_id")
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
    url: '/category/all',
    type: 'GET',
    success: function (response) {
      var html = '';
      const data = response.data._Category;
      if (Array.isArray(data)) {
        $.each(data, function (key, value) {
          html += '<option value="' + value.id + '">' + value.name + '</option>';

        })
        $('.category').append(html);
      }
    },
    error: function (response) {
      Swal.fire('Server error', response, 'error');

    }

  })
  $.ajax({
    url: '/food/find/' + food_id + '',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        $('#food_name').val(`${response.data.item_name}`)
        $('#price').val(`${response.data.price}`)
        $('#image').attr({ 'src': '' + response.data.food_image + '' })
        FindCategory(response.data.category_id)
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
      Swal.fire('Server error', response.message, 'error');

    }

  })
}
function FindCategory(id) {
  $.ajax({
    url: '/category/find/' + id + '',
    type: 'GET',
    // headers: { "Authorization": 'Bearer ' + token },
    success: function (response) {
      if (response.status) {
        $('.category').append(
          `<option value="${response.data.Category.id}" selected>Previous: ${response.data.Category.name}</option>`
        )
        $('.category').select2();
      }
      else if (!response.status) {
        Swal.fire('Error', response.message, 'error');
      }
    },
    error: function (response) {
      Swal.fire('Server error', response.message, 'error');

    }

  })
}
$('#editFood').submit((e) => {
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
      updateFood()
    }
  })
})

function updateFood() {
  $.ajax({
    url: '/food/update/' + food_id + '',
    type: 'PUT',
    data: {
      item_name: $("#food_name").val(),
      price: $("#price").val(),
      category_id: $(".category").val(),
    },

    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        $("#food_name").val(''),
          $("#price").val(''),
          Toast.fire({
            icon: "success",
            title: `${response.message}`,
          });
        localStorage.removeItem('food_id');
        setInterval(() => {
          window.location.href = "/allFoods"
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
function Cancel() {
  localStorage.removeItem("food_id");
  window.location.href = "/allFoods"
}