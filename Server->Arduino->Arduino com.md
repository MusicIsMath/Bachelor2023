# Finnished prototype for communication

We are using a javascript / nods.js server. From the server (localhost:3000), we can now innput a string containing info, to for example turn on led-lights on the slave arduino

## Slave / tool arduino code:
```
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);
//setting first char in char array to '0' clears whole array
//Char that will represent what type of tool
char tool[] = "E";
char RChar[20];

  void setup()
  {
    Serial.begin( 9600 );
    mySerial.begin( 9600 );
    delay( 10 );
    SendChar( tool );
    pinMode(9, OUTPUT);
    pinMode(10, OUTPUT);
    pinMode(11, OUTPUT);
    pinMode(12, OUTPUT);
  }

  void loop()
  {
    if ( mySerial.available() ){
      RecieveChar();

      Read();
    }
    delay( 3000 );
    digitalWrite(9, LOW);
    digitalWrite(10, LOW);
    digitalWrite(11, LOW);
    digitalWrite(12, LOW);
  }

  //Recieve data between Arduinos
  void RecieveChar()
  {
    //The number stands for how many char it will read

    int j = mySerial.available();
    for ( int i = 0; i < j; i++ )
    {
      RChar[i] = mySerial.read();
    }
    Serial.println(RChar);
    Serial.println(j);
  }
  //Send data between Arduinos
  void SendChar( char text[] )
  {
    mySerial.println( text );
  }

  //Reads recived string and checks what it includes
  void Read()
  {
    if ( RChar[0] == 'M' ){
      Led();
    }
    delay(1000);
    RChar[0] = 0;
  }

  void Led()
  {
    if ( RChar[1] == '1' ) digitalWrite(9, HIGH);
    if ( RChar[2] == '2' ) digitalWrite(10, HIGH);
    if ( RChar[3] == '3' ) digitalWrite(11, HIGH);
      if ( RChar[1] == '1' && RChar[2] == '2' && RChar[3] == '3' ){
      digitalWrite(12, HIGH);
    }
  }
  ```
  ## master / cnc tool arduino code:
  ```
  #include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial mySerial(2, 3);
// create servo object to control a servo
Servo lock;
// variable to store new servo position
int Npos;
// variable to store current servo position
int Cpos = 0;
//Lock state
bool LockState;

//Has to always be 1 bigger than message recieving
char RChar[5];

  void setup() 
  {
    Serial.begin( 9600 );
    mySerial.begin( 9600 );
    //Sets pinMode for lock function
    lock.attach(13);
    lock.write( Cpos );
  }

  void loop() 
  {
    if( mySerial.available() ){
      myRecieveChar();

      Read();
    }
    if( Serial.available() ){
      RecieveChar();

      Read();
    }

    delay( 300 );
  }

  //Recieve data between Arduinos and to rasPI
  void myRecieveChar()
  {
    //The number stands for how many char it will read
    //Will wait till there is that many char to read
    mySerial.readBytes(RChar, 4);
  }
  void RecieveChar()
  {
    //The number stands for how many char it will read
    //Will wait till there is that many char to read
    Serial.readBytes(RChar, 4);
  }

  //Send data between Arduinos
  void SendChar( char text[] )
  {
    mySerial.println( text );
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
    //Closes lock
    if( Cpos < 90 ){
      Npos = 90;
      lock.write( Npos );
      Cpos = Npos;
      LockState = true;
    }
    //Opens lock
    else if( Cpos > 0 ){
      Npos = 0;
      lock.write( Npos );
      Cpos = Npos;
      LockState = false;
    }
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
