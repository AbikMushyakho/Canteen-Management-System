var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
});
var tbl = $("#example1").DataTable
  ({
    responsive: true,
    lengthChange: true,
    order: [[4, "desc"]],
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    columnDefs: [
      { "width": "10%", "targets": 0 }
    ]
  });
tbl.buttons()
  .container()
  .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
  CheckUser()
  TableData()
  // List();
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

function TableData() {
  $.ajax({
    url: '/food/all',
    type: 'GET',
    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        const data = response.data.Food_Items;
        if (Array.isArray(data)) {
          var _available = ''
          var _image = ''
          var _action = ''
          $.each(data, function (key, value) {
            _image = '<a  onclick="EditFood(' + value.id + ')">   <img src="' + value.food_image + '" alt="Product Image"  width="90%" height="15%" style="border: solid 0.2rem darkslategrey; border-radius: 1rem;">  </a>'
            _action = '<a onclick="EditFood(' + value.id + ')" class="btn btn-outline-primary btn-sm rounded">Edit</a>' + ' <a onclick="DeleteFood(' + value.id + ')"   class="btn btn-outline-danger btn-sm rounded">Delete</a>'
            if (value.available == true) {
              _available = '<div class="row"><span id="' + value.id + '" class="badge badge-block badge-success w-50">' + value.available + '</span>' + ' <a onclick="ChangeStatus(' + value.id + ')" class="btn btn-outline-primary btn-xs w-50">Change</a></div>'

            } else {
              _available = '<div class="row"><span id="' + value.id + '" class="badge badge-warning w-50">' + value.available + '</span>' + ' <a onclick="ChangeStatus(' + value.id + ')" class="btn btn-outline-primary btn-xs w-50">Change</a></div>'

            }
            tbl.row.add([
              _image,
              value.item_name,
              value.price,
              _available,
              value.category_id,
              _action
              // 'edit'
            ]).draw(false);
            value++;
          })
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
      return Swal.fire('Server error', "Server not started", 'error');
    }
  });
}
function EditFood(id) {
  localStorage.setItem('food_id', id);
  window.location.href = "/editFood"
}
function DeleteFood(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: `You want to delete food of ID: ${id}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {

      deleteFoo(id)
    }
  })

}
async function deleteFoo(id) {
  $.ajax({
    url: '/food/delete/' + id + '',
    type: 'DELETE',
    // headers: { "Authorization": 'Bearer ' + token },
    // data: {},
    success: function (response) {
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
        // response = $.parseJSON(response);
      }
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: `${response.message}`,
        });
        setInterval(() => {
          window.location.href =
            "/allFoods";
        }, 2000);

      }
      else if (!response.status) {
        return Swal.fire('Error', response.message, 'error');
      }
    },
    error: function (response) {
      return Swal.fire('Server error', "Server not started", 'error');
    }
  });
}
function ChangeStatus(id) {
  if ($(`#${id}`).text() == "true") {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to disable this food `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, disable it!'
    }).then((result) => {
      if (result.isConfirmed) {
        $("#available").text('false');

        const data = {
          available: 'false'
        }
        MakeDisable(id, data);
      }
    })
  }
  else {
    $("#available").text('true');

    const data = {
      available: 'true'
    }
    MakeDisable(id, data);
  }

}
function MakeDisable(food_id, data) {
  $.ajax({
    url: '/food/update/' + food_id + '',
    type: 'PUT',
    // headers: { "Authorization": 'Bearer ' + token },
    data: data,

    success: function (response) {
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: `${response.message}`,
        });

        setInterval(() => {
          window.location.href = "/allFoods"
        }, 1000);
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
