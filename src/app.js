const express = require('express')
const path = require("path")
const fetch = require("node-fetch");
const moment = require('moment');


console.log(__dirname);
// console.log(__filename);
console.log(path.join(__dirname, "../public"));

const pathToDir = path.join(__dirname, "../public");
const pathToHandlebarsTemplates = path.join(__dirname, "../templates");

///////////////////////////////
// EXPRESS SERVER & HANDLEBARS
///////////////////////////////

const app = express()
app.set('views', pathToHandlebarsTemplates);
app.set('view engine', 'hbs')

app.use(express.static(pathToDir));
//   console.log("skjdgauisdfh");

///////////////////////////////
// FETCHIN WEATHER DATA
///////////////////////////////
// const url = `http://api.weatherstack.com/current?access_key=5f0f54c9cac37999408b0fbafe28ac5c&query=${Melbourne}`;

 
// console.log(res.query.city);

/////////////////////////////////////
////// Responses from the server ////
/////////////////////////////////////

// app.get('', (req, res) => {
//     // res - send to the client(Browser)
//     res.send('Hello Express')
// })

// SPECIFY PORT and LISTEN
app.listen(1200, () => {
  console.log(`Server is up @ port ${1200}`);
});


app.get('/help', (req, res) => {
    // res - send to the client(Browser)
    res.send(`Hello from the help page - ${req}`)
})

app.get('/html', (req, res) => {
    res.render('index', {
        name: req.query.name
    });
})

/////////////////////////////////////
////// Weather server ///////////////
/////////////////////////////////////
app.get("/weather", (req, res) => {
    if (!req.query.city) {
      return res.send({ // send direct json
        error: "no city provided",
      });
    }

    const urlEndpoint = `http://api.weatherstack.com/current?access_key=5f0f54c9cac37999408b0fbafe28ac5c&query=${req.query.city}`;

    const getCityData = async (urlEndpoint) => {
      try {
        const response = await fetch(urlEndpoint);
        const json = await response.json();
        //console.log(json);
        return processData(json);
      } catch (error) {
        console.log(error);
      }
    };

    getCityData(urlEndpoint);

    const processData = (json) => {
        // let date = moment(json.location.localtime).format("DD-MM-YYYY");
        let date = moment(json.location.localtime).format("hh:mm A");
        res.render("weather", {
          // renders json via handlebars
          city: req.query.city,
          temperature: json.current.temperature,
          localtime: date,
          //localtime: json.location.localtime,
          icon: json.current.weather_icons,
        });
    };

 
});

