# Bachelor2023

## Uke 1:
### 12.01.23
### Arduino communication
We started looking at how we can get two Arduino's to communicate:
There are several different types of communicaton methods we could use, here are the main ones:
1. Serial Communication: One Arduino can send data to the other via the serial port (TX and RX pins) using the Serial.write() and Serial.read() functions.

2. I2C Communication: The I2C protocol allows multiple devices to communicate with each other using just two wires (SDA and SCL). To use I2C with Arduinos, you will need to use the Wire library.

3. SPI Communication: The SPI protocol also allows multiple devices to communicate with each other using just a few wires (MOSI, MISO, SCK, and SS). To use SPI with Arduinos, you will need to use the SPI library.

4. Bluetooth Communication: Bluetooth can be used to establish wireless communication between two or more Arduinos using the softwareSerial library and bluetooth module such as HC-05, HC-06.

5. WiFi Communication: WiFi can be used to establish wireless communication between two or more Arduinos using WiFi module such as ESP8266, ESP32.

While other communication methods such as I2C, SPI and Serial communication can also be used to communicate between two Arduinos, UART has certain advantages over these methods when communicating between two Arduinos in close proximity.

- I2C and SPI are both multi-master, multi-slave communication protocols, which means they are suitable for connecting multiple devices together, but they require more wires to connect the devices and may not be necessary if you only have two Arduinos.

- Serial communication, like UART, also uses a single RX pin for both directions of communication. While this makes it easy to implement, it can make it less flexible in situations where you need to communicate with multiple devices simultaneously.

- Bluetooth and WiFi are wireless communication methods, which can be useful for communicating over longer distances, but they require additional hardware and may not be necessary if the two Arduinos are in close proximity.

- UART, on the other hand, uses separate TX and RX pins for each direction of communication, which allows for more flexibility and can be useful in situations where you need to communicate with multiple devices simultaneously. It's simple to implement, requires minimal additional hardware and supports standard baudrate settings, making it a suitable choice for small data transfer and minimal communication requirements.

In summary, while other communication methods such as I2C, SPI, Serial, Bluetooth and WiFi can also be used to communicate between two Arduinos, UART has certain advantages over these methods when communicating between two Arduinos in close proximity. UART uses separate TX and RX pins for each direction of communication, it's simple to implement, requires minimal additional hardware, supports standard baudrate settings, making it a suitable choice for small data transfer and minimal communication requirements.

We then tested this in Thinkercad:

```
//Arm? som utfører noe
char Mymessage[2];

int LED = 0;

const int buttonPin = 2;
int buttonState = 0;
  
  void setup()
  {
    Serial.begin(9600);
    
    pinMode (LED, OUTPUT);
    pinMode( buttonPin, INPUT );
  }
  
  void loop()
  {
    Serial.readBytes(Mymessage,3);  
    
    if ( Mymessage[0] == 'A')
    {
      LED = 9;
    }  
    if ( Mymessage[0] == 'B')
    {
      LED = 10;
    }
    if ( Mymessage[0] == 'C')
    {
      LED = 11;
    }
    
    buttonState = digitalRead( buttonPin );
    
    if ( buttonState == HIGH )
    {
      digitalWrite(LED,HIGH);
      delay(200);
    }
    else
    {
      digitalWrite(LED,LOW);
    } 
    delay(1000);
  }

//Verktøy som sender informasjon om seg selv

char Mymessage[] = "Abc";

  void setup() 
  {
    Serial.begin(9600);
  }

  void loop() 
  {
    Serial.write(Mymessage);

    delay(1000);
  }
  ```
  ![image](https://user-images.githubusercontent.com/112080849/212087310-0f8803e8-992e-4cda-ac3c-7811079107e7.png)



--------------------------------------------------------------------------------------------------------------------------


### 15.01.23
### Learning the basics of javascript / VC code
Started looking at a basic example from youtube (https://www.youtube.com/watch?v=VShtPwEkDD0&t=248s):
![image](https://user-images.githubusercontent.com/112080849/212546363-8160a28f-93fa-4926-b000-cc21ce96c05f.png)

Things to note:
- We have to pick "bash" in the terminal window in VS code, if not the command "node Oving1.js" wont work
- The project / file has to be saved in a handpicked folder, before you even start
  
We can now make a function for the "response" (line 4) which in short just means what will we output on the website:
```
const server = http.createServer(function(req,res){
    res.write('hello node')
    res.end()
})
```
At last we check the localhost:

![image](https://user-images.githubusercontent.com/112080849/212546740-77240cae-ee71-4777-be7b-e52393911730.png)


We can now make a HTML file that we want to render:
- click "new file" under current project folder
- call it whatever.html
- type "!" and hit enter, this auto generates the outline of html file:
![image](https://user-images.githubusercontent.com/112080849/212547366-9a71fe34-3038-45a7-9b2b-3175fab083f7.png)

I typed inn "This is HTML" in the body, this is whats gonna show on out local host when we are done.

Now we got back to the javascript program, bc we have to do some rewriting of the code, to make it communicate with the html file:

Rewriting of line 4 function:
```
const server = http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile('index.html',function(error,data){
        if (error)
        {
            res.writeHead(404)
            res.write('Error: file not found')
        }
        else
        {
            res.write(data)
        }
        res.end
    })
})
```

We now, kill and restart the server using the terminal then refresh the localhost in our browser, we see this:
![image](https://user-images.githubusercontent.com/112080849/212547528-51b1f427-e6a6-432c-befe-69b9a85a4b4f.png)

### Raspberry Pi and node.js communication:

https://github.com/meech-ward/NodeJs-Raspberry-Pi

--------------------------------------------------------------------------------------------------------------

## Uke 2
### 16.01.23
### Raspberry Pi and Arduino communication:

```
import com.fazecast.jSerialComm.SerialPort;

public class App 
{
    public static void main(String[] args) throws Exception 
    {
        //Serial Communication Setup
        SerialPort sp = SerialPort.getCommPort("COM4");
          sp.setComPortParameters(9600, 8, 1, 0);
          sp.setComPortTimeouts(SerialPort.TIMEOUT_WRITE_BLOCKING, 0, 0);

          //Open port
          sp.openPort();

          //Connetion status
          if(sp.openPort()) System.out.println("Opened");
          else System.out.println("Open failed");

          if(sp.closePort()) System.out.println("Closed");
          else System.out.println("Closed failed");

          //Send Integer to Arduino
          Integer x = 1;

          sp.getOutputStream().write(x.byteValue());
          sp.getOutputStream().flush();

          //Recieve from COM port
          byte[] y = new byte[100];
          //Amount of bytes
          int numRead = sp.readBytes(y, y.length);
          //Find out why string needs to be written like this
          String S = new String(y, "UTF-8");

          System.out.println(numRead + " bytes: " + S);

          //Close port
          sp.closePort();
    }
}
```
### Arduino and javascript / node.js communication:
Not yet sure if this will be needed / used in our project, at this point.
![image](https://user-images.githubusercontent.com/112080849/212664220-d1044d9b-b82d-45ed-91c7-15a47c7c2ecc.png)

for this example / learning process, i will be attempting to connect a basic potentiometer circuit on my arduino and then connecting this to my server and read its status via a web-browser

Circuit:

![image](https://user-images.githubusercontent.com/112080849/212668088-b10133a8-c5ca-42a9-ade0-4b377668bd98.png)

Code:

![image](https://user-images.githubusercontent.com/112080849/212671124-703191f5-904e-4864-96a2-c22646142fe6.png)

Installing packages for Serialport and socket.io:

- make a new folder
- enter the folder via the terminal window

![image](https://user-images.githubusercontent.com/112080849/212685445-944b6b06-4221-4324-a221-ef4373a7fad0.png)

- type "npm init"
- install the packages:

![image](https://user-images.githubusercontent.com/112080849/212685629-3b21c01a-461a-4d83-95f5-ebcf1b63eb4e.png)

We can now make a quick .js program to read from the serialport on the arduino:

![image](https://user-images.githubusercontent.com/112080849/212694966-d03736f7-ce5e-4170-8e3b-c556c1dec600.png)

Currently struggeling with an error, if there was no bugs, we should now see the potentiometer value in the terminal window in Visual studio Code

The problem was, that i had not defined the Readline, i swapped out the code and it now works:

![image](https://user-images.githubusercontent.com/112080849/212701516-27d22648-2b65-43c0-951a-70b3e2938a4e.png)

### Slave Arduino prototype:
```
char SMymessage[4];
char RMymessage[2];

String Sdata;

  void setup() 
  {
    Serial.begin(9600);
  }

  void loop() 
  {
    RecieveChar();
    SendData();
    
    //If there is a message from rPI read it
    if(Serial.available()) RecieveData();
    //If message to send is not empty send message
    if(strlen(SMymessage) != 0)
    {
      SendChar(SMymessage);
    }
    delay(500);
  }

  //Recieve data between Arduinos
  void RecieveChar()
  {
    //the number stands for how many char it will read
    Serial.readBytes(RMymessage,3);
  }
  //Send data between Arduinos
  void SendChar(char text[])
  {
    Serial.write(text);
  }

  //Recieve data between Arduino and RasPI
  void RecieveData()
  {
    //Turns recieved string to the char array "SMymessage"
      Serial.readString().toCharArray(SMymessage,5);
  }
  //Send data between Arduino and RasPI
  void SendData()
  {
    Serial.println(Sdata);
  }
```

### Master Arduino(Tool) TEMPLATE:
```
//setting first char in char array to '0' clears whole array

//Char that will represent what type of tool
char Tool[] = "M";
char RMymessage[9];

  void setup()
  {
    Serial.begin(9600);
    SendChar();
  }

  void loop()
  {
    RecieveChar();
    
    delay(500);
  }

  //Recieve data between Arduinos
  void RecieveChar()
  {
    //the number stands for how many char it will read
    Serial.readBytes(RMymessage,10);
  }
  //Send data between Arduinos
  void SendChar()
  {
    Serial.write(Tool);
  }
```

### 17.01.23
### Read and write arduino / javascript / node.js:
#### JS code:
```
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: 'COM3', baudRate: 9600 })
const parser = new ReadlineParser();

port.pipe(parser);

parser.on('data', (data) => {
    console.log(data);
    port.write('A')
});

port.on('open', () => {
    console.log('Serial port is open')
});
```

#### Arduino / c++ code:
```
int percent = 0;
int prevPercent = 0;
char InnValue=0;
char p[100];

void setup() {
  Serial.begin(9600);
  pinMode(12,OUTPUT);
  digitalWrite(12,LOW);
}

void loop() {
  Serial.readBytes(p,1);
  percent = round(analogRead(2) / 1024.00*100);
  if (percent != prevPercent)
  {
    Serial.println(percent);
    prevPercent = percent;
  }
  if (p[0]=='A')
  {
    digitalWrite(12,HIGH);
  }
  delay(100);

}
```

Alot of the code is from previous days of testing, the only "new" thing is that we have now added code for sending information from the javascript server / raspberry pi (in the upcomming future)

We tested this by sending the char 'A' from the server to the arduino board, and in the arduino's code we turn on a lamp if the SerialRead == 'A'


https://user-images.githubusercontent.com/112080849/212879175-1c93da63-7cb8-4d08-9f8c-46906f06036c.mp4

#### Planlegning:
![image](https://user-images.githubusercontent.com/112080849/212896021-5093b116-e801-4eb7-a6a5-ed3a46e3085f.png)

#### NEW TOOL TEMPLATE 3000!:
```
//setting first char in char array to '0' clears whole array

//Char that will represent what type of tool
char tool[] = "E";
char RChar[5];

  void setup()
  {
    Serial.begin( 9600 );
    delay( 10 );
    SendChar( tool );
  }

  void loop()
  {
    if ( Serial.available() ){
      RecieveChar();
      
      Read();
    }
    delay( 5000 );   
  }

  //Recieve data between Arduinos
  void RecieveChar()
  {
    //The number stands for how many char it will read
    Serial.readBytes( RChar, 4 );
  }
  //Send data between Arduinos
  void SendChar( char text[] )
  {
    Serial.write( text );
  }
  
  //Reads recived string and checks what it includes
  void Read()
  {
    if ( RChar[0] == 'M' ){
      
    }
  }

```
#### Updated slave arduino(with lock function):
```
//Has to always be 1 bigger than message recieving
char RChar[5];
//DigitalPIN for lock function
int lock = 2;

  void setup() 
  {
    Serial.begin( 9600 );
    //Sets pinMode for lock function
    pinMode( lock, OUTPUT );
  }

  void loop() 
  {
    if( Serial.available() ){
      RecieveChar();
      
      Read();
    }
    
    delay(300);
  }

  //Recieve data between Arduinos and to rasPI
  void RecieveChar()
  {
    //The number stands for how many char it will read
    //Will wait till there is that many char to read
    Serial.readBytes( RChar, 4 );
  }

  //Send data between Arduinos
  void SendChar( char text[] )
  {
    Serial.write( text );
  }
  
  //Send data between Arduino and RasPI
  void SendData( char text[] )
  {
    Serial.println( text );
  }

  //Reads recived string and checks what it includes
  void Read()
  {
    if ( RChar[0] == 'M' ){
      SendChar( RChar );
    }
    else if ( RChar[0] == 'E' || RChar[0] == 'F' ){ 
      SendData( RChar );
    }
    else if ( RChar[0] == 'L' ) Lock();
  }

  //Checks lock state and executes lock function
  void Lock()
  {
    if ( RChar[1] == '1' ){
      //Closes lock
      digitalWrite(lock, HIGH);
    }
    else if ( RChar[1] == '0' ){
      //Opens lock
      digitalWrite( lock, LOW );
    }
  }
```

### 18.01.23
### write chars from localhost to turn on lights on the arduino:
#### JS code:
```
const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize serial port
const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = new ReadlineParser();
port.pipe(parser);

// Listen for port to open
port.on('open', () => {
    console.log('Serial port is open');
});

// Listen for incoming data
parser.on('data', (data) => {
    console.log(data);
});

// Handle GET request to root route
app.get('/', function(req, res) {
  res.send(`
    <form action="/" method="POST">
      <label>Enter a character:</label>
      <input type="text" name="character">
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle POST request to root route
app.post('/', function(req, res) {
    const character = req.body.character || 'X';    
    port.write(character);                           
    console.log(character); 
});

// Listen for connections on port 3000
app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
```

#### Example:

![image](https://user-images.githubusercontent.com/112080849/213157860-ccf3acf7-37ce-42aa-80e1-e676440e8bdb.png)

![image](https://user-images.githubusercontent.com/112080849/213158357-47b38a29-9fec-4efe-b095-c34b1bc31ab7.png)

So 'A' = Light 1, 'B' = light 2 etc...

This "system" is a part of the total system, more spesifically the part where we wish to send information (in the form of a string) from the pc, where the system then vil take in this info and do: x,y,z etcetc based on the info.

### 24.01.23
```
const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const app = express();
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

// Listen for incoming data
parser.on('data', (data) => {
  console.log(data);
});
parser2.on('data', (data) => {
  console.log(data);
});

// Handle GET request to root route
app.get('/', function(req, res) {
  res.send(`
    <form action="/" method="POST">
      <label>Enter a character:</label>
      <input type="text" name="character">
    </form>
  `);
});

// Handle POST request to root route
app.post('/', function(req, res) {
  const character = req.body.character || 'X';
  if(character[0]=='M')
  {
    port.write(character);
    console.log(character); 
  }

  else if(character[0]=='G')
  {
    port2.write(character+"\n");
    console.log(character);
  }

  else if(character=='Home'||'home')
  {
    port2.write('G28 Z Y'+"\n");
    console.log(character);
  }

  else if(character=='Demo'||'demo')
  {
    port2.write('G0 Z Y F8000'+"\n");
    console.log(character);
  }
});


// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
```
### 25.01.23
"completed" code for running 3 demos on the arduino, with input from localhost:3000. One demo for playing a song, one for random aggressive movement and one simulating tool change movement.
```
const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs');
const app = express();
let NextOk = true;
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

// Listen for incoming data
parser.on('data', (data) => {
  console.log(data);
});
parser2.on('data', (data) => {
  if(data=='ok')
  {
    NextOk = true;
  }
  console.log(data);
});

// Handle GET request to root route
app.get('/', function(req, res) {
  res.send(`
    <form action="/" method="POST">
      <label>Enter a character:</label>
      <input type="text" name="character">
    </form>
  `);
});

// Handle POST request to root route
app.post('/', function(req, res) {
  const character = req.body.character || 'X';
  if(character[0]=='M')
  {
    port.write(character);
    console.log(character); 
  }

  //manully input coordinates
  else if(character[0]=='G')
  {
    port2.write(character+"\n");
    console.log(character);
  }

  //position itself at home
  else if(character=="Home"|| character=="home")
  {
    port2.write("G28 Z Y"+"\n");
    console.log(character);
  }

  //Reads a gcode file and sends it to the serialport with a buffer
  else if(character=="Demo1"|| character=="demo1" || character=="joplin") 
  {
    fs.readFile('C:\\Users\\joaki\\OneDrive\\Skrivebord\\JOPLIN.txt', 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        const lines = data.split('\n');
        let i = 1;
        port2.write(lines[0]+'\n');
        setInterval(()=>{
          if(NextOk)
          {
            port2.write(lines[i]+'\n');
            console.log(lines[i]);
            i++;
            NextOk=false;
          }
        },100)
      }
    });
  }

  //random demo
  else if(character=="Demo2"|| character=="demo2") 
  {
    fs.readFile('C:\\Users\\joaki\\OneDrive\\Skrivebord\\demo2.txt', 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        const lines = data.split('\n');
        let i = 1;
        port2.write(lines[0]+'\n');
        setInterval(()=>{
          if(NextOk)
          {
            port2.write(lines[i]+'\n');
            console.log(lines[i]);
            i++;
            NextOk=false;
          }
        },100)
      }
    });
  }

  //random demo
  else if(character=="Demo3"|| character=="demo3") 
  {
    fs.readFile('C:\\Users\\joaki\\OneDrive\\Skrivebord\\demo3.txt', 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        const lines = data.split('\n');
        let i = 1;
        port2.write(lines[0]+'\n');
        setInterval(()=>{
          if(NextOk)
          {
            port2.write(lines[i]+'\n');
            console.log(lines[i]);
            i++;
            NextOk=false;
          }
        },100)
      }
    });
  }
});

// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
```

### 31.01.23
#### Implemented, stop, emergancy stop, manual drive, optimised code for running demos:
#### JS code:
```
const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs');
const { restart } = require('nodemon');
const app = express();
let NextOk = true;
const home = "G28 Z Y\n";
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
  console.log(data);
});
parser2.on('data', (data) => {
  if(data=='ok')
  {
    NextOk = true;
  }
  console.log(data);
});

app.use(express.static("public"))

// Handle POST request to root route
app.post('/', function(req, res) {
  var character = req.body.character || 'X';
  var RESTART = req.body.Restartbtn || 'X';
  var STOP = req.body.Stopbtn || 'X';
  var ES = req.body.Forcebtn || 'X';
  let [X_verdi,Y_verdi] = (req.body.xy_input || '-1 -1').split(" ");

  //Emergancy stop
  if (ES == "force")
  {
    port2.write('M112\n');
  }
  
  //manual drive of CNC
  else if(parseInt(X_verdi) > -1)
  {
    port2.write(`G1 Z${X_verdi} Y${Y_verdi} F6000\n`);
    console.log(`G1 Z${X_verdi} Y${Y_verdi} F6000\n`);
  }

  //force reset
  else if(RESTART=="restart")
  {
    port2.write('M999\n');
    if(NextOk)
    {
      port2.write(home);
    }
    console.log('restart')
  }

  //stopp after current program
  else if(STOP=="stop")
  {
    port2.write('M999\n');
    console.log('stop')
  }

  //send string info to port1 (tool)
  else if(character[0]=='M')
  {
    port.write(character);
    console.log(character); 
  }

  //Reads a gcode file and sends it to the serialport with a buffer
  else if(character.startsWith("demo")) 
  {
    var print_delay = 100;
    if (character=="demo1") print_delay = 20;
    
    fs.readFile(`C:\\Users\\joaki\\OneDrive\\Skrivebord\\demo${character.substring(4,5)}.txt`, 'utf8', (err, data) => {
      if (err) 
      {
          console.log(err);
      }
      else 
      {
        const lines = data.split('\n');
        let i = 1;
        port2.write(lines[0]+'\n');
        setInterval(()=>{
          if(NextOk)
          {
            port2.write(lines[i]+'\n');
            i++;
            NextOk=false;
          }
        },print_delay)
      }
    });
  }
});


//drives the CNC home at startup
setTimeout(()=>{
  port2.write(home);
},1500)

// Listen for connections on port 3000
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
```

#### HTML code:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <H2>
        Test website for CNC-machine demo

    </H2>

    <form action="/" method="POST">
        <button type="submit" name="Restartbtn" value="restart">Restart</button>
        <button type="submit" name="Stopbtn" value="stop">Stop</button>
        <button type="submit" name="Forcebtn" value="force">Emergancy stop</button>
    </form>

    <H3>
        Coordinate input:
    </H3>
    
    
    <form action="/" method="POST">
        <p> 
        Input format: "x y"                    
        </p>
        <H4>
            XY axsis: <input type="text" name="xy_input">
        </H4>
    </form> 
    
    
    <H3>
        Demo programs:
    </H3>
    
    <P>
        input a demo: example: demo1
    </P>

    <form action="/" method="POST">
        <input type="text" name="character">
    </form>

</body>
</html>
```

### 03.02.23
Tried inverting the x-axsis on the controller with code. We where able to do this, but we realised that the "home" functions in gcode etc. would still not be inverted, this made our gcode convertion tools uselss, so we decided to keep going with a non inverted axsis


### 06.02.23
Downloaded / got license for fusion 360.
Updated the localhost:3000 to make it look a bit better:

![image](https://user-images.githubusercontent.com/112080849/216947693-5f2b2799-a08c-4d9e-aa6d-7bcdde7f2830.png)

### 14.02.23
Implemented code for inverting the x-axsis on the CNC:
```
//inverting of x-axsis
function DriveCNC(Coordinates)
{
  const regex = /Z(-?\d+(\.\d+)?)/; // Regular expression to match the Z-value
  const match = regex.exec(Coordinates);
  if (match) {
    const zValue = parseFloat(match[1]);
    const newZ = 240-zValue;
    Coordinates = Coordinates.replace(regex, `Z${newZ.toFixed(3)}`);
  }
  port2.write(Coordinates);
  console.log(Coordinates);
}
```

### 16.02.23
#### server / JS
- Fixed code (made functions, cleaned up user interface etc)
- Uploaded code to github (see master branch)
- Started working on a realistic tool swap protocol:

  - Step 1: Send the CNC tool the the correct position for Tool n(1,2,3)
  - Step 2: Recieve feedback that the CNC has arrived at the position
  - Step 3: send "Lock" command from the server to the Tool-arduinos
  - Step 4: Recieve feedback from the tool-arduino that the its locked and connected
  - Step 5: Execute Gcode for whatever task you wanna complete!
  
![image](https://user-images.githubusercontent.com/112080849/219381372-83c76436-78ff-4172-930b-3d2d2de5f96c.png)

We have soon come to realise that step 2, recieving live feedback will be a challange, a easy fix would be using sensors like:
- encoders on the x-axsis and y-axsis
- A camera detecting position live and sending it to the server
- 
More interesting solutions would be: 
- calcualtion that predict the time it will take, then wait a delay that is calculated by the prediciton (this brings other challanges by itself)
- Using M114 command to recieve the CNC's current position. Currently having a small problem with the buffer and when it would be optimal to send the M114 command

Also made a function to handle every part of sending gcode, and tried running a demo for drawing to see if the axsis-inverter works as intended:

![image](https://user-images.githubusercontent.com/112080849/219395579-1b2c2156-fd6b-4019-8345-6e6e4eb92c6f.png)


#### Arduino / tool

