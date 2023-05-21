//server setup:
var express = require('express');
var app = express();
server = app.listen(3000);
app.use(express.static('public'));
const { restart } = require('nodemon');
const fs = require('fs');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


//socket setup:
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);


//serial ports setup:
const ToolPort = new SerialPort({ path: 'COM3', baudRate: 9600 });
const CNCPort = new SerialPort({ path: 'COM5', baudRate: 115200 });
const Toolparser = new ReadlineParser();
const CNCparser = new ReadlineParser();
ToolPort.pipe(Toolparser);
CNCPort.pipe(CNCparser);
ToolPort.on('open', () => {
    console.log('Serial ToolPort is open');
  });
CNCPort.on('open', () => {
    console.log('Serial CNCPort is open');
});


//Handel info from client side
function newConnection(socket) {
    console.log('new connection: ' + socket.id);
  
    socket.on('sendGcode', function(data) {
      const GrblCommandsChars = ['$','M','G','!','?','H','%'];
  
      // Check if any of the GrblCommandsChars are present in the input data
      const containsGrblCommandChar = GrblCommandsChars.some(char => data.includes(char));
  
      //Sends the GCODE command to the CNC if its in the right format
      if (containsGrblCommandChar) {
        console.log('Sendt Data: ' + data);
        CNCPort.write(data+'\n');
      }
    });

    //Force stop if E-stop button is pressed
    socket.on('estop_pressed',function(){
        console.log('\x1b[31m%s\x1b[0m', 'ESTOP CNC ACTIVATED!');
        CNCPort.write('\x18');
    });

    //Sends the CNC home and zeros all the axsises
    socket.on('home_pressed',function(){
        console.log('Home pressed!');
        CNCPort.write('$H\n');
        CNCPort.write('G92 X0 Y0 Z0\n');
    });

    socket.on('sendTool',function(data){
        if(data!=='')
        {
          //lets us run demo GCODE programs saved on PC
            if(data.includes('demo'))
            {
              fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\${data}.txt`, 'utf8', (err, GCODE) => {
                    if (err) 
                    {
                        console.log(err);
                    }
                    else 
                    {
                      console.log(GCODE)
                      RunGcode(GCODE);
                    }
                  });
            }
            //if you dont run a demo the line is sent to the tool arduino, this was mostly for testing
            else
            {
                console.log('Sendt Data: ' + data);
                ToolPort.write(data);
            }
        }
    });
    
    //Pickup for tool 1 and 2:
    socket.on('Tool1', function(){

      fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\tool1.txt`, 'utf8', (err, GCODE) => {
            if (err) 
            {
                console.log(err);
            }
            else 
            {
              console.log(GCODE)
              RunGcode(GCODE);
            }
          });
    });

    socket.on('Tool2', function(){

      fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\tool2.txt`, 'utf8', (err, GCODE) => {
            if (err) 
            {
                console.log(err);
            }
            else 
            {
              console.log(GCODE)
              RunGcode(GCODE);
            }
          });
    });

    //RPM is sent to the tool, telling the arduino its RPM by starting with "T"
    socket.on('FresProgram', (GcodeFile, RPM) => {
      ToolPort.write('T'+RPM);
      RunGcode(GcodeFile);
    });

    //Takes the saved coordinates from the draw drive functions and runs the CNC
    socket.on("coordinateData", (coordinateDataTxt) => {
      console.log(coordinateDataTxt);
      RunGcode(coordinateDataTxt);
    });
}

//Sends all the data from the tool to the client, so that the reponse can be displayed on the web site
Toolparser.on('data', (data) =>{
    io.emit("ToolData",data);
    console.log("Recieved(Tool): ",data);
  });

//Sends all the data from the CNC to be displayed aswell
CNCparser.on('data', (data) =>{
    io.emit("CNCData",data);
    console.log("Recieved(CNC): ",data);

    //If the CNC is running, we tell the client that its running and ask for the position again
    if (data.includes('<Run,MPos:'))
    {
      io.emit("CNCRunning",data);
      setTimeout(function() {
        CNCPort.write('?\n')
      }, 100);
    }

    //Tells the client that the CNC is idle / done running, so we can enable buttons and functions again
    else if (data.includes('<Idle,MPos:'))
    {
      io.emit("CNCDone");
    }
  
    //To avoid being locked from the UI, we also tell the client the CNC is not running if its in alarm state
    else if(data.includes('<Alarm,MPos:'))
    {
      io.emit("CNCDone");
    }
    
    //If the CNC fails to home, home again
    else if(data.includes("ALARM: Homing fail"))
    {
        setTimeout(function() {
            CNCPort.write('$H\n')
            CNCPort.write('G92 X0 Y0 Z0\n')
        }, 1500);
    }
});

function RunGcode(data) {
  // Split the input GCODE into an array of lines
  const lines = data.split('\n');
  let currentLine = 0;

  // Function to send a single line of GCODE
  function sendLine() {
      if (currentLine < lines.length) {
          // Send the current line
          const line = lines[currentLine].trim();
          if (line.length > 0) {
              CNCPort.write(line + '\n');
              console.log('Sent: ' + line);
          }
          currentLine++;
      } else {
          // Unsubscribe the 'ok' listener when all lines are sent
          CNCparser.removeListener('data', onCNCDataReceived);
      }
  }

  // Event listener function for 'ok' response from the CNC
  function onCNCDataReceived(data) {
      if (data.includes('ok')) {
          sendLine();
      }
  }

  // Subscribe the 'ok' listener
  CNCparser.on('data', onCNCDataReceived);

  // Send the first line
  sendLine();
  setTimeout(()=>{
    CNCPort.write('?\n')
  },500)
}

//when you start the server the CNC is homed
setTimeout(()=>{
    CNCPort.write('$H\n');
    CNCPort.write('G92 X0 Y0 Z0\n');
},3500)
