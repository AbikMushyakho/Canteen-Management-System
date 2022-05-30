
$(function () {
  $("#header").load("/user_views/utils/header.html");
  $("#aside").load("/user_views/utils/aside.html");
  $("#footer").load("/user_views/utils/footer.html");
  Total_Orders();
  Credit_Amount();
  Payments();
});
function Total_Orders() {
  $.ajax({
    url: '/order/all',
    type: 'GET',

    success: function (response) {
      if (response.status) {
        if (Array.isArray(response.data)) {
          const total = response.data.length
          $('.total_orders').text(`${total}`);
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
      return Swal.fire('Server error', "Server not started", 'error');
    }
  });
}
function Credit_Amount() {
  $.ajax({
    url: '/debit_credit/user',
    type: 'GET',
    success: function (response) {
      console.log(response)
      if (response.status) {

        const credit_amount = response.data.total_credit_amount;
        $('.credit_amount').text(`Rs. ${credit_amount}`)

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
      return Swal.fire('Server error', "Server not started", 'error');
    }
  });
}
function Payments() {
  $.ajax({
    url: '/payment/user',
    type: 'GET',
    success: function (response) {

      if (response.status) {
        const paid_amounts = response.data.Total_Paid_Amount;
        $('.payments').text(`Rs. ${paid_amounts}`)
      } else {
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

        // Swal.fire('Message', `${response.message}`, 'info');
      }
    },
    error: function (response) {
      Swal.fire('Error', `${response.message}`, 'error');
    }
  })
}

