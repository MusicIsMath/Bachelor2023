```
// Unit tests for Arduino program

// Test StartFres function
void testStartFres() {
  // Test for a given input RPM
  String s = "5000";
  int expected = 1395;
  StartFres(s);
  int actual = fres.readMicroseconds();
  assert(expected == actual);
  
  // Test for constraining the throttle value
  s = "10800";
  expected = 1438;
  StartFres(s);
  actual = fres.readMicroseconds();
  assert(expected == actual);
}

// Test Read function
void testRead() {
  // Test for reading a string
  SerialArduino.write("T5000");
  String expected = "T5000";
  String actual = Read();
  assert(expected == actual);
  
  // Test for extracting the first character
  expected = "T";
  actual = c;
  assert(expected == actual);
  
  // Test for removing the first character
  expected = "5000";
  actual = s;
  assert(expected == actual);
  
  // Test for calling StartFres function
  expected = 1395;
  StartFres(s);
  int actual = fres.readMicroseconds();
  assert(expected == actual);
}

// Test loop function
void testLoop() {
  // Test for sending 'F' to SerialArduino
  tool = false;
  loop();
  String expected = "F\n";
  String actual = SerialArduino.readString();
  assert(expected == actual);
  
  // Test for reading from SerialArduino
  SerialArduino.write("T5000");
  expected = 1395;
  loop();
  int actual = fres.readMicroseconds();
  assert(expected == actual);
}

void assert(bool condition) {
  if (!condition) {
    while (true);
  }
}
```
