// var token = localStorage.getItem("token");

var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
});
var tbl = $("#example1").DataTable
  ({
    lengthChange: true,
    scrollCollapse: true,
    pageLength: 5,
    buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    responsive: true,
    order: [[1, "desc"]],
    columnDefs: [{
      "orderable": false,
      "targets": [2, 3, 7, 9],
    }],
  });
tbl.buttons()
  .container()
  .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
  CheckUser();
  LoadOrders();

});
function LoadOrders() {
  $.ajax({
    url: '/order/all',
    type: 'GET',
    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
      }
      if (response.status) {
        if (Array.isArray(response.data)) {
          tbl.clear().draw();
          var _status = ''
          var action = ''
          $.each(response.data, function (key, value) {
            action = '<a onClick="OrderDetails(' + value.id + ')" class=" btn btn-outline-secondary btn-sm">Details</a><a onclick="Edit(' + value.id + ')" class="btn btn-outline-primary btn-sm">Delivered</a> <a onclick="Delete(' + value.id + ')" class="btn btn-outline-danger btn-xs">Delete</a>'
            if (value.order_status == "pending") {
              _status = `<span id="${value.id}" class="badge badge-success">${value.order_status}</span>`;
            } else {
              _status = `<span id="${value.id}" class="badge badge-warning">${value.order_status}</span>`;
            }
            tbl.row.add([
              value.ordered_date,
              value.id,
              value.user.full_name,
              value.food_item.item_name,
              value.quantity,
              value.total_bill,
              _status,
              value.delivery_location,
              value.payment_method,
              action
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

function Edit(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: `The order is delivered `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delivered'
  }).then((result) => {
    if (result.isConfirmed) {

      const orderStatus = $(`#${id}`).text();
      if (orderStatus == "pending" || orderStatus == "cooking" || orderStatus == "on_road") {
        const data = {
          order_status: "delivered"
        }
        ChangeStatus(id, data);
      }
      else {
        Swal.fire('Error', 'Order is already delivered', 'error');
      }
    }
  })
}

function Delete(id) {
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
      DeleteById(id)
      // tbl.ajax.reload();
    }
  })

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
    },
    error: function (response) {

      return Swal.fire('Server error', "Server not started", 'error');
    }
  });

}
function ChangeStatus(id, data) {
  // alert(`${id}, ${data.order_status}`)
  $.ajax({
    url: '/order/update/admin/' + id + '',
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
        // if (response.data.order_status !== "pending") {
        //   $('.badge').addClass('badge-danger')
        // }
        setInterval(() => {
          window.location.href = "/allOrders"
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
async function DeleteById(id) {
  // debugger
  $.ajax({
    url: '/order/delete/' + id + '',
    type: 'DELETE',
    // headers: { "Authorization": 'Bearer ' + token },
    // data: {},
    success: function (response) {

      if (typeof (response) != 'object') {
        response = JSON.stringify(response);
        // response = $.parseJSON(response);
      }
      if (response.status) {


        Swal.fire({
          text: `Order has been deleted`,
          icon: 'success',

          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/allOrders"
          }
        })

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

function OrderDetails(order_id) {
  localStorage.setItem('order_id', order_id);
  window.location.href = '/order/details'
}