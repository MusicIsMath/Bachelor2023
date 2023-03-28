window.onload = function(){
    const socket = io();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var prevX, prevY; // Store previous position
    
    socket.on("CNCData", (data)=> { //do something based on what data you recieve
        console.log(data);;
        var element = document.getElementById("CNCdata"); 
        element.textContent = "last data: "+data;
    })
    
    socket.on("ToolData", (data)=> { //do something based on what data you recieve
        console.log(data);
        var element = document.getElementById("Tooldata"); 
        element.textContent = "last data: "+data;
    })
    
    socket.on("CNCRunning", () => {
        console.log("Running!");
        disableButtons();
    });
    
    socket.on("CNCDone", () => {
      // Enable all elements when CNC is done
      console.log("Done!");
      enableButtons();
    });
    
    function disableButtons() {
        document.getElementById("homebtn").disabled = true;
        document.getElementById("t1").disabled = true;
        document.getElementById("t2").disabled = true;
        document.getElementById("t3").disabled = true;
        document.getElementById("txt1").disabled = true;
        document.getElementById("txt2").disabled = true;
        document.getElementById("homebtn").classList.add("disabled");
        document.getElementById("t1").classList.add("disabled");
        document.getElementById("t2").classList.add("disabled");
        document.getElementById("t3").classList.add("disabled");
        
    }
    
    function enableButtons() {
        document.getElementById("homebtn").disabled = false;
        document.getElementById("t1").disabled = false;
        document.getElementById("t2").disabled = false;
        document.getElementById("t3").disabled = false;
        document.getElementById("txt1").disabled = false;
        document.getElementById("txt2").disabled = false;
        document.getElementById("homebtn").classList.remove("disabled");
        document.getElementById("t1").classList.remove("disabled");
        document.getElementById("t2").classList.remove("disabled");
        document.getElementById("t3").classList.remove("disabled");
    }
    socket.on("PositionTracking", (data) => {
        const matchArray = data.match(/WPos:(\-?\d+\.?\d*),(\-?\d+\.?\d*)/);
        const X = parseFloat(matchArray[1]);
        const Y = parseFloat(matchArray[2]);
        console.log('X:', X);
        console.log('Y:', Y);
        DrawPosition(X,Y);
    });

    function DrawPosition(x,y) {
        y=300-y;
        ctx.strokeStyle = "#e76138";
        ctx.lineWidth = 5;
        ctx.beginPath();
        if (prevX !== undefined && prevY !== undefined) { // If not the first position
            ctx.moveTo((prevX/500)*canvas.width + 2.5, (prevY/300)*canvas.height); // Move to previous position
            ctx.lineTo((x/500)*canvas.width + 2.5, (y/300)*canvas.height); // Draw line to new position
            ctx.stroke(); // Make line visible
        }
        prevX = x; // Store new position
        prevY = y;
    }
}
