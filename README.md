# BestTrip
[![Build Status](https://travis-ci.com/Vidmapps/besttrip.svg?branch=master)](https://travis-ci.com/Vidmapps/besttrip)

This is the project created during my **Web Development** learning phase via **Udemy Front-end development [course](https://www.udemy.com/course/the-web-developer-bootcamp/)**. 

## Technologies used:
 - **Bootstrap 4** - UI library;
 - **NodeJS** - platform to run JS outside the browser;
 - **APIs** - method to run embedded Google Maps;
 - **JSON** - method to read object data;
 - **MongoDB** - database to store objects;
 - **REST** - architectural style to run website;
 - **Authentification** - user identification;
 - **Git & GitHub** - project repository;

 ## Packages used:
 - **body-parser** - turn `req.body` into JS object;
 - **connect-flash** - tool to use flash notifications;
 - **dotenv** - tool to store configuration in the environment separate from code;
 - **ejs** - JS template that helps to use embedded JS functions in HTML;
 - **express** - framework to run the app;
 - **express-sanitizer** - tool that helps to prevent user harmful inputs into JS script tag;
 - **express-session** - a way to make requests not stateless (to be sure if the user is logged in);
 - **locus** - debugging module which allows to execute commands at runtime (was used to create Admin account);
 - **method-override** - lets to use PUT or DELETE in places where the client doesn't support it;
 - **moment** - tool to capture the time of the user made changes;
 - **mongoose** - MongoDB database interaction;
 - **node-geocoder** - library for geocoding to run Google Maps API;
 - **passport** - authentification tool;
 - **passport-local** - the way of authentification with username and password;
 - **passport-local-mongoose** - authentification to use MongoDB;
 - **request** - to make http calls and follow redirects by default.

## How it works
1. Download the whole project from Github
2. Install NodeJS packages by using `npm install`
3. Comment public server access _line 89_ in **app.js** `process.env.PORT, process.env.IP` and uncomment local server _line 88_ `3000` as shown below.

![Black_from_a_camera jpg (2592×1944) 2020-02-17 11-53-35 (5)](https://user-images.githubusercontent.com/58663418/75769942-ac231000-5d4f-11ea-93e5-45d233a4a141.png)

4. Use the terminal to run the server with the command `node app.js`
