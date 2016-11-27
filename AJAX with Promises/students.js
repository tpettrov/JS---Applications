function  solve(){

    const kinveyAppId = "kid_BJXTsSi-e";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId + '/students';
    const kinveyUsername = 'guest';
    const kinveyPassword = 'guest';
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = {
        "Authorization": "Basic " + base64auth,
        "Content-Type": "application/json"
    };


    $.get({

        url: serviceUrl,
        headers:authHeaders

    }).then(studentLister);

    $('#save').click(saveTheFuckedUpStudent)

    let newStudent = {

        ID: Number($('#id').val()),
        FirstName: $('#firstName').val(),
        LastName: $('#lastName').val(),
        FacultyNumber: $('#facultyNumber').val(),
        Grade: Number($('#grade').val()),
    }

    function saveTheFuckedUpStudent(){

        if (newStudent.id != '' && newStudent.FirstName != ''
            && newStudent.LastName != '' && newStudent.FacultyNumber != '' && newStudent.Grade != '') {
            $.post({

                url: serviceUrl,
                headers: authHeaders,
                data: JSON.stringify(newStudent)
            });

        }else (console.log('Error. Мързи те да пишеш!'))
    }




    function studentLister(students){

         students = students.sort((a,b) => {return a.ID - b.ID});

        for (let student of students) {

            let row = $('<tr>');
            let id = $('<td>').text(student.ID);
            let firstname = $('<td>').text(student.FirstName);
            let lastName = $('<td>').text(student.LastName);
            let facNum = $('<td>').text(student.FacultyNumber);
            let grade = $('<td>').text(student.Grade);
            row.append(id).append(firstname).append(lastName).append(facNum).append(grade);
            $('#results').append(row);

        }

    }

}