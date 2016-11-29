function solve(){
    const kinveyAppId = "kid_HkKlnP_Me";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = 'test';
    const kinveyPassword = 'test';
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {
        "Authorization": "Basic " + base64auth,
        "Content-Type": "application/json"
    };


    $('#getCountries').click(loadCountries);
    $('#addCtr').click(addCountry);

    function addCountry (){

        let newCountry = {
            name: $('#newCountry').val()
        }

        $.post({

            url:serviceUrl + '/countries',
            headers: authHeaders,
            data: JSON.stringify(newCountry)

        }).then($('#newCountry').val('')).then(loadCountries);

    }

    function loadCountries(){

        $.get({

            url:serviceUrl + '/countries',
            headers: authHeaders

        }).then(displayCountries);


    }


    function displayCountries(countries){

        $('#countriesList').empty();

        for(let country of countries) {

            let edit = $('<input type="button" value="Edit">');
            let show = $('<input type="button" value="show">');
            let del = $('<input type="button" id="delBtn" value="Delete">');
            let el = $('<input type="text" id="name">').val(country.name);
            $('#countriesList').append($('<li>').attr('id', `${country._id}`).append(el)
                .append(edit.click(editCountry))
                .append(del.click(deleteCountry))
                .append(show).click(showTowns));


        }


    }

    function deleteCountry (){

       let id  = $(this).parent()[0].id;
        $.ajax({
            type: 'DELETE',

            url: serviceUrl + '/countries' + `/${id}`,
            headers: authHeaders,


        }).then(loadCountries);




    }

    function editCountry(){

        let id  = $(this).parent()[0].id;
        let newName = {name: $(this).prev().val()};

        $.ajax({

            type: 'PUT',
            url: serviceUrl + '/countries' + `/${id}`,
            headers: authHeaders,
            data: JSON.stringify(newName)


        }).then(loadCountries);

    }

    function showTowns () {

        let country = $(this).find('#name').val();
        let query = {"country":country};

        $.get({

            url:serviceUrl + `/towns/?query={"country":"${country}"}`,
            headers: authHeaders

        }).then(function (result) {
            $('#townsList').append($('<li>').text(result[0].name));
        })

    }



}



