window.onload = function(){
    const socket = io();
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var prevX, prevY; // Store previous position
    
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
