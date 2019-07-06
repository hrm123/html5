
(function(mainNS){

    mainNS.OnFileSelected = function() {
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
    

})( window.mainNS = window.mainNS || {});