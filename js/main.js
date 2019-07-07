
(function(MainNS){

    MainNS.Constants = {
        AccidentYear : 0,
        CaseId : 1,
        BodyType : 2,
        RegClass : 3,
        AptoA : 4,
        TypeOrAxles : 5,
        TravelDirection : 6,
        FuelType : 7,
        VehicleYear: 8,
        StateOfReg : 9,
        NumOccu: 10,
        EngineCyl : 11,
        VehicleMake : 12,
        ContribFac1 : 13,
        ContribFac1Desc : 14,
        ContribFac2 : 15,
        ContribFac2Desc : 16,
        EventType: 17,
        PartialVin: 18
    };

    MainNS.Vehicle = function (dataLine) {
        var datas = dataLine.split(',');
        this.vehicleYear = datas[MainNS.Constants.VehicleYear];
        this.bodyType = datas[MainNS.Constants.BodyType];
        this.fuelType = datas[MainNS.Constants.FuelType];
        this.regState = datas[MainNS.Constants.StateOfReg];
        this.engCyl = datas[MainNS.Constants.EngineCyl];
        this.make = datas[MainNS.Constants.VehicleMake];
        this.pvin = datas[MainNS.Constants.PartialVin];
    };

    MainNS.Vehicle.prototype.ToUI = function(){
        var innerHtm = "<div class=\"card\" style=\"width: 100%;\">" +
        "<div class=\"card-body\">" +
          "<h5 class=\"card-title\">Vehicle</h5>" +
          "<p class=\"card-text\">Year :" + this.vehicleYear + "</p>" +
        "</div></div>";
        var divV = document.createElement("div");
        divV.setAttribute("class", "col-sm-6");
        divV.innerHTML = innerHtm;
        return divV;
    }

    MainNS.VehicleAccident = function(dataLine, vehicle){
        var datas = dataLine.split(',');
        this.vehicle = vehicle;
        this.year = datas[MainNS.Constants.AccidentYear];
        this.caseid = datas[MainNS.Constants.CaseId];
        this.aptoa = datas[MainNS.Constants.AptoA];
        this.confac1 = datas[MainNS.Constants.ContribFac1];
        this.confac1d = datas[MainNS.Constants.ContribFac1Desc];
        this.confac2 = datas[MainNS.Constants.ContribFac2];
        this.confac2d = datas[MainNS.Constants.ContribFac2Desc]; 

    }

    MainNS.VehicleAccident.prototype.ToUI = function(){

        var innerHtm = "<div class=\"card\" style=\"width: 100%;\">" +
        "<div class=\"card-body\">" +
          "<h5 class=\"card-title\">Accident</h5>" +
          "<p class=\"card-text\">Year :" + this.year + "</p>" +
        "</div></div>";
        var divVA = document.createElement("div");
        divVA.setAttribute("class", "col-sm-6");
        divVA.innerHTML = innerHtm;
        return divVA;
    }

    MainNS.filterData =  function(selectObject) {
        var value = selectObject.value;  
        var filteredAccidents = vehicleAccidents.filter(filerAccidentsByYear(value));
        var filteredVehicles = filteredAccidents.map( a => a.vehicle);
        renderVehiclesAndAccidents(filteredAccidents, filteredVehicles);
    }

    MainNS.OnFileSelected = function() {
        // Get file list from input
        var fdispArea = document.getElementById('fileDisplayArea1');
        console.log(fdispArea);
        var files = document.getElementById('input-file').files;
        if (files.length !== 1) return;
        var navigator = new LineNavigator(files[0]);
        // === Reading all lines ===
        var indexToStartWith = 0; 
        navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress, fdispArea) {
            // Error happened
            if (err) throw err;
            // Reading lines
            for (var i = 0; i < lines.length; i++) {
                var lineIndex = index + i;
                var line = lines[i];
                var p1 = document.createElement("p");
                p1.innerText = line;
                // Do something with line
                document.getElementById('fileDisplayArea1').appendChild(p1);
            }
            // progress is a position of the last read line as % from whole file length
            // End of file
            if (isEof) return;  
            // Reading next chunk, adding number of lines read to first line in current chunk
            navigator.readSomeLines(index + lines.length, linesReadHandler, fdispArea);
        });            
    }   

    var vehicles = [];
    var vehicleAccidents = [];

    filerAccidentsByYear = function(yr){
        return function(elem){
            return elem.year === yr;
        }
    }

    MainNS.OnFileSelected1 = function() {
        // Get file list from input
        var fdispArea = document.getElementById('fileDisplayArea1');
        console.log(fdispArea);
        var files = document.getElementById('input-file').files;
        if (files.length !== 1) return;
        var navigator = new LineNavigator(files[0]);
        // === Reading all lines ===
        var indexToStartWith = 0; 
        navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress, fdispArea) {
            // Error happened
            if (err) throw err;
            // Reading lines
            for (var i = 0; i < lines.length; i++) {
                var lineIndex = index + i;
                var line = lines[i];
                // Do something with line
                
                var v = new MainNS.Vehicle(line);
                vehicles.push(v);
                var a = new MainNS.VehicleAccident(line, v);
                vehicleAccidents.push(a);
                
            }
            // progress is a position of the last read line as % from whole file length
            // End of file
            if (isEof){ 
                var  divTR = document.getElementById('Toprow');
                divTR.innerHTML = "Total accidents: " + vehicleAccidents.length;
                renderVehiclesAndAccidents(vehicleAccidents, vehicles);
                return;  
            }
            // Reading next chunk, adding number of lines read to first line in current chunk
            navigator.readSomeLines(index + lines.length, linesReadHandler, fdispArea);
        });       

        
        
        var divRowTop = document.createElement("div");
        divRowTop.setAttribute("class", "row");    
        divRowTop.setAttribute("id", "Toprow");     
        document.getElementById('fileDisplayArea1').appendChild(divRowTop);
        divRowTop.innerHTML = "<IMG src=\"img/loading.gif\">";
    }   

    renderVehiclesAndAccidents = function(accidents, vehicles){
        for(var i=0;i <accidents.length; i++){
            var divRow = document.createElement("div");
                divRow.setAttribute("class", "row");
                var a = accidents[i];
                var v = vehicles[i];
                divRow.appendChild(a.ToUI());
                divRow.appendChild(v.ToUI());
                document.getElementById('fileDisplayArea1').appendChild(divRow);

        }
    }
    

})( window.MainNS = window.MainNS || {});