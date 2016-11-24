function attachEvents(){


    let symbols = {Sunny: '&#x2600;','Partly sunny': '&#x26C5;', Overcast: '&#x2601;', Rain: '&#x2614;', Degrees: '$#176;'};

    let locationRequested = '';
    $('#submit').click(getLocationsData);


    function getLocationsData() {

         locationRequested = $('#location').val();

        $.get({
            url: 'https://judgetests.firebaseio.com/locations.json',

        }).then(getCurrentLocationData).catch(errorWriter);

    }
    function getCurrentLocationData(result) {

        let code = '';

        for (let location of result) {

            if (location.name == locationRequested) {

                code = location.code;

            }
        }

        if (code != '') {

            getCurrentCond(code);
            getUpcomingCond(code);

        }

        else
            errorWriter('Error');


    }



    function getCurrentCond(code) {

        $.get({
            url: `https://judgetests.firebaseio.com/forecast/today/${code}.json`
        }).then(function (result) {

            let spanSymbol = $(`<span>${symbols[result.forecast.condition]}</span>`).addClass('condition symbol');
            $('#forecast').attr('style', 'display:block');
            $('#current').append(spanSymbol);

            let conditionSpans = $('<span class="condition"></span>')
                .append($(`<span>${result.name}</span>`).addClass('forecast-data'))
                .append($(`<span>${result.forecast.high}&deg;/${result.forecast.low}&deg; </span>`).addClass('forecast-data'))
                .append($(`<span>${result.forecast.condition}</span>`).addClass('forecast-data'));

            $('#current').append(conditionSpans);



        }).catch(errorWriter);

    }


    function getUpcomingCond(code) {

        $.get({
            url: `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`
        }).then(function (resultUpcoming) {

            //console.dir(resultUpcoming)
            for(let day of resultUpcoming.forecast) {

                let mainSpan = $(`<span class="upcoming"></span>`)
                    .append($(`<span class="symbol">${symbols[day.condition]}</span>`))
                    .append($(`<span class='forecast-data'>${day.high}&deg;/${day.low}&deg;</span>`))
                    .append($(`<span class='forecast-data'>${day.condition}</span>`))

                    $('#upcoming').append(mainSpan);
            }


        }).catch(errorWriter);


    }


    function errorWriter(error){

        $('#forecast').attr('style', 'display:block').text(error);

    }


}


