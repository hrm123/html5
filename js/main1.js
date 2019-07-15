(function(MainNS1, CacheStoreLocal1){

    var CacheStoreLocal = {
        cacheData: {},
      
        get: (key) => {
          if (CacheStoreLocal.cacheData.hasOwnProperty(key) && CacheStoreLocal.cacheData[key].val) {
            return CacheStoreLocal.cacheData[key].val;
          }
          return false;
        },
      
        set: (key, value, expiry) => {
      
          CacheStoreLocal.clear(key); // Clear before we store it so we can clean up the timeout.
      
          var to = false;
          if (expiry && parseInt(expiry) > 0) {
            to = setTimeout(function() {
              CacheStoreLocal.clear(key);
            }, parseInt(expiry));
          }
      
          CacheStoreLocal.cacheData[key] = {
                expiry: expiry,
                val: value,
                timeout: to,
              };
        },
      
        clear: (key) => {
          if (CacheStoreLocal.cacheData.hasOwnProperty(key)) {
            if (CacheStoreLocal.cacheData[key].to) {
              clearTimeout(CacheStoreLocal.cacheData[key].to);
            }
      
            delete CacheStoreLocal.cacheData[key];
            return true;
          }
      
          return false;
        },
      };

    MainNS1.Constants = {
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

    class Vehicle1{
        constructor(dataLine){
            var datas = dataLine.split(',');
            this.vehicleYear = datas[MainNS1.Constants.VehicleYear];
            this.bodyType = datas[MainNS1.Constants.BodyType];
            this.fuelType = datas[MainNS1.Constants.FuelType];
            this.regState = datas[MainNS1.Constants.StateOfReg];
            this.engCyl = datas[MainNS1.Constants.EngineCyl];
            this.make = datas[MainNS1.Constants.VehicleMake];
            this.pvin = datas[MainNS1.Constants.PartialVin];
        }
        ToUI = () => {
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
    }

    var vehicles = [];
    var vehicleAccidents = [];

    class VehicleAccident1{
        constructor(dataLine, vehicle){
            var datas = dataLine.split(',');
            this.vehicle = vehicle;
            this.year = datas[MainNS1.Constants.AccidentYear];
            this.caseid = datas[MainNS1.Constants.CaseId];
            this.aptoa = datas[MainNS1.Constants.AptoA];
            this.confac1 = datas[MainNS1.Constants.ContribFac1];
            this.confac1d = datas[MainNS1.Constants.ContribFac1Desc];
            this.confac2 = datas[MainNS1.Constants.ContribFac2];
            this.confac2d = datas[MainNS1.Constants.ContribFac2Desc]; 
        }

        ToUI = () => {
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
    }

    MainNS1.OnFileSelected1 = function() {
            var divRowTop = document.createElement("div");
            divRowTop.setAttribute("class", "row");    
            divRowTop.setAttribute("id", "Toprow");     
            document.getElementById('fileDisplayArea1').appendChild(divRowTop);
            divRowTop.innerHTML = "<IMG src=\"img/loading.gif\">";
            
            // Get file list from input
            var fdispArea = document.getElementById('fileDisplayArea1');
            console.log(fdispArea);
            var files = document.getElementById('input-file').files;
            if (files.length !== 1) return;
            var navigator = new LineNavigator(files[0]);
            // === Reading all lines ===
            var indexToStartWith = 0; 
            
            debugger;
            if(! CacheStoreLocal.get("vehicles") || ! CacheStoreLocal.get("vehicleAccidents")){
            navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress, fdispArea) {
                // Error happened
                if (err) throw err;

                // Reading lines
                for (var i = 0; i < lines.length; i++) {
                    var lineIndex = index + i;
                    var line = lines[i];
                    // Do something with line
                    
                    var v = new Vehicle1(line);
                    vehicles.push(v);
                    var a = new VehicleAccident1(line, v);
                    vehicleAccidents.push(a);
                    if(vehicleAccidents.length>10000)
                    {
                        break;
                    }
                }
                // progress is a position of the last read line as % from whole file length
                // End of file
                if (isEof || vehicleAccidents.length>10000){ 
                    var  divTR = document.getElementById('Toprow');
                    divTR.innerHTML = "Total accidents: " + vehicleAccidents.length;
                    debugger;
                    CacheStoreLocal.set("vehicleAccidents", vehicleAccidents, 3000000); // 50 mins expiry
                    CacheStoreLocal.set("vehicles", vehicles, 3000000); // 50 mins expiry
                    renderVehiclesAndAccidents1(vehicleAccidents, vehicles);
                    
                    
                    document.getElementById("uploadFile_div").innerHTML = document.getElementById("uploadFile_div").innerHTML;

                    return;  
                }
                // Reading next chunk, adding number of lines read to first line in current chunk
                navigator.readSomeLines(index + lines.length, linesReadHandler, fdispArea);
            });       
        } else{
            vehicleAccidents = CacheStoreLocal.get("vehicleAccidents");
            vehicles = CacheStoreLocal.get("vehicles");
            var  divTR = document.getElementById('Toprow');
                    divTR.innerHTML = "Total accidents: " + vehicleAccidents.length;
            renderVehiclesAndAccidents1(vehicleAccidents, vehicles);
            document.getElementById("uploadFile_div").innerHTML = document.getElementById("uploadFile_div").innerHTML;
            return;
        }
    }   

    renderVehiclesAndAccidents1 = function(accidents, vehicles){
        for(var i=0;i <accidents.length; i++){
            var divRow = document.createElement("div");
                divRow.setAttribute("class", "row");
                var a = accidents[i];
                var v = vehicles[i];
                divRow.appendChild(a.ToUI());
                divRow.appendChild(v.ToUI());
                if(i%10000 === 0){
                    console.log(i);
                    if(i>50000)
                    {
                        return;
                    }
                }
                document.getElementById('fileDisplayArea1').appendChild(divRow);

        }
    }

    MainNS1.filterData =  function(selectObject) {
        var value = selectObject.value;  
        var filteredAccidents = vehicleAccidents.filter(filerAccidentsByYear(value));
        var filteredVehicles = filteredAccidents.map( a => a.vehicle);
        renderVehiclesAndAccidents(filteredAccidents, filteredVehicles);
    }
    

})( window.MainNS1 = window.MainNS1 || {}, window.cacheStore || {});