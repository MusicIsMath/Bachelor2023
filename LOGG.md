# Bachelor2023

## Uke 1:
We started looking at how we can get two Arduino's to communicate:
There are several different types of communicaton methods we could use, here are the main ones:
1. Serial Communication: One Arduino can send data to the other via the serial port (TX and RX pins) using the Serial.write() and Serial.read() functions.

2. I2C Communication: The I2C protocol allows multiple devices to communicate with each other using just two wires (SDA and SCL). To use I2C with Arduinos, you will need to use the Wire library.

2. SPI Communication: The SPI protocol also allows multiple devices to communicate with each other using just a few wires (MOSI, MISO, SCK, and SS). To use SPI with Arduinos, you will need to use the SPI library.

3. Bluetooth Communication: Bluetooth can be used to establish wireless communication between two or more Arduinos using the softwareSerial library and bluetooth module such as HC-05, HC-06.

4. WiFi Communication: WiFi can be used to establish wireless communication between two or more Arduinos using WiFi module such as ESP8266, ESP32.
