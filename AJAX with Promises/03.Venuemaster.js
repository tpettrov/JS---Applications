function attachEvents(){


    const kinveyAppId = "kid_BJ_Ke8hZg";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "guest";
    const kinveyPassword = "pass";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {
        "Authorization": "Basic " + base64auth,
        "Content-Type": "application/json"
    };


    $('#getVenues').click(getVenues);

    function getVenues(){

        let requestedDate = $('#venueDate').val();

        $.post({

            url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${requestedDate}`,
            headers: authHeaders

        }).then(getVenuesData);


    }


    function getVenuesData (venuesId) {

        for (let id of venuesId) {

            $.get({

                url: `https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/${id}`,
                headers: authHeaders

            }).then(displayVenue);

        }

    }

    function displayVenue(venue){

        $('#venue-info').append(`<div class="venue" id="${venue._id}">
            <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
        <div class="venue-details" style="display: none;">
            <table>
            <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
        <tr>
        <td class="venue-price">${venue.price} lv</td>
        <td><select class="quantity">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            </select></td>
            <td><input class="purchase" type="button" value="Purchase"></td>
            </tr>
            </table>
            <span class="head">Venue description:</span>
        <p class="description">${venue.description}</p>
        <p class="description">Starting time: ${venue.startingHour}</p>
        </div>
        </div>`
        );
        $('.info').click(function(){

            if($(this).parent().parent()[0].id == venue._id)

                $(`#${venue._id} .venue-details`).attr('style', 'display: block');
        });

        $('.purchase').click(function(){
            let id = $(this).parents('.venue')[0].id;
            let name = $(this).parents('.venue').find('.venue-name').text();
            let price = $(this).parents('.venue').find('.venue-price').text();
            let qty = $(this).parents('.venue').find('.quantity option:selected').text();

            $('#venue-info').empty();


            $('#venue-info').append(`<span class="head">Confirm purchase</span>
                <div class="purchase-info">
                <span>${name}</span>
                <span>${qty} x ${price}</span>
                <span>Total: ${Number(qty) * Number(price.slice(0,2))} lv</span>
                <input type="button" value="Confirm" id="confirmBtn">
                </div>`);


            $('#confirmBtn').on('click', confirmer(id, qty));

            function confirmer(id, qty) {
                $.post({
                    url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${qty}`,
                    headers: authHeaders
                }).then(displayConfirmation)

            }


        })

    }

    function displayConfirmation(html){

        $('#venue-info').empty();
        $('#venue-info').append(html.html);

    }




}