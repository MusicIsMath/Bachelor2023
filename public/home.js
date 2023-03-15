const socket = io();

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




