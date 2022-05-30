// var token = localStorage.getItem("token");
var user_id = '';

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
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
        order: [[0, "desc"]],
        columnDefs: [{
            "targets": [1, 2, 3, 4, 5],
            "orderable": false
        }]
    });
tbl.buttons()
    .container()
    .appendTo("#example1_wrapper .col-md-6:eq(0)");
$(function () {

    $("#header").load("/user_views/utils/header.html");
    $("#aside").load("/user_views/utils/aside.html");
    $("#footer").load("/user_views/utils/footer.html");
    Load()
});


function Load() {
    $.ajax({
        url: '/payment/user',
        type: 'GET',
        success: function (response) {

            if (typeof (response) != 'object') {
                response = JSON.stringify(response);
            }
            if (response.status) {
                console.log(response)
                debugger
                const data = response.data.Payments;
                if (Array.isArray(data)) {
                    const total_no = response.data.Total_no_of_Payments;
                    const total_paid = response.data.Total_Paid_Amount;

                    $('#total_no').text(`${total_no}`)
                    $('#total_paid').text(`${total_paid}`)
                    var _status = ''
                    $.each(data, function (key, value) {
                        _status = `<span  class="badge badge-success">${value.status}</span>`;
                        tbl.row.add([
                            key + 1,
                            value.date,
                            value.time,
                            value.reference_code,
                            value.advance_amount,
                            value.previous_amount,
                            value.paid_amount,
                            value.remaining_amount,
                            _status
                            // 'edit'
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