var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// var full_name = localStorage.getItem('full_name')
var role = localStorage.getItem('role_name')
$("#footer").load("/user_views/utils/footer.html");
$(document).ready(function () {
    CheckUser()
    LoadCategories();
    FoodItems();
    // if (role) {
    //     LoadAsideHead();
    // }
    // $('aside').append('' + aside + '')


})
$("#user").click(() => {
    StarterPage()
})

$("#logout").click(function () {
    LogoutUser();
})
function LogoutUser() {

    $.ajax({
        url: '/logout',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                Toast.fire({
                    icon: 'success',
                    animation: true,
                    title: `${response.message}`
                })
                localStorage.clear();
                setInterval(() => {
                    window.location.href = "/login"
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

function CheckUser() {
    const _user = localStorage.getItem('user_id')
    if (_user) {
        $.ajax({
            url: '/user/read',
            type: 'GET',
            success: function (response) {
                if (response.status) {
                    if (role == "Admin" || role == "Staff") {
                        $("#nav_header").empty();
                        $("#nav_header").load("/views/utils/header.html");
                        $("aside").load("/views/utils/aside.html");

                    }
                    else {
                        $("#nav_header").empty();
                        $("#nav_header").load("/user_views/utils/header.html");
                        $("aside").load("/user_views/utils/aside.html");

                    }
                }
                // else if (!response.status) 
            },
            error: function (response) {

                return Swal.fire('Server error', "Server not started", 'error');
            }
        });
    }

}
function StarterPage() {
    if (role == "Admin" || role == "Staff") {
        window.location.href = "/starter"
    }
    else {
        window.location.href = "/users/starter"
    }
}
function LoadCategories() {
    $.ajax({
        url: '/category/all',
        type: 'GET',
        success: function (response) {
            const data = response.data._Category
            if (response.status) {
                var html = '';
                $.each(data, function (key, value) {
                    // html += '<li id="' + value.id + '">';
                    html += `
                    <div class="col-sm-4">
                    <div class="card mr-4 border border-warning  elevation-4">
                        <div class="card-body" style="padding: 0; padding-top: 2rem; padding-right: 1.5rem;">
                         <ul class="list-group list-group-flush">
                             <li class="list-group-item text-bold">Category: <span class="bg-warning"> ${value.name}</span></li>
                        </ul>
                    </div>
                    <div class="mb-2">
                        <a href="#" onclick="setCategory(${value.id})" class="btn btn-danger float-right mr-4">Check Foods</a>
                    </div>
                </div>
                </div>`
                    // html += '  <a id="' + value.id + '" class="list-group-item list-group-item-action" data-toggle="list" href="#home" role="tab">' + value.name + '</a>';
                    // html += '</li>';
                });
                $('#myList').append(html);
            }
        },
        error: function (response) {
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
}

function setCategory(category_id) {
    // alert(category_id)
    localStorage.setItem('category_id', category_id);
    window.location.href = "/foods"
}
function FoodItems() {
    $.ajax({
        url: '/food/all',
        type: 'GET',
        // headers: { "Authorization": 'Bearer ' + token },
        // data: {},
        success: function (response) {
            const total = response.data.Total_items
            $('.food-item-length').html(`${total}`);

            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
                // response = $.parseJSON(response);
            }
            if (response.status) {
                var li = ''
                $.each(response.data.Food_Items, function (key, value) {
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
                $('.products-list').append(li);
            }
            else if (!response.status) {
                return Swal.fire('Error', response.message[0], 'error');
            }
        },
        error: function (response) {
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}
function Dashboard() {
    if (role == "Admin" || role == "Staff") {
        window.location.href = "/starter"
    }
    else {
        window.location.href = "/users/starter"
    }
}