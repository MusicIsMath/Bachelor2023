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
  else if(request=="Home")
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
  else if(request.startsWith("demo")||request.startsWith("tool")) 
  {   
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\${request}.txt`, 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        DriveGcodeFile(data);
        console.log('\x1b[33m%s\x1b[0m','Estimated time: '+EstimateTime(data)+'s'); //writes it in the terminal in yellow so its easier to find
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
    if(NextOk && (i<lines.length))
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

//estmiates the time it will take to complete the Gcode
function EstimateTime(GcodeFile)
{
  const lines = GcodeFile.split('\n');
  var Z_Values = [240];
  var Y_Values = [0];
  var F_Values = [0];
  var Time = 0;
  for(let i = 0; i<lines.length; i++)
  {
    const regexZ = /Z(-?\d+(\.\d+)?)/; // Regular expression to match the Z-value
    const regexY = /Y(-?\d+(\.\d+)?)/; // Regular expression to match the Y-value
    const regexF = /F(-?\d+(\.\d+)?)/; // Regular expression to match the F-value
    const matchZ = regexZ.exec(lines[i]);
    const matchY = regexY.exec(lines[i]);
    const matchF = regexF.exec(lines[i]);
    if(matchZ)
    {
      const zValue = parseFloat(matchZ[1]);
      Z_Values.push(zValue);
    }
    if(matchY)
    {
      const yValue = parseFloat(matchY[1]);
      Y_Values.push(yValue);
    }
    if(matchF)
    {
      const fValue = parseFloat(matchF[1]);
      F_Values.push(fValue);
    }
  }
  for(let j = 0; j<Z_Values.length-1; j++)  //Check the lenght of the Z-axsis array, as we then avoid the problem of calculating with empty lines
  {
    let Z_diff = Math.abs(Z_Values[j]-Z_Values[j+1]);
    let Y_diff = Math.abs(Y_Values[j]-Y_Values[j+1]);
    if(Z_diff>Y_diff)                       //The time will always be based on the axsis that has to travel the furtest
    {
      Time += (Z_diff/F_Values[j+1])*60;    //Mathematical formula for time based on start / end and speed, 60 is a constant derived from timing the CNC
      if (j>=1)
      {
        if(Math.sign(Z_Values[j-1]-Z_Values[j])!=Math.sign(Z_Values[j]-Z_Values[j+1]))  //Checks if the CNC changes direction to compensate for acceleration time
        {
          Time+=0.73; //acceleration time
        }
      }
    }
    else
    {
      Time += (Y_diff/F_Values[j+1])*60;
      if (j>=1)
      {
        if(Math.sign(Y_Values[j-1]-Y_Values[j])!=Math.sign(Y_Values[j]-Y_Values[j+1]))
        {
          Time+=0.73;
        }
      }
    }
  }
  return (Math.round(Time * 100) / 100).toFixed(2);
}
//drives the CNC home at startup
setTimeout(()=>{
  port2.write(home);
},1500)

// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
