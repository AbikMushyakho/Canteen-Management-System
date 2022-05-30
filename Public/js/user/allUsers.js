var tbl = $("#example1").DataTable
  ({
    responsive: true,
    lengthChange: false,
    autoWidth: false,
  });
$(function () {
  CheckUser();
  LoadRoles();
  List();
});
$('#select_role').on('change', function () {
  const role = $("#select_role").val();
  if (role != null) {
    LoadByRoleId(role);
  }
});
function LoadRoles() {
  $.ajax({
    url: '/role/all',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        const data = response.data;
        if (Array.isArray(data)) {
          var html = ''
          $.each(data, function (key, value) {
            html += `<option value="${value.id}">${value.role_name}</option>`
          })
          $('#select_role').append(html)
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
      return Swal.fire('Server error', "Server not started", 'error');
    }
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
function List() {
  $.ajax({
    url: '/user/all',
    type: 'GET',
    success: function (response) {
      tbl.clear().draw();
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        var action = '';
        if (Array.isArray(response.data)) {
          $.each(response.data, function (key, value) {
            action = '<a onclick="EditUser(' + value.id + ')" href="/updateUser" class="btn btn-block btn-outline-primary btn-xs">Edit</a> <a onclick="DeleteUser(' + value.id + ')"   class="btn btn-block btn-outline-danger btn-xs">Delete</a>'
            tbl.row.add([
              key + 1,
              value.full_name,
              value.email,
              value.gender,
              value.phone_no,
              value.address,
              value.user_role.role_id,
              action
            ]).draw(false);
            value++;

          });
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
function LoadByRoleId(role_id) {
  // /access/findByRole /: id
  $.ajax({
    url: '/user/find/role/' + role_id + '',
    type: 'GET',
    success: function (response) {
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        const data = response.data.Users;
        if (Array.isArray(data)) {
          var action = '';
          tbl.clear().draw();
          $.each(data, function (key, value) {
            action = '<a onclick="EditUser(' + value.id + ')" href="/updateUser" class="btn btn-block btn-outline-primary btn-xs">Edit</a> <a onclick="DeleteUser(' + value.id + ')"   class="btn btn-block btn-outline-danger btn-xs">Delete</a>'
            tbl.row.add([
              key + 1,
              value.full_name,
              value.email,
              value.gender,
              value.phone_no,
              value.address,
              value.user_role.role_id,
              action
            ]).draw(false);
            value++;
          });
        }
      }
      else if (!response.status) {
        Swal.fire({
          icon: 'info',
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
      // return Swal.fire('Server error', "Server not started", 'error');
    }
  });
}

function EditUser(id) {

  localStorage.setItem('id', id);

}
function DeleteUser(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: `You want to delete user of ID: ${id}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUserById(id);
    }
  })
}
async function deleteUserById(id) {
  $.ajax({
    url: '/user/delete/' + id + '',
    type: 'DELETE',
    // headers: { "Authorization": 'Bearer ' + token },
    // data: {},
    success: function (response) {
      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        Swal.fire(
          'Deleted!',
          `${response.message}`,
          'success'
        )
        $('tbody').empty();
        List();

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