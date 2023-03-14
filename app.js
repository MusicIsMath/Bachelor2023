const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs');
const { restart } = require('nodemon');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Initialize serial ports
const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const port2 = new SerialPort({ path: 'COM5', baudRate: 115200 });
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
  console.log("Recieved(Tool): ",data);
  if (data.trim() === 'F') {
    FresProgram();
  }

});

parser2.on('data', (data) => {
  console.log("Recieved(CNC): ",data);
  if (data.includes('<Run,MPos:'))
  {
    setTimeout(function() {
      port2.write('?\n')
    }, 2000);
  }

  else if (data.includes('<Idle,MPos:'))
  {
   console.log("THE CNC HAS ARRIVED AT END STOP!!!");
   port.write('L');
  }

  if(data.includes("ALARM: Homing fail"))
  {
  setTimeout(function() {
    port2.write('$H\n')
    port2.write('G92 X0 Y0 Z0\n')
  }, 1500);
  }
});

app.use(express.static("public"))

// Handle POST request to root route
app.post('/', function(req, res) {
  var request = //whatever value comes inn from local host, save it in "request"
  req.body.character 
  || req.body.Restartbtn 
  || req.body.Forcebtn
  || req.body.Tool1 || req.body.Tool2 || req.body.Tool3
  || req.body.xy_input
  || 'Not Defined!';

  console.log('Sendt data: ',request)
  //Emergancy stop
  if (request == "ESTOP")
  {
    port2.write('\x18');
    console.log('\x1b[31m%s\x1b[0m', 'ESTOP CNC ACTIVATED!');
  }
  
  //manual drive of CNC
  else if(request.startsWith('G')||request.startsWith('$')||request.startsWith('M')||request.startsWith('?')||request.startsWith('~'))
  {
    port2.write(request+'\n');
  }

  //restart
  else if(request=="Home")
  {
    port2.write('$H\n');
    port2.write('G92 X0 Y0 Z0\n');
  }

  //send string info to port1 (tool)
  else if(request[0]=='M' || request[0]=='L' || request[0]=='S')
  {
    port.write(request);
  }

  //Reads a gcode file and sends it to the serialport with a buffer
  else if(request.startsWith("demo")|| request.startsWith("test")) 
  {   
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\${request}.txt`, 'utf8', (err, data) => {
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
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\${request}.txt`, 'utf8', (err, data) => {
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
});

//writing gcode file to COM port
function DriveGcodeFile(data) {
  const lines = data.split('\n');
  let currentIndex = 0;
  let LinesDone = false;

  function sendNextLine() {
    if (currentIndex < lines.length) 
    {
      const line = lines[currentIndex].trim();

      if (line !== '') {
        console.log('Sendt data: ', line);
        port2.write(`${line}\n`, (err) => {
          if (err) {
            console.error('Error writing to serial port:', err.message);
          }
        });
      }
      currentIndex++;
    }
    else
    {
      port2.write('?\n');
    }
  }

  port2.on('data', (data) => {
    if (data.toString().trim() === 'ok') {
      sendNextLine();
    }
  });

  sendNextLine();
}


function FresProgram()
{
  port.write("M90");
  fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\fres.txt`, 'utf8', (err, data) => {
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
//drives the CNC home at startup
setTimeout(()=>{
  port2.write('$H\n');
  port2.write('G92 X0 Y0 Z0\n');
},3500)

// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
