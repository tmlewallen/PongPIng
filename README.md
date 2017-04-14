# PongPing
 data display page for ping pong table usage
 
 ## TODO 
 - [x] To Do List! 
 - [ ] Styling
 - [ ] Inputs for time window and poll period
 - [ ] Deploy (lol)
 - [ ] Better webpack usage - move everything needed to dist folder
 
 ## Running
 
 ### App
 
 Rename `env-sample.sh` to `env.sh` and add your own mongodb details (or leave them blank and connect to a local db)
 
 `yarn install`
 
 `webpack --watch`
 
 `npm start`
 
 ### Serial
 
 Rename `env-sample.sh` to `env.sh` and add your own mongodb details (or leave them blank and connect to a local db). _You'll need write access (of course)_
 
 Connect an arduino and look up the serial port it's connected to. Then run
 
 `npm run pi {port name}`