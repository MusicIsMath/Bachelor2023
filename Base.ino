//SLAVE (Base)
#include <SoftwareSerial.h>
#include <Servo.h>

SoftwareSerial SerialArduino(2, 3); // Software serial communication for Arduino
Servo lock; // Create a servo object to control a servo
int Npos; // Variable to store the new servo position
int Cpos = 0; // Variable to store the current servo position

void setup()
{
Serial.begin(9600); // Initialize serial communication
SerialArduino.begin(9600); // Initialize software serial communication
lock.attach(9); // Sets pinMode for lock function
lock.write(Cpos); // Sets initial servo position
}

void loop()
{
// Receive data between Arduinos
if (SerialArduino.available()) {
ReadSerialArduino();
}
// Receive data between Arduino and rasPI
if (Serial.available()) {
ReadSerial();
}
}

// Reads received string and checks its contents
void Read(String s)
{
String c = s.substring(0, 1);
if (c == "S" || c == "E" || c == "F") {
Serial.println(c); // Print the character to the serial monitor
}
else if (c == "T") {
SerialArduino.println(s); // Forward the string to the other Arduino
}
else if (c == "L") {
Lock(); // Execute lock function
}

ClearSerial(); // Clear any remaining data in the serial buffer
}

// Read serial data from Arduino
void ReadSerialArduino()
{
String s = SerialArduino.readString();
s.trim();
Read(s);
}

// Read serial data
void ReadSerial()
{
String s = Serial.readString();
s.trim();
Serial.print("From RPi: ");
Serial.println(s);
Read(s);
}

// Check lock state and execute lock function
void Lock()
{
// Close the lock
if (Cpos < 90) {
Npos = 90;
lock.write(Npos);
}
// Open the lock
else if (Cpos > 0) {
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
