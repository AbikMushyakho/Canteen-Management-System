$(function () {
  CheckUser();
  Load()
});
var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
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
async function Load() {
  try {
    ListOrders();
    await FoodItems();
    await Category();
    await RegisteredUsers();

  } catch (error) {
    Swal.fire('Error', error.message, 'warning')
  }
}
//latest order list
function ListOrders() {
  $.ajax({
    url: '/order/all',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        const resData = response.data;
        if (Array.isArray(resData)) {
          const total = resData.length
          $('#total-orders').html(`${total}`);
          var html = '';
          $.each(resData, function (key, value) {
            html += '<tr>';
            // html += '<td>' + (key + 1) + '</td>';
            html += '<td>' + value.id + '</td>';
            html += '<td>' + value.food_item.item_name + '</td>';
            html += '<td> <span class="badge badge-success">' + value.order_status + '</span> </td>';
            html += '<td>' + value.quantity + '</td>';
            html += '<td>' + value.user.full_name + '</td>';
            html += '</tr>';
          });
        }
        $('#ordersTable').append(html);
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
// Recently added food item
function FoodItems() {
  $.ajax({
    url: '/food/all',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        const resData = response.data.Food_Items;
        if (Array.isArray(resData)) {
          const total = response.data.Total_items
          $('.food-item-length').html(`${total}`);
          var li = ''
          $.each(resData, function (key, value) {
            li += ` <li class="item">
          <div class="product-img">
            <img src="${value.food_image}" alt="Product Image" class="img-size-50">
          </div>
          <div class="product-info">
            <a href="/allFoods" class="product-title">${value.item_name}
              <span class="badge badge-warning float-right">Rs${value.price}</span></a>
            <span class="product-description">
              Available: ${value.available} ,Category:${value.category_id}
            </span>
          </div>
        </li> `
          });
        }
        $('.products-list').append(li);
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
function Category() {
  $.ajax({
    url: '/category/all',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        const total = response.data.Total_Category
        $('.category-length').html(`${total}`);
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
function RegisteredUsers() {
  $.ajax({
    url: '/user/all',
    type: 'GET',
    success: function (response) {
      if (response.status) {
        const resData = response.data;
        if (Array.isArray(resData)) {
          const total = response.data.length
          $('.user-length').html(`${total}`);
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
