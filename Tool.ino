// Master(TOOL)
#include <SoftwareSerial.h>
#include <Servo.h>

SoftwareSerial SerialArduino(2, 3); // Initialize a SoftwareSerial object for communication
// between the master (TOOL) and slave (CNC machine) Arduino

// Declare variables and objects
bool tool = false; // Represents whether the tool is active or not
Servo fres; // Servo object for controlling the tool
int rpm; // Variable for storing RPM value

void setup()
{
  SerialArduino.begin(9600); // Initialize the serial communication with the specified baud rate
  fres.attach(9); // Attach the servo to pin 9
  fres.writeMicroseconds(0); // Initialize the servo position to 0 degrees
}

void loop()
{
  if (!tool) { // If the tool is not active
    SerialArduino.println("F"); // Send the command 'F' to activate the tool
    tool = true; // Set the tool state to active
  }

  if (SerialArduino.available()) { // If there is data available to read from the serial port
    Read(); // Call the Read function to process the received string
  }
}

// Reads the received string and checks its content
void Read()
{
  String s = SerialArduino.readString(); // Read the string from the serial port
  String c = s.substring(0, 1); // Extract the first character of the string
  s.remove(0, 1); // Remove the first character from the string

  if (c == "T") { // If the first character is 'T', indicating a tool change command
    StartFres(s); // Call the StartFres function to start the tool with the specified RPM
  }
}

// Starts the tool with the specified RPM
void StartFres(String s)
{
  int throttle = map(s.toInt(), 0, 21600, 875, 2000); // Convert the RPM value to a servo throttle value
  throttle = constrain(throttle, 875, 2000); // Constrain the throttle value within the valid range
  fres.writeMicroseconds(throttle); // Set the servo position based on the throttle value
}
