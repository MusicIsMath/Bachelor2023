```
void test_Read(){
  // Test Case 1: String starting with "S"
  String s1 = "S Hello World";
  Serial.flush();
  SerialArduino.flush();
  Read(s1);
  assert(Serial.readString() == "S");

  // Test Case 2: String starting with "E"
  String s2 = "E Hello World";
  Serial.flush();
  SerialArduino.flush();
  Read(s2);
  assert(Serial.readString() == "E");

  // Test Case 3: String starting with "F"
  String s3 = "F Hello World";
  Serial.flush();
  SerialArduino.flush();
  Read(s3);
  assert(Serial.readString() == "F");

  // Test Case 4: String starting with "T"
  String s4 = "T Hello World";
  Serial.flush();
  SerialArduino.flush();
  Read(s4);
  assert(SerialArduino.readString() == "T Hello World");

  // Test Case 5: String starting with "L"
  String s5 = "L";
  Serial.flush();
  SerialArduino.flush();
  Read(s5);
  assert(lock.read() == 90);
}

void test_ReadSerialArduino(){
  String s1 = "S Hello World";
  String s2 = "T Hello World";
  
  // Test Case 1: Reading String starting with "S"
  SerialArduino.write(s1.c_str());
  Serial.flush();
  SerialArduino.flush();
  ReadSerialArduino();
  assert(Serial.readString() == "S");

  // Test Case 2: Reading String starting with "T"
  SerialArduino.write(s2.c_str());
  Serial.flush();
  SerialArduino.flush();
  ReadSerialArduino();
  assert(SerialArduino.readString() == "Hello World");
}

void test_ReadSerial(){
  String s1 = "S Hello World";
  String s2 = "T Hello World";
  
  // Test Case 1: Reading String starting with "S"
  Serial.write(s1.c_str());
  Serial.flush();
  SerialArduino.flush();
  ReadSerial();
  assert(Serial.readString() == "From RPi: S");

  // Test Case 2: Reading String starting with "T"
  Serial.write(s2.c_str());
  Serial.flush();
  SerialArduino.flush();
  ReadSerial();
  assert(Serial.readString() == "From RPi: T Hello World");
}

void test_Lock(){
  // Test Case 1: Lock is closed
  Cpos = 0;
  Lock();
  assert(lock.read() == 90);
  assert(Cpos == 90);

  // Test Case 2: Lock is open
  Cpos = 90;
  Lock();
  assert(lock.read() == 0);
  assert(Cpos == 0);
}

void test_ClearSerial(){
  String s1 = "S Hello World";
  String s2 = "T Hello World";
  
  // Test Case 1: Clearing Serial buffer
  Serial.write(s1.c_str());
  SerialArduino.write(s2.c_str());
  Serial.flush();
  SerialArduino.flush();
  ClearSerial();
  assert(Serial.readString() == "");
  assert(SerialArduino.readString() == "");
}

void assert(bool condition) {
  if (!condition) {
    while (true);
  }
}
```
