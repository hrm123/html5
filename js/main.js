
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
        var divV = document.createElement("div");
        divV.setAttribute("class", "col-sm-6");
        var p = document.createElement("p");
        p.innerText = "VehicleYear :" + this.vehicleYear;
        divV.appendChild(p);
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
        var divVA = document.createElement("div");
        divVA.setAttribute("class", "col-sm-6");
        var p = document.createElement("p");
        p.innerText = "AccidentYear :" + this.year;
        divVA.appendChild(p);
        return divVA;
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
                var divRow = document.createElement("div");
                divRow.setAttribute("class", "row");
                
                var v = new MainNS.Vehicle(line);
                var a = new MainNS.VehicleAccident(line, v);
                divRow.appendChild(a.ToUI());
                divRow.appendChild(v.ToUI());
                document.getElementById('fileDisplayArea1').appendChild(divRow);
            }
            // progress is a position of the last read line as % from whole file length
            // End of file
            if (isEof) return;  
            // Reading next chunk, adding number of lines read to first line in current chunk
            navigator.readSomeLines(index + lines.length, linesReadHandler, fdispArea);
        });            
    }   
    

})( window.MainNS = window.MainNS || {});