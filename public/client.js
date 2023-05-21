var socket;

window.onload = function() {
    //connects to the socket.io running on the server
    socket = io.connect('http://localhost:3000'); 
    const canvas = document.querySelector('canvas');
    var ctx = canvas.getContext("2d");
    var prevX=0, prevY=0; // Store previous position
    
    //send manual gcode to server if enter is pressed:
    var GcodeCommand = document.getElementById('txt1');
    GcodeCommand.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        socket.emit('sendGcode', GcodeCommand.value);
        GcodeCommand.value = '';
      }
    });

    //send manual tool/demo command:
    var ToolCommand = document.getElementById('txt2');
    ToolCommand.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
        event.preventDefault();
        socket.emit('sendTool', ToolCommand.value);
        ToolCommand.value = '';
        }
    });


    //Button control:
    const forceBtn = document.querySelector("#forcebtn");
    const homeBtn = document.querySelector("#homebtn");
    const toolbtn1 = document.querySelector("#t1");
    const toolbtn2 = document.querySelector("#t2");

    forceBtn.addEventListener("click", function() {
        socket.emit('estop_pressed');
        t2.disabled = true;
        t1.disabled = true;
        txt1.disabled = true;
        txt2.disabled = true;
        homebtn.disabled = false;
        homebtn.classList.remove("disabled");
        forcebtn.classList.add("disabled");
        t1.classList.add("disabled");
        t2.classList.add("disabled");
        document.getElementById("tab2").disabled = true;
        document.getElementById("tab2").classList.add("disabled");
        
        // Disable tab buttons and add 'disabled' class
        const tabButtons = document.querySelectorAll('.tablinks');
        for (const tabButton of tabButtons) {
            tabButton.disabled = true;
            tabButton.classList.add('disabled');
        }
    });

    //Enable functionality if you press home
    homeBtn.addEventListener("click", function() {
        socket.emit('home_pressed');
        forcebtn.disabled = false;
        t2.disabled = false;
        t1.disabled = false;
        txt1.disabled = false;
        txt2.disabled = false;
        forcebtn.classList.remove("disabled");
        t1.classList.remove("disabled");
        t2.classList.remove("disabled");

        const tabButtons = document.querySelectorAll('.tablinks');
        for (const tabButton of tabButtons) {
            tabButton.disabled = false;
            tabButton.classList.remove('disabled');
        }
    });

    //tells the server what tool you want to pick up
    toolbtn1.addEventListener("click", function(){
        socket.emit('Tool1');
    })

    toolbtn2.addEventListener("click", function(){
        socket.emit('Tool2');
    })


    //automatic functions:
    socket.on("CNCData", (data)=> { //do something based on what data you recieve
        console.log(data);;
        var element = document.getElementById("CNCdata"); 
        element.textContent = "last data: "+data;
    })
    
    //display tool feedback
    socket.on("ToolData", (data)=> { 
        console.log(data);
        var element = document.getElementById("Tooldata"); 
        element.textContent = "last data: "+data;
    })
    
    //Display the CNC path in a window when its running. So you can remotly see its position
    socket.on("CNCRunning", (data) => {
        console.log("Running!");
        disableButtons();

        //Grap the x and y values from the position feedback
        const matchArray = data.match(/WPos:(\-?\d+\.?\d*),(\-?\d+\.?\d*)/);
        const X = parseFloat(matchArray[1]);
        const Y = parseFloat(matchArray[2]);
        console.log('X:', X);
        console.log('Y:', Y);
        DrawPosition(X,Y);
    });
    
    socket.on("CNCDone", () => {
      console.log("Done!");
      enableButtons();
    });


    //functions:
    function disableButtons() {
        document.getElementById("homebtn").disabled = true;
        document.getElementById("t1").disabled = true;
        document.getElementById("t2").disabled = true;
        document.getElementById("txt1").disabled = true;
        document.getElementById("txt2").disabled = true;
        document.getElementById("homebtn").classList.add("disabled");
        document.getElementById("t1").classList.add("disabled");
        document.getElementById("t2").classList.add("disabled");
        document.getElementsByClassName("tab-window").disabled=true;
    }

    function enableButtons() {
        document.getElementById("homebtn").disabled = false;
        document.getElementById("t1").disabled = false;
        document.getElementById("t2").disabled = false;
        document.getElementById("txt1").disabled = false;
        document.getElementById("txt2").disabled = false;
        document.getElementById("homebtn").classList.remove("disabled");
        document.getElementById("t1").classList.remove("disabled");
        document.getElementById("t2").classList.remove("disabled");
    }

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

    //Mill window:
    const fileInput = document.getElementById("file-input");
    const rpmInput = document.getElementById("RPM");
    const startButton = document.getElementById("start-button");

    //Lets you start a milling job if you have picked a file and a RPM
    function updateButtonStatus() {
        if (fileInput.files.length > 0 && rpmInput.value !== "") {
        startButton.disabled = false;
        } else {
        startButton.disabled = true;
        }
    }

    // This code sets up event listeners for 'change' on fileInput and 'input' on rpmInput to update button statuses. 
    // When the 'start-button' is clicked, it creates a new FileReader object to read the selected file's content. 
    // Once the file content is successfully loaded, a socket event "FresProgram" is emitted, sending the file content 
    // and the RPM value to the server.
    fileInput.addEventListener("change", updateButtonStatus);
    rpmInput.addEventListener("input", updateButtonStatus);
    const StartBtn = document.querySelector('#start-button');
    
    StartBtn.addEventListener("click", () => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            socket.emit("FresProgram", fileContent, rpmInput.value);
            console.log("socket is emitting");
        };
        reader.readAsText(fileInput.files[0]);
    });

    //draw drive
    let currentIndex = 0;
    const sendCanvasButton = document.getElementById("send-canvas-button");
    const resetCanvasButton = document.getElementById("reset-canvas-button");
    const Drawcanvas = document.getElementById("Drawcanvas");
    const Drawctx = Drawcanvas.getContext("2d");
    let coordinateData = [];
    let drawing = false;

    // Start drawing when the mouse is pressed
    Drawcanvas.addEventListener("mousedown", (event) => {
        drawing = true;
        const x = event.clientX - Drawcanvas.getBoundingClientRect().left;
        const y = event.clientY - Drawcanvas.getBoundingClientRect().top;
        coordinateData.push({ x, y, move: true }); // Save the initial position and indicate the start of a new path
        Drawctx.beginPath();
        Drawctx.moveTo(x, y);
    });

    // Stop drawing when the mouse is released
    Drawcanvas.addEventListener("mouseup", () => {
    drawing = false;
    currentIndex=0;
    });

    // Draw on the canvas as the mouse moves
    Drawcanvas.addEventListener("mousemove", (event) => {
        if (!drawing) return;
        const x = event.clientX - Drawcanvas.getBoundingClientRect().left;
        const y = event.clientY - Drawcanvas.getBoundingClientRect().top;
        currentIndex++;
        if(currentIndex%2==0)
        {
            coordinateData.push({ x, y, move: false }); // Save the new position
        }
        Drawctx.lineTo(x, y);
        Drawctx.stroke();
    });

    // Set the desired line width and color
    Drawctx.lineWidth = 2;
    Drawctx.strokeStyle = "#e76138";

    //Function to scale the coordinates to the canvas
    function scaleCoordinates(point) {
        const xRange = 450;
        const yRange = 250;
        const scaledX = (point.x / Drawcanvas.width) * xRange;
        const scaledY = ((Drawcanvas.height - point.y) / Drawcanvas.height) * yRange;
      
        return { x: scaledX, y: scaledY };
      }
    
    // Scales all the coordinates and then sends them to the server
    function sendCoordinateData() {
        const coordinateDataTxt = coordinateData.map((point) => {
        const scaledPoint = scaleCoordinates(point);
        //formats to Gcode format with two decimals as a string:
        return `G1 X${scaledPoint.x.toFixed(2)} Y${scaledPoint.y.toFixed(2)} Z0 F4000`;
        }).join('\n');
        socket.emit("coordinateData", coordinateDataTxt);
        console.log(coordinateDataTxt);
    }
  
      
    // Modify the sendCanvasButton click event listener to call the new function
    sendCanvasButton.addEventListener("click", () => {
        sendCoordinateData();
    });

    resetCanvasButton.addEventListener("click", () => {
        coordinateData=[];
        Drawctx.clearRect(0, 0, Drawcanvas.width, Drawcanvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
};


