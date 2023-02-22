# Finnished prototype for communication

![image](https://user-images.githubusercontent.com/112080849/213199854-3f84971f-4d24-4510-b236-72f3c050e286.png)

We are using a javascript / nods.js server. From the server (localhost:3000), we can now innput a string containing info, to for example turn on led-lights on the slave arduino

## Slave / tool arduino code:
```
//SLAVE
#include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial SerialArduino(2, 3);
Servo lock; // create servo object to control a servo
int Npos; // variable to store new servo position
int Cpos = 0; // variable to store current servo position

  void setup() 
  {
    Serial.begin(9600);
    SerialArduino.begin(9600);
    lock.attach(9); //Sets pinMode for lock function
    lock.write(Cpos);
  }

  void loop() 
  {
    //Recieve data between Arduinos
    if(SerialArduino.available()){
      ReadSerialArduino();
    }
    //Recieve data between Arduino to rasPI
    if(Serial.available()){
      ReadSerial();
    }
    delay(10);
  }
  //Reads recived string and checks what it includes
  void Read(char c, char text[])
  {
    if (c == 'M'){
      SerialArduino.println(text);
    }
    else if (c == 'S' || c == 'E' || c == 'F'){ 
      Serial.println(c);
    }
    else if (c == 'L') Lock();
  }
  //Read Serial from Arduino
  void ReadSerialArduino()
  {
    char c = SerialArduino.read();
    char text[SerialArduino.available()];
    if(SerialArduino.available() > 0){
      SerialArduino.readBytes(text, SerialArduino.available());
    }
    Read(c, text);
  }
  //Read Serial
  void ReadSerial()
  {
    char c = Serial.read();
    char text[Serial.available()];
    if(Serial.available() > 0){
      Serial.readBytes(text, Serial.available());
    }
    Read(c, text);
  }
  //Checks lock state and executes lock function
  void Lock()
  {
    //Closes lock
    if(Cpos < 90){
      Npos = 90;
      lock.write(Npos);
      int time = millis();
      while(SerialArduino.available() == 0 && (millis() - time) < 5000);
      if(SerialArduino.available()){
        ReadSerialArduino();
      }
      else{
        Npos = 0;
        lock.write(Npos);
      }
    }
    //Opens lock
    else if(Cpos > 0){
      Npos = 0;
      lock.write(Npos);
    }
    Cpos = Npos;
  }
  ```
  ## master / cnc tool arduino code:
  ```
//Master(TOOL)
#include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial SerialArduino(2, 3);
//setting first char in char array to '0' clears whole array
//Char that will represent what type of tool
bool tool = false;

Servo fres;

int pos = 0;

void setup()
{
  SerialArduino.begin(9600);
  delay(10);
  for(int i=9;i<13;i++) pinMode(i, OUTPUT);
  fres.attach(6);
}

void loop()
{
  digitalWrite(12, HIGH);

  if(!tool){
    SerialArduino.println('S');
    tool = true;
  }

  if (SerialArduino.available()){
    ReadSerialArduino();
  }
  delay(10);
}
//Reads recived string and checks what it includes
void Read(char c, char text[])
{
  if (c == 'M'){
    Led(text);
  }
  else if (c == 'F'){ 
    StartFres(text);
  }
}
//Read Serial from Arduino
void ReadSerialArduino()
{
  char c = SerialArduino.read();
  char text[SerialArduino.available()];
  if(SerialArduino.available() > 0){
    SerialArduino.readBytes(text, SerialArduino.available());
  }
  Read(c, text);
}
void StartFres(char text[])
{
  if(text[0] == '0'){
    fres.write(0);
  }
  else{
    fres.write(text);
  }
}
//Turns on LED dependent on cryptic code
void Led(char text[])
{
  if (text[1] == '1') digitalWrite(12, LOW);
  delay(1000);
}
  ```
  
  ## server / js code:
  ```
  const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize serial port
const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
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
## simple explanation of what this has achieved:
We can now send a string that contains information from the localhost:3000 to the tool and from the tool back to the server.
So when the tool (slave) is connected we recieve a char, for example 'A'. This will be used to tell the server / system what tool just get connected to the CNC

Example of sending information:

![image](https://user-images.githubusercontent.com/112080849/213180595-677927b7-3080-49d7-9e95-4d4fd7beef36.png)

This "code" message, means "M" for message, 1 for turning on light 1, 2 for light 2 etc...

When we click submit, we see the lights turn on, on the tool-arduino as expected. This will be used to send information for the raspberry pi to the tool currently connected. As we now will know what tool it is, and the tool will recieve information in the form of user innput.
