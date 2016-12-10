function startApp(){

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_ry6O7JwXg";
    const kinveyAppSecret = "3967e88e7f814700a068b6a1e3955456";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
        "Content-Type": "application/json"
    };

    sessionStorage.clear();

    showHideMenuLinks();

    function showHideMenuLinks(){

        $('#linkHome').show();
        if (sessionStorage.getItem('authToken')){

            $('#linkListOrders').show();
            $('#linkCreateOrder').show();
            $('#linkLogin').hide();
            $('#linkRegister').hide();
            $('#linkLogout').show();


        } else {

            $('#linkListOrders').hide();
            $('#linkCreateOrder').hide();
            $('#linkLogin').show();
            $('#linkRegister').show();
            $('#linkLogout').hide();


        }


    }

    // menu link actions

    $('#linkHome').click(() => showView('viewHome'));
    $('#linkListOrders').click(listOrders);
    $('#linkCreateOrder').click(showCreateOrderView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkLogout').click(logout);

    //buttons actions

    $('#buttonRegisterUser').click(registerUser);
    $('#buttonLoginUser').click(loginUser);
    $('#buttonCreateOrder').click(createOrder);
    $('#buttonEditOrder').click(editOrder);


    showView('viewHome');

    function showView(view){

        $('section').hide();
        $('#' + view).show();

    }

    function showRegisterView (){

        $('#formRegister').trigger('reset');
        showView('viewRegister');

    }

    function showLoginView (){

        $('#formLogin').trigger('reset');
        showView('viewLogin');

    }


    function registerUser(){

        let userData = {

                username: $('#formRegister input[name=username]').val(),
                password: $('#formRegister input[name=passwd]').val()

        }

        $.post({

            url: kinveyBaseUrl + 'user/' + kinveyAppKey,
            headers: kinveyAppAuthHeaders,
            data: JSON.stringify(userData),
            success: registerSuccess,
            error: handleError

        });

        function registerSuccess(userData){

            saveAuthInfoInSession(userData);
            showHideMenuLinks();
            showInfo('User registration successfull !');
            listOrders();


        }

    }

    function loginUser(){

        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        }

        console.log(userData);

        $.post({

            url: kinveyBaseUrl + 'user/' + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: JSON.stringify(userData),
            success: loginSuccess,
            error: handleError


        });

        function loginSuccess(userData){

            saveAuthInfoInSession(userData);
            showHideMenuLinks();
            showInfo('User logged successfully !');
            listOrders();


        }


    }

    function saveAuthInfoInSession(userData){

        sessionStorage.setItem('authToken', userData._kmd.authtoken);
        sessionStorage.setItem('userId', userData._acl.creator);
        sessionStorage.setItem('username', userData.username);

    }

    function showInfo(message){

        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);


    }

    function logout(){

        $.post({

            url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/_logout',
            headers: getAuthHeaders(),
            success: logoutSuccess,
            error: handleError


        });

        function logoutSuccess(){

            sessionStorage.clear();
            showHideMenuLinks();
            showView('viewHome');
            showInfo('Logout successfull');


        }

    }

    function getAuthHeaders(){

        return {

            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
        }


    }


    function listOrders(){

            $('#orders').empty();
            showView('viewOrders');

        $.get({

            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/orders",
            headers: getAuthHeaders(),
            success: loadOrdersSuccess,
            error: handleError
        });


        function loadOrdersSuccess(orders){

            let table = $('<table>').append($('<tr>')).append(`<th>Title</th>
            <th>Publisher</th>
            <th>Description</th>
            <th>Address</th>
            <th>Date Published</th>`);


            for (let order of orders){

                appendOrderToRow(order, table);
            }

            $('#orders').append(table);
        }


        function appendOrderToRow(order, table) {


            let links = [];
            let viewLink = $('<a href="#">[Read More]</a>')
                .click(viewOrder.bind(this, order));
            if (order._acl.creator == sessionStorage.getItem('userId')) {
                let deleteLink = $('<a href="#">[Delete]</a>')
                    .click(deleteOrder.bind(this, order));
                let editLink = $('<a href="#">[Edit]</a>')
                    .click(loadOrderForEdit.bind(this, order));
                links = [deleteLink, ' ', editLink, ' ', viewLink];
            }
            else {

                links = [viewLink];
            }

            table.append($('<tr>').append(
                $('<td>').text(order.title),
                $('<td>').text(order.publisher),
                $('<td>').text(order.description),
                $('<td>').text(order.address),
                $('<td>').text(order.date),
                $('<td>').append(links)
            ));


        }

        }

    function viewOrder(order){

        increaseViews(order);

        $('#orderDetails').empty();

        let advertinfo = $('<div>').append(
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(order.title),
            $('<label>').text('Publisher'),
            $('<h1>').text(order.publisher),
            $('<label>').text('Description'),
            $('<h1>').text(order.description),
            $('<label>').text('Views'),
            $('<h1>').text(order.views)
        )

        $('#orderDetails').append(advertinfo);
        showView('viewOrder');

    }

    function increaseViews(order){

        console.log(order);
        $.get({

            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/orders/" + order._id,
            headers: getAuthHeaders(),
            success: updateViews,
            error: handleError,

        })


        function updateViews(order) {

            let currentViews = order.views;
            currentViews++;

            $.ajax({

                method: 'PUT',
                headers: getAuthHeaders(),
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/orders/" + order._id,
                data: JSON.stringify({
                    title: order.title,
                    publisher: order.publisher,
                    description: order.description,
                    address: order.address,
                    views: currentViews,

                })

            });
        }




    }



        function deleteOrder(order){


            $.ajax({
                method: 'DELETE',
                url: kinveyBaseUrl + "appdata/" +
                kinveyAppKey + "/orders/" + order._id,
                headers: getAuthHeaders(),
                success: deleteOrderSuccess,
                error: handleError

            });

            function deleteOrderSuccess (){

                listOrders();
                showInfo('Order deleted successfully');

            }


        }

        function loadOrderForEdit (order){

            $.get({

                url: kinveyBaseUrl + "appdata/" +
                kinveyAppKey + "/orders/" + order._id,
                headers: getAuthHeaders(),
                success: loadAdForEditSuccess,
                error: handleError

            });

            function loadAdForEditSuccess(){

                $('#formEditOrder input[name=id]').val(order._id);
                $('#formEditOrder input[name=publisher]').val(order._acl.creator);
                $('#formEditOrder input[name=title]').val(order.title);
                $('#formEditOrder textarea[name=description]').val(order.description);
                $('#formEditOrder input[name=datePublished]').val(order.date);
                $('#formEditOrder input[name=address]').val(order.address);
                showView('viewEditOrder');

            }


        }


    function showCreateOrderView(){

        $('#formCreateOrder').trigger('reset');
        showView('viewCreateOrder');
    }

    function createOrder(){

        let orderData = {

            title: $('#formCreateOrder input[name=title]').val(),
            publisher: sessionStorage.getItem('username'),
            description: $('#formCreateOrder textarea[name=description]').val(),
            address: $('#formCreateOrder input[name=address]').val(),
            date: $('#formCreateOrder input[name=datePublished]').val()

        }

        $.post({

            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/orders",
            headers: getAuthHeaders(),
            data: orderData,
            success: createOrderSuccess,
            error: handleError


        });

        function createOrderSuccess(response) {
            listOrders();
            showInfo('Order created successfully.');
        }


    }

    function editOrder(){

        let orderData = {

            title: $('#formEditOrder input[name=title]').val(),
            publisher: sessionStorage.getItem('username'),
            description: $('#formEditOrder textarea[name=description]').val(),
            address: $('#formEditOrder input[name=address]').val(),
            date: $('#formEditOrder input[name=datePublished]').val()

        }

        $.ajax({
            method: 'PUT',
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/orders/" + $('#formEditOrder input[name=id]').val(),
            headers: getAuthHeaders(),
            data: orderData,
            success: editOrderSuccess,
            error: handleError


        });

        function editOrderSuccess(response) {
            listOrders();
            showInfo('Order edited successfully.');
        }


    }

    function handleError(msg){

        $('#errorBox').text("Error:" + msg.responseJSON.description);

        $('#errorBox').show();
        setTimeout(function() {
            $('#errorBox').fadeOut();
        }, 3000);

    }




}