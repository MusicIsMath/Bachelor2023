# Bachelor2023

## Uke 1:
We started looking at how we can get two Arduino's to communicate:
There are several different types of communicaton methods we could use, here are the main ones:
1. Serial Communication: One Arduino can send data to the other via the serial port (TX and RX pins) using the Serial.write() and Serial.read() functions.

2. I2C Communication: The I2C protocol allows multiple devices to communicate with each other using just two wires (SDA and SCL). To use I2C with Arduinos, you will need to use the Wire library.

3. SPI Communication: The SPI protocol also allows multiple devices to communicate with each other using just a few wires (MOSI, MISO, SCK, and SS). To use SPI with Arduinos, you will need to use the SPI library.

4. Bluetooth Communication: Bluetooth can be used to establish wireless communication between two or more Arduinos using the softwareSerial library and bluetooth module such as HC-05, HC-06.

5. WiFi Communication: WiFi can be used to establish wireless communication between two or more Arduinos using WiFi module such as ESP8266, ESP32.

While other communication methods such as I2C, SPI and Serial communication can also be used to communicate between two Arduinos, UART has certain advantages over these methods when communicating between two Arduinos in close proximity.

- I2C and SPI are both multi-master, multi-slave communication protocols, which means they are suitable for connecting multiple devices together, but they require more wires to connect the devices and may not be necessary if you only have two Arduinos.

- Serial communication, like UART, also uses a single RX pin for both directions of communication. While this makes it easy to implement, it can make it less flexible in situations where you need to communicate with multiple devices simultaneously.

- Bluetooth and WiFi are wireless communication methods, which can be useful for communicating over longer distances, but they require additional hardware and may not be necessary if the two Arduinos are in close proximity.

- UART, on the other hand, uses separate TX and RX pins for each direction of communication, which allows for more flexibility and can be useful in situations where you need to communicate with multiple devices simultaneously. It's simple to implement, requires minimal additional hardware and supports standard baudrate settings, making it a suitable choice for small data transfer and minimal communication requirements.

In summary, while other communication methods such as I2C, SPI, Serial, Bluetooth and WiFi can also be used to communicate between two Arduinos, UART has certain advantages over these methods when communicating between two Arduinos in close proximity. UART uses separate TX and RX pins for each direction of communication, it's simple to implement, requires minimal additional hardware, supports standard baudrate settings, making it a suitable choice for small data transfer and minimal communication requirements.
