
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
  });
tbl.buttons()
  .container()
  .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {
  $("#header").load("/user_views/utils/header.html");
  $("#aside").load("/user_views/utils/aside.html");
  $("#footer").load("/user_views/utils/footer.html");
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
          $('#total_order').text(response.data.length)
          var _status = '';
          var _action = '';
          $.each(response.data, function (key, value) {
            _action = `<a onclick="Edit(${value.id})" class=" btn btn-block btn-outline-primary btn-xs">Edit</a> <a onclick="Delete(${value.id})" class="btn btn-block btn-outline-danger btn-xs">Delete</a> `
            if (value.order_status == "pending") {
              _status = `<span id="${value.id}" class="badge badge-warning">${value.order_status}</span>`;
            } else {
              _status = `<span id="${value.id}" class="badge badge-success">${value.order_status}</span>`;
            }
            tbl.row.add([
              value.ordered_date,
              value.id,
              value.food_item.item_name,
              value.quantity,
              value.total_bill,
              _status,
              value.payment_method,
              _action
            ]).draw(false);
            value++;
          })
        }


      }
      else if (!response.status) {
        Swal.fire({
          icon: 'warning',
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
      Swal.fire('Server error', "Server not started", 'error');
    }
  });
}
function Edit(id) {
  const order_status = $(`#${id}`).text();
  if (order_status == "on_road") {
    Swal.fire('Is on Road', "Your order is on road, and will arrive soon", 'info');
  } else if (order_status == "delivered") {
    Swal.fire('Is Delivered', "Order is already delivered", 'info');
  } else {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to edit!! `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Edit it'
    }).then((result) => {
      if (result.isConfirmed) {
        EditOrder(id);
      }
    })
  }
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
    }
  })
}
async function EditOrder(id) {
  const { value: quantity } = await Swal.fire({
    title: 'Enter New Quantity',
    input: 'number',
    inputPlaceholder: 'Quantity',
    showCancelButton: true,
    confirmButtonText: 'Update'
  })
  if (quantity) {
    // const amount = parseInt(quantity)

    $.ajax({
      url: '/order/update/user/' + id + '',
      type: 'PUT',
      // headers: { "Authorization": 'Bearer ' + token },
      data: {
        quantity: quantity
      },
      success: function (response) {
        if (response.status) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${response.message}`,
            showConfirmButton: false,
            timer: 1500
          })
          setInterval(() => {
            window.location.href = '/orders'
          }, 1500);
        }
        else if (!response.status) {
          Swal.fire('Error', response.message, 'error');
        }

      },
      error: function (response) {
        Swal.fire('Error', response.message, 'error');

      }
    })
  } else if (!quantity) {
    Swal.fire('Error', "Quantity is required", 'error');
  }

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
      }
      if (response.status) {
        Swal.fire({
          text: `Order has been deleted`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/orders"
          }
        })
      }
      else if (!response.status) {
        Swal.fire('Error', response.message, 'error');
      }
    },
    error: function (response) {
      Swal.fire('Server error', "Server not started", 'error');
    }
  });
}

