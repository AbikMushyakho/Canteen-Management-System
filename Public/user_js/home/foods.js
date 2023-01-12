// const user_id = localStorage.getItem('user_id')
// const full_name = localStorage.getItem('full_name')
const role = localStorage.getItem('role_name')
const category_id = localStorage.getItem('category_id')
var food_item_id;
var foodItemName;
if (!category_id) {
    window.location.href = '/home'
}

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

$("#footer").load("/user_views/utils/footer.html");
$(document).ready(function () {
    LoadCategories();

    if (role) {
        LoadAsideHead();
    }
    // $('aside').append('' + aside + '')
    $("#user").click(() => {
        StarterPage()
    })

    $("#logout").click(function () {
        // alert("logout btn clicked")

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

    })

})

function StarterPage() {
    if (role == "Admin" || role == "Staff") {
        window.location.href = "/starter"
    }
    else {
        window.location.href = "/users/starter"
    }
}
var order_id = ' '
function LoadCategories() {
    $.ajax({
        url: '/category/find/' + category_id + '',
        type: 'GET',
        success: function (response) {
            const data = response.data.Food_Items
            if (response.status) {
                $('#category_name').text(response.data.Category.name)
                var html = '';
                $.each(data, function (key, value) {
                    if (value.available !== false) {
                        html += `
                        <div class="col-sm-4">
                        <div class="card mr-4 border border-warning  elevation-4">
                        <img class="card-img-top mt-2" src="${value.food_image}" alt="Food image">
                        <div class="card-body" style="padding: 0; padding-top: 2rem; padding-right: 1.5rem;">
                            <!-- <h5 class="card-title text-bold">Food Name: </h5></br> -->
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item text-bold">Food Name: <span> ${value.item_name}</span></li>
                                <li class="list-group-item text-bold">Available: <span class="badge badge-success"> ${value.available}</span></li>
                                <li class="list-group-item text-bold">Price: Rs.<span class="bg-warning rounded"> ${value.price}</span></li>
                            </ul>
                        </div>
                        <div class="m-4">
                            <a onclick = "OrderFood(${value.id})"  class="btn btn-danger float-right elevation-2">Order</a>
                            </div>
                    </div>
                    </div>
                    `
                    }
                    html += ' '


                });
                $('#myList').append(html);
            }
        },
        error: function (response) {
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
}
function LoadAsideHead() {
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
var item_price;
var total_bills;
function OrderFood(food_id) {
    $.ajax({
        url: '/user/read',
        type: 'GET',
        success: function (response) {

            if (response.status) {
                OrderChecked(food_id)
            } else {
                Swal.fire({
                    title: 'INFO',
                    text: "Token expired Or you have to login/signup to order food",
                    confirmButtonText: "Login",
                    showCancelButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        setInterval(() => {
                            window.location.href = "/login"
                        }, 500);
                    }
                })
            }
        },
        error: function (response) {
            return Swal.fire('Server error', "Server not started", 'error');
        }
    });
}
function LoadInputs() {
    Swal.fire({
        title: 'Fill order details',
        html: `<label for="quantity" class="col col-md-4 mt-2">Quantity</label> 
        <select class="col col-md-6" id="quantity"> 
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
        <option value="4">Four</option>
        <option value="5">Five</option>
        <option value="6">Six</option>
        <option value="7">Seven</option>
        <option value="8">Eight</option>
        <option value="9">Nine</option>
        <option value="10">Ten</option> 
        </select>
        <label for="delivery_location" class="col col-md-4 mt-2">Delivery location</label> 
        <select class="col col-md-6" id="delivery_location"> 
        <option disabled selected>Select Delivery location</option>
        <option value="Block-A">Block-A</option>
        <option value="Block-B">Block-B</option> 
        <option value="Block-C">Block-C</option>     
        </select>
        <label for="payment_method" class="col col-md-4 mt-2">Payment Method</label> 
        <select class="col col-md-6" id="payment_method"> 
        <option disabled selected>Select Payment Method</option>
        <option value="esewa">Pay with esewa</option>
        <option value="credit">credit</option>   
        </select>
        `,
        // html: '<input id="quantity" type="number" class="swal2-input" placeholder="Enter quantity" required> ' +
        //     '<select id="delivery_location" class="swal2-select"><option selected>Select Delivery location</option><option>Block-A</option><option>Block-B</option> <option>Block-C</option></select>' +
        //     // '<input id="delivery_location" type="text" class="swal2-input"  placeholder="Enter delivery location" required>' +
        //     '<select id="payment_method" class="swal2-select"><option selected>Select Payment Method</option><option value="esewa">Pay with esewa</option><option>credit</option></select>'
        // // + '<input id="delivery_location" class="swal2-input"  placeholder="Enter delivery location">'
        // ,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ORDER",
        cancelButtonText: "CANCEL",
        returnInputValueOnDeny: false,
    }).then((result) => {
        if (result.isConfirmed) {
            const quantity = $("#quantity").val();
            const delivery_location = $("#delivery_location").val();
            const payment_method = $("#payment_method").val();
            item_price = parseInt(item_price);
            total_bills = quantity * item_price;
            // if (quantity == '') {
            //     Swal.fire({
            //         title: 'INFO',
            //         text: "Invalid quantity ",
            //         confirmButtonText: "OK",
            //     })
            // }
            if (delivery_location == null) {
                Swal.fire({
                    title: 'INFO',
                    text: "Invalid  delivery location ",
                    confirmButtonText: "OK",
                })
            }
            else if (payment_method == 'credit') {
                const data = {
                    food_item_id: food_item_id,
                    quantity: quantity,
                    delivery_location: delivery_location,
                    payment_method: payment_method
                }
                // localStorage.setItem('new-order', data);
                Order(data)
            }
            else if (payment_method == "esewa") {
                const data = {
                    food_item_id: food_item_id,
                    quantity: quantity,
                    delivery_location: delivery_location,
                    payment_method: payment_method
                }
                const lcData = JSON.stringify(data);
                localStorage.setItem('new-order', lcData);
                EsewaPay()
            }
            else {
                Swal.fire({
                    title: 'INFO',
                    text: "Invalid payment method",

                    confirmButtonText: "OK",

                })
            }
        }
        else if (result.isDismissed) {
            console.log("Cancelled")

        }
    })
}
function OrderChecked(food_id) {

    $.ajax({
        url: '/food/find/' + food_id + '',
        type: 'GET',
        success: function (response) {
            if (response.status) {
                item_price = response.data.price;
                food_item_id = response.data.id;
                console.log(food_item_id);
                foodItemName = response.data.item_name;
                LoadInputs()
            } else {
                Swal.fire('Error', `${response.message}`, 'error');
            }
        },
        error: function (response) {
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })

}


function EsewaPay() {

    var path = "https://uat.esewa.com.np/epay/main";
    var params = {
      pid: `${Date.now()}`,
      amt: total_bills,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: total_bills,
      scd: "EPAYTEST",
      su: "https://canteen.abik.com.np/payment_success",
      fu: "https://canteen.abik.com.np/payment_failure",
    };
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute('id', "esewa_form")
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    const AllForms = $("form");
    const AppendedForm = AllForms[1];
    AppendedForm.submit();
}
// Order in db
function Order(data) {
    // currentOrder = data
    $.ajax({
        url: '/order/add',
        type: 'POST',
        data: data,
        // headers: { "Authorization": 'Bearer ' + token },
        success: function (response) {
            if (response.status) {
                Toast.fire({
                    icon: 'success',
                    animation: true,
                    title: `${response.message}`
                })
                setInterval(() => {
                    window.location.reload();
                }, 2000);
            } else {
                Swal.fire('Error', `${response.message}`, 'error');
            }
        },
        error: function (response) {
            Swal.fire('Error', `${response.message}`, 'error');
        }
    })
}

function Home() {
    if (role == "Admin" || role == "Staff") {
        window.location.href = "/starter"
    }
    else {
        window.location.href = "/users/starter"
    }
}
async function CheckUser() {


}