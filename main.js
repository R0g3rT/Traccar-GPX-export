//Config Variablen
let datacontainer = document.getElementById("webdaten");
let btn = document.getElementById("btn");
let date_now = new Date();

// Login to Traccar with Data Request
btn.addEventListener("click", function() {
    let server = document.querySelector("#vserver").value;
    let port = document.querySelector("#vport").value;
    let geraet = document.querySelector("#geraet").value;
    let fdate = document.querySelector("#fdate").value;
    let tdate = document.querySelector("#tdate").value;
    let user = document.querySelector("#user").value;
    let pass = document.querySelector("#pass").value;
    let auth2 = "Basic " + btoa(user + ":" + pass);
    let sdaten = new XMLHttpRequest();
    sdaten.open("GET", server + ":" + port + "/api/positions?" + "deviceId=" + geraet + "&from=" + fdate + "Z&to=" + tdate + "Z");
    sdaten.setRequestHeader("Accept", "application/json");
    sdaten.setRequestHeader("Authorization", auth2);
    sdaten.onreadystatechange = function() {
        if (sdaten.readyState === XMLHttpRequest.DONE && sdaten.status === 200) {
            var daten = JSON.parse(sdaten.responseText);
            gpxsave(daten);
            datacontainer.innerHTML = "Daten wurden geladen"
        };
    };
    sdaten.send();

});

//Convert to GPX Data

function gpxsave(data) {
    let autor = document.querySelector("#autor").value;
    let route = document.querySelector("#route").value;
    let dname = document.querySelector("#dname").value;
    let fdate = document.querySelector("#fdate").value;
    let tdate = document.querySelector("#tdate").value;
    let save = document.querySelector("#save").value;

    var gpxdaten = "";
    gpxdaten +=
        //header
        '<?xml version="1.0" encoding="UTF-8" ?>\n' +

        '<gpx version="1.1" creator="' + autor + ' "xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n' +

        //metadata
        '<metadata>\n' +
            '<name>' + dname + '</name>\n' +
            '<time>' + date_now.toISOString() + '</time>\n' +
            '<desc>' + route + ' - Start: ' + fdate + ' - End: ' + tdate + '</desc>\n' +
        '</metadata>\n\n' +


        //track
        "<trk>\n<trkseg>\n" +
        "\n"

    for (i = 0; i < data.length; i++) {
        gpxdaten +=
            '<trkpt lat="' + data[i].latitude + '" lon="' + data[i].longitude + '">\n' +
                '<ele>' + data[i].altitude + '</ele>\n' +
                '<time>' + data[i].deviceTime.replace("+00:00", "") + '</time>\n' +
                '<speed>' + data[i].speed + '</speed>\n' +
                '<course>' + data[i].course + '</course>\n' +
            '</trkpt>\n\n'

    }; +
    "\n"
    gpxdaten +=
        //end
        '</trkseg>\n' +
        '</trk>\n' +
        '</gpx>\n';

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    };

    downloadURI("data:text/gpx," + gpxdaten, (dname + "-" + save + ".gpx"));


};