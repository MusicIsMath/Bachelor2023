# Finnished prototype for communication

We are using a javascript / nods.js server. From the server (localhost:3000), we can now innput a string containing info, to for example turn on led-light on the slave arduino
This is how we have done it so far:

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
