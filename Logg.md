# Bachelor2023

## Prosjekt spesifikasjon:

### Project Title: Modularization platform for developing of a CNC machine using multiple tools

Project Description:
The goal of this project is to install circuit boards on various tools used in a CNC machine, in order to enable the machine to identify the currently attached tool by reading the information stored on the circuit board. The circuit boards will be designed to store tool identification information.

### Scope:
- Develop a system for communication:
  1. One circuit board / arduino on the tool itself (communicating with "2")
  2. One circuit board on the moving part of the CNC itself (communicating with "1" & "3")
  3. Raspberry pi, used for sending the CNC end-effektor's xyz coordinates (communicating with "2" & "4")
  4. CNC controll circuit board, used for actually moving the steppet motors (communicating with "3")
  
  Example drawing:
  ![CNC](https://user-images.githubusercontent.com/112080849/212081366-435b20fc-efd4-4602-bfc5-22723c3170e6.PNG)
- Design of a singel or potentially multiple circuit boards for various tools used in the CNC machine
- Installation of circuit boards on the tools
- Integration of the circuit boards with the CNC machine's control system

These are currently the main points, but after this is done we have alot of freedom / possibility to expand the project:
- Closed loop system control on the tools (using the already installed circuit board previously done)
- Develop new software for moving the CNC end-effektor (as the software currently in use is sub-optimal)
- Kamera on the CNC for quality controll / closed loop control and/or kalibration of the tools current posistion, using markers for example

### Technical Requirements:
- Knowledge of circuit design and fabrication
- Experience with CNC machine control systems
- Familiarity with tool identification systems
- Experience with testing and validation of electronic systems

### Timeline:
- Design and development of circuit boards: x weeks
- Installation of circuit boards on the tools: x weeks
- Integration of circuit boards with CNC machine control system: x weeks
- Testing and validation: x weeks

### Budget:
- Cost of circuit board design and fabrication
- Cost of installation and integration of the circuit boards with the CNC machine control system.
