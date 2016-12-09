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
    $('#linkListOrders').click();
    $('#linkCreateOrder').click();
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkLogout').click(logout);

    //buttons actions

    $('#buttonRegisterUser').click(registerUser);
    $('#buttonLoginUser').click(loginUser);


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
            //error: handleError

        });

        function registerSuccess(userData){

            saveAuthInfoInSession(userData);
            showHideMenuLinks();
            showInfo('User registration successfull !');


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
            //error: handleError


        });

        function loginSuccess(userData){

            saveAuthInfoInSession(userData);
            showHideMenuLinks();
            showInfo('User logged successfully !');


        }


    }

    function saveAuthInfoInSession(userData){

        sessionStorage.setItem('authToken', userData._kmd.authtoken);

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
            //error: handleError


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





}