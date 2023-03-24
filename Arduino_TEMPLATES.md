# Bachelor2023
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
  }
  //Reads recived string and checks what it includes
  void Read(String s)
  {
    String c = s.substring(0, 1);
    if (c == "S" || c == "E" || c == "F") Serial.println(c);
    else if (c == "T") SerialArduino.println(s);
    else if (c == "L") Lock();

    ClearSerial();
  }
  //Read Serial from Arduino
  void ReadSerialArduino()
  {
    String s = SerialArduino.readString();
    s.trim();
    Read(s);   
  }
  //Read Serial
  void ReadSerial()
  {
    String s = Serial.readString();
    s.trim();
    Serial.print("From RPi: ");
    Serial.println(s);
    Read(s);
  }
  //Checks lock state and executes lock function
  void Lock()
  {
    //Closes lock
    if(Cpos < 90){
      Npos = 90;
      lock.write(Npos);
      unsigned long time = millis();
      Serial.println("Waiting for tool");
      while(SerialArduino.available() == 0 && (millis() - time) < 5000);
      if(Serial.available()){
        String s = Serial.readString();
        Serial.println("From RPi during locking attempt");
        Serial.print(s);
      }
      if(SerialArduino.available()){
        ReadSerialArduino();
        Serial.println("Tool found");
      }
      else{
        Npos = 0;
        lock.write(Npos);
        Serial.println("Tool not found");
      }
    }
    //Opens lock
    else if(Cpos > 0){
      Npos = 0;
      lock.write(Npos);
    }
    Cpos = Npos;
  }
  void ClearSerial()
  {
    String s = Serial.readString();
    s = SerialArduino.readString();
  }
  ```
  ```
//Master(TOOL)
#include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial SerialArduino(2, 3);
//setting first char in char array to '0' clears whole array
//Char that will represent what type of tool
bool tool = false;

Servo fres;
int rpm;

void setup()
{
  SerialArduino.begin(9600);
  fres.attach(9);
  fres.writeMicroseconds(0);
}

void loop()
{
  if(!tool){
    SerialArduino.println("F");
    tool = true;
  }

  if (SerialArduino.available()){
    Read();
  }
}
//Reads recived string and checks what it includes
void Read()
{
  String s = SerialArduino.readString();
  String c = s.substring(0, 1);
  s.remove(0, 1);
  if (c == "T"){ 
    StartFres(s);
  }
}
void StartFres(String s)
{
  //Convert RPM
  int throttle = map(s.toInt(), 0, 21600, 875, 2000);
  throttle = constrain(throttle, 875, 2000);
  fres.writeMicroseconds(throttle);
}
```
![image](https://user-images.githubusercontent.com/117755321/213415089-cd3c861e-a002-4c09-b58d-de40393c7096.png)
