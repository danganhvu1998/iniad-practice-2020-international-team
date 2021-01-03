#### Introduction
This project is to provide all RESTFUL APIs & do some processes in backend for Iniad Project Web Application

#### How Socket work
* Request send to `src/server.js`
  * Then the request will be sent to `/src/middleware/socket.io/index.js`
  * Each `socker.io` request contain 2 path: `eventName` and `eventData`. Each `eventName` will trigger a function to start. This function will then process the given data in `evenData`
