function attachEvents (){

    const kinveyAppId = "kid_Hkg9apVGl";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId + '/catches';
    const kinveyUsername = "test";
    const kinveyPassword = "test";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {
        "Authorization": "Basic " + base64auth,
        "Content-Type": "application/json"
    };



    $('.load').click(getAllCatches);
    $('.add').click(addCatch);



    function getAllCatches (){

        $.get({

            url: serviceUrl,
            headers: authHeaders

        }).then(displayCatches);

    }

    function displayCatches(catches){

        $('#catches').empty();

        for(let cat of catches) {


            let catchh = ($(`<div class="catch" data-id="<${cat._id}>">
                <label>Angler</label>
                <input type="text" class="angler" value="${cat.angler}"/>
                <label>Weight</label>
                <input type="number" class="weight" value="${Number(cat.weight)}"/>
                <label>Species</label>
                <input type="text" class="species" value="${cat.species}"/>
                <label>Location</label>
                <input type="text" class="location" value="${cat.location}"/>
                <label>Bait</label>
                <input type="text" class="bait" value="${cat.bait}"/>
                <label>Capture Time</label>
            <input type="number" class="captureTime" value="${Number(cat.captureTime)}"/>
                <button class="update">Update</button>
                <button class="delete">Delete</button>
                </div>`));

            $('#catches').append(catchh);

        }

        $('.delete').click(function (){
            deleteCatch($(this).parent());
            $(this).parent().remove();

        });
        $('.update').click(function (){
            updateCatch($(this).parent());

        });

        //let entries = $('#catches').find(".catch");
        //console.log(entries.length)

    }

    function addCatch (){

        let cattch = {};

        $('#addForm :input').each(function(){

            cattch[this.className] = $(this).val();
        });

        delete cattch.add;

        //console.log(cattch);
        $.post({

            url: serviceUrl,
            headers: authHeaders,
            data: JSON.stringify(cattch)

        })


    }

    function deleteCatch (parent){

        let id = parent[0].attributes['data-id'].value.replace(/[<>]/g, '');

        $.ajax({
            type: 'DELETE',
            url: serviceUrl + '/' + id,
            headers: authHeaders

        })
    }


    function updateCatch (parent) {
        let id = parent[0].attributes['data-id'].value.replace(/[<>]/g, '');

        let updateCatch = {};

        $(parent.children().find('input')).each(function(){

            updateCatch[this.className] = $(this).val();
        });

        //console.log(updateCatch)


        $.ajax({
            type: 'PUT',
            url: serviceUrl + '/' + id,
            headers: authHeaders,
            data: ''

        })


    }


}
