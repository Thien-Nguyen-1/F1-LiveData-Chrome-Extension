# F1 Chrome Extension

A chrome sidebar extension which displays various real time data during a Formula One race event to enhance user experience. 


### Features
- **Team Radio**: plays live radio messages whilst temporarily muting chrome tabs. Transcript is also provided for readbility.
- **FIA Feed**: information provided by race control pertaining a race is displayed. Text-To-Speech (TTS) reads new information aloud.
- **Driver Data**: The driver's car **speed**, **RPM (Rounds Per Minute)** and **DRS (Drag Reduction System)** are displayed and updated.
- **Venue Data**: Information regarding the venue hosting a Formula One race is displayed. One notable feature is the weather section, showing the **temperature**, **wind speed** and **wind direction**.


### Set Up Instructions
- In the *.env* file, place your AssemblyAI API key in order for the transcript functionality to work.
- Run ```npm build``` to bundle all files (saved under *dist* directory) and unpack these on chrome://extensions/
