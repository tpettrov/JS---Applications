function attachEvents (){

    const kinveyAppId = "kid_Hkg9apVGl";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId + '/catches';
    const kinveyUsername = "test";
    const kinveyPassword = "test";
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };



}
