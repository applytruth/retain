# Retain Study App

- This is to assist with studying Heisig Kanji allowing for updates.
- The UI is React (React 18/Vite)
- The API is Spring Boot (Java 17/maven)

## Why does it read and write to a JSON file?!?
- Because there are over 2k kanji and I need to get through each chapter to set up the information
- Once the correct number matches each character, the JSON could be used to load into a DB with the correct index.
- In the meantime, putting the data into JSON allows me to share this app w/o db set up.


## To run
- Start the API with `./mvnw spring-boot: run`
- Then start the UI:  `npm run dev`
