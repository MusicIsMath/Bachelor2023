# Bachelor2023
![image](https://user-images.githubusercontent.com/117755321/213415089-cd3c861e-a002-4c09-b58d-de40393c7096.png)
```
//SLAVE
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

      Read( RChar );
    }
    if( Serial.available() ){
      RecieveChar();

      Read( RChar );
    }
    RChar[0] = 0;
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
  void Read( char text[] )
  {
    if ( text[0] == 'M' ){
      SendChar( text );
    }
    else if ( text[0] == 'E' || text[0] == 'F' ){ 
      SendData( text );
    }
    else if ( text[0] == 'L' ) Lock();
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
  ```
  //Master(TOOL)
#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);
//setting first char in char array to '0' clears whole array
//Char that will represent what type of tool
char tool[] = "E";
char RChar[5];

  void setup()
  {
    mySerial.begin( 9600 );
    delay( 10 );
    SendChar( tool );
    
    for(int i=9;i<13;i++) pinMode(i, OUTPUT);
  }

  void loop()
  {
    if ( mySerial.available() ){
      Read();
    }
    delay( 3000 );
    
    for(int i=9;i<13;i++) digitalWrite(i, LOW);
  }
  //Send data between Arduinos
  void SendChar( char text[] )
  {
    mySerial.println( text );
  }
  
  //Reads recived string and checks what it includes
  void Read()
  {
     //The number stands for how many char it will read
    mySerial.readBytes( RChar , 4 );
    if ( RChar[0] == 'M' ){
      Led( RChar );
    }
    RChar[0] = 0;
  }

  void Led( char text[] )
  {
    if ( text[1] == '1' ) digitalWrite(9, HIGH);
    if ( text[2] == '2' ) digitalWrite(10, HIGH);
    if ( text[3] == '3' ) digitalWrite(11, HIGH);
      if ( text[1] == '1' && text[2] == '2' && text[3] == '3' ){
      digitalWrite(12, HIGH);
    }
  }
```
