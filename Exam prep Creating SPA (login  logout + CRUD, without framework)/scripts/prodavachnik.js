function startApp() {

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_r1O6bQ2Ge";
    const kinveyAppSecret = "ced31117731844a9acd1085e2b7c6bd1";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
        "Content-Type": "application/json"
    };


    sessionStorage.clear();

    showHideMenuLinks();

    showView('viewHome');

    // menu link actions

    $("#linkHome").click(() => showView('viewHome')); // niiicee
    $("#linkRegister").click(showRegisterView);
    $('#linkLogin').click(showLoginView);
    $("#linkListAds").click(listAds);
    $("#linkLogout").click(logoutUser);
    $('#linkCreateAd').click(showCreateAdView);

    // buttons actions

    $('#buttonRegisterUser').click(registerUser);
    $('#buttonLoginUser').click(loginUser);
    $('#buttonCreateAd').click(createAd);
    $('#buttonEditAd').click(editAd);




    function showHideMenuLinks(){

        $("#linkHome").show();
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListAds").show();
            $("#linkCreateAd").show();
            $("#linkLogout").show();
        } else {
            // No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListAds").hide();
            $("#linkCreateAd").hide();
            $("#linkLogout").hide();
        }
    }


    function showView(view){

        $('main > section').hide();
        $('#' + view).show();
    }

   function showRegisterView(){

       $('#formRegister').trigger('reset');
       showView('viewRegister');

   }

    function registerUser(){

        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };


        $.post({

            url: kinveyBaseUrl + 'user/' + kinveyAppKey,
            headers: kinveyAppAuthHeaders,
            data: JSON.stringify(userData),
            success: registerSuccess,
            error: handleError

        });

        function registerSuccess(userInfo){

            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showInfo('User registration successful');
            listAds();

        }


    }

    function saveAuthInSession(userInfo){

        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        $('#loggedInUser').text('Welcome, ' + userInfo.username);

    }


    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function listAds(){

        $('#ads').empty();
        showView('viewAds');

        $.get({

            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts",
            headers: getKinveyUserAuthHeaders(),
            success: loadAdsSuccess,
            error: handleError
        });

        function loadAdsSuccess(ads){

            showInfo('Ads loaded');

            if(ads.length == 0){

                $('#ads').text('No ads');
            } else {

                    let adsTable = $('<table>')
                        .append($('<tr>').append(
                            '<th>Title</th><th>Publisher</th>',
                            '<th>Description</th><th>Price</th><th>Date Published</th><th>Actions</th>'));

                for (let ad of ads){

                    appendAdRow(ad, adsTable);
                }

                $('#ads').append(adsTable);
            }


            function appendAdRow(ad, adsTable){

                let links = [];

                if (ad._acl.creator == sessionStorage.getItem('userId')) {
                    let deleteLink = $('<a href="#">[Delete]</a>')
                        .click(deleteAd.bind(this, ad));
                    let editLink = $('<a href="#">[Edit]</a>')
                        .click(loadAdForEdit.bind(this, ad));
                    links = [deleteLink, ' ', editLink];
                }

                adsTable.append($('<tr>').append(
                    $('<td>').text(ad.title),
                    $('<td>').text(ad.publisher),
                    $('<td>').text(ad.description),
                    $('<td>').text(ad.price),
                    $('<td>').text(ad.date),
                    $('<td>').append(links)
                ));

            }

        }

    }

    function getKinveyUserAuthHeaders(){

        return {

            'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')
        }
    }

    function showLoginView(){

        $('#formLogin').trigger('reset');
        showView('viewLogin');

    }

    function loginUser(){

        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };


        $.post({

            url: kinveyBaseUrl + 'user/' + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: JSON.stringify(userData),
            success: loginSuccess,
            error: handleError,

        });

        function loginSuccess(userInfo){

            saveAuthInSession(userInfo); // Don't ask the DB about any user info.
            showHideMenuLinks();
            listAds();
            showInfo('Login successful');

        }

    }

    function logoutUser(){

        sessionStorage.clear();
        showHideMenuLinks();
        $('#loggedInUser').text('');
        showView('viewHome');
        showInfo('Logout successful');

    }

    function showCreateAdView(){

        $('#formCreateAd').trigger('reset');
        showView('viewCreateAd');

    }

    function createAd(){

        let adData = {
            title: $('#formCreateAd input[name=title]').val(),
            description: $('#formCreateAd textarea[name=description]').val(),
            date: $('#formCreateAd input[name=datePublished]').val(),
            price: $('#formCreateAd input[name=price]').val(),
            publisher: sessionStorage.getItem('username')
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts",
            headers: getKinveyUserAuthHeaders(),
            data: adData,
            success: createAdSuccess,
            error: handleError
        });

        function createAdSuccess(response) {
            listAds();
            showInfo('Ad created successfully.');
        }

    }

    function deleteAd(ad) {
        $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl + "appdata/" +
                kinveyAppKey + "/adverts/" + ad._id,
            headers: getKinveyUserAuthHeaders(),
            success: deleteAdSuccess,
            error: handleError
        });
        function deleteAdSuccess(response) {
            listAds();
            showInfo('Ad deleted successfully.');
        }
    }


    function loadAdForEdit(ad) {
        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "appdata/" +
                kinveyAppKey + "/adverts/" + ad._id,
            headers: getKinveyUserAuthHeaders(),
            success: loadAdForEditSuccess,
            error: handleError
        });

        function loadAdForEditSuccess(ad) {
            $('#formEditAd input[name=id]').val(ad._id);
            $('#formEditAd input[name=publisher]').val(ad._acl.creator);
            $('#formEditAd input[name=title]').val(ad.title);
            $('#formEditAd textarea[name=description]').val(ad.description);
            $('#formEditAd input[name=datePublished]').val(ad.date);
            $('#formEditAd input[name=price]').val(ad.price);
            showView('viewEditAd');
        }
    }

    function editAd(){

        let adData = {
            title: $('#formEditAd input[name=title]').val(),
            description: $('#formEditAd textarea[name=description]').val(),
            date: $('#formEditAd input[name=datePublished]').val(),
            price: $('#formEditAd input[name=price]').val(),
            publisher: sessionStorage.getItem('username')
        };
        $.ajax({
            method: "PUT",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey +
            "/adverts/" + $('#formEditAd input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: adData,
            success: editAdSuccess,
            error: handleError
        });

        function editAdSuccess(response) {
            listAds();
            showInfo('Ad edited.');
        }


    }

    function handleError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }


    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });



}