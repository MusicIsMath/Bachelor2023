const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs');
const { restart } = require('nodemon');
const app = express();
let NextOk = true;
const home = "G28 Z Y\n";
var data1 = "";
var data2 = "";
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize serial ports
const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const port2 = new SerialPort({ path: 'COM6', baudRate: 250000 });
const parser = new ReadlineParser();
const parser2 = new ReadlineParser();
port.pipe(parser);
port2.pipe(parser2);

// Listen for ports to open
port.on('open', () => {
  console.log('Serial port1 is open');
});
port2.on('open', () => {
  console.log('Serial port2 is open');
});

// Listen for incomming data
parser.on('data', (data) => {
  data1 = data;
  console.log("Recieved(Tool): ",data);
});
parser2.on('data', (data) => {
  data2 = data;
  if(data=='ok')
  {
    NextOk = true;
  }
  console.log("Recieved(CNC): ",data);
});

app.use(express.static("public"))

// Handle POST request to root route
app.post('/', function(req, res) {
  var request = 
  req.body.character 
  || req.body.Restartbtn 
  || req.body.Forcebtn
  || req.body.Tool1 || req.body.Tool2 || req.body.Tool3
  || 'Not Defined!';
  let [X_verdi,Y_verdi] = (req.body.xy_input || '-1 -1').split(" ");

  //Emergancy stop
  if (request == "Emergency Stop")
  {
    port2.write('M112\n');
    console.log("Emergancy stop pressed!")
  }
  
  //manual drive of CNC
  else if(parseInt(X_verdi) > -1)
  {
    AxsisControl(`G1 Z${X_verdi} Y${Y_verdi} F6000\n`);
  }

  //restart
  else if(request=="restart")
  {
    port2.write(home);
  }

  //send string info to port1 (tool)
  else if(request[0]=='M' || request[0]=='L' || request[0]=='S')
  {
    port.write(request);
    console.log("Sendt: ",request); 
  }

  //Reads a gcode file and sends it to the serialport with a buffer
  else if(request.startsWith("demo")) 
  {   
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\demo${request.substring(4,5)}.txt`, 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        DriveGcodeFile(data);
      }
    });
  }

  else if(request.startsWith("tool"))
  {
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\tool${request.substring(4,5)}.txt`, 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        DriveGcodeFile(data)
      }
    });
  }
});

//writing gcode file to COM port
function DriveGcodeFile(Data)
{
  const lines = Data.split('\n');
  let i = 1;
  AxsisControl(lines[0]+'\n')
  setInterval(()=>{
    if(NextOk)
    {
      AxsisControl(lines[i]+'\n')
      i++;
      NextOk=false;
    }
  },100)
}

//inverting of x-axsis + min / max values
function AxsisControl(Coordinates)
{
  const regexZ = /Z(-?\d+(\.\d+)?)/; // Regular expression to match the Z-value
  const regexY = /Y(-?\d+(\.\d+)?)/; // Regular expression to match the Y-value
  const matchZ = regexZ.exec(Coordinates);
  const matchY = regexY.exec(Coordinates);
  if (matchZ && matchY) {
    const zValue = parseFloat(matchZ[1]);
    const newZ = 240 - Math.min(zValue, 240);   //maks verdi = 240
    const yValue = parseFloat(matchY[1]);
    const newY = Math.min(yValue, 170);         //maks verdi = 170
    
    //replaces the old values with adjusted values:
    Coordinates = Coordinates.replace(regexZ, `Z${newZ.toFixed(3)}`).replace(regexY, `Y${newY.toFixed(3)}`);
  }
  port2.write(Coordinates);
  console.log("Sendt: ", Coordinates);
}

//drives the CNC home at startup
setTimeout(()=>{
  port2.write(home);
},1500)

// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
