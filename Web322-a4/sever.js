/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Shutian Xu     Student ID: 109783175      Date: 07/04/2018
*
* Online (Heroku) Link: https://arcane-forest-76446.herokuapp.com
*
********************************************************************************/
var express = require("express");
var data_service = require("./data-service.js");
var path = require("path");
var app = express();
var multer = require("multer");
var fs = require('fs');
var bodyParser = require('body-parser');
var exhbps = require('express-handlebars');


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on port: " + HTTP_PORT);
}

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
      strong: function(options){
          return '<strong>' + options.fn(this) + '</strong>';
      },
      list: function(context, options) {
          var ret = "<ul>";
          for(var i = 0; i < context.length; i++) {
              ret = ret + "<li>" + options.fn(context[i]) + "</li>";
          }
          return ret + "</ul>";
      }
  }
}));

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { 
    navLink: function(url, options){
    return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
}

}
}));

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

app.set("view engine", ".hbs");
// load CSS file
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/////////// setup middleware multer for uploading files ///////////
const storage = multer.diskStorage({
  destination: "./public/pimages/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
   //res.sendFile(path.join(__dirname + "/views/home.hbs" ));
   res.render("home");
});

// add Post 'route' to listen on POST /images/add
app.get("/images/add", function(req, res){
  res.sendFile(path.join(__dirname + "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res){
  res.redirect("/images");
})
// add a route to listen on o	GET /images 
app.get("/images", function(req,res){
      fs.readdir(__dirname + "/public/images/uploaded", function(err, images){
       // res.json({images});
       res.render("images", {images: data}); 
        });
});



// add a new 'route' to listen on /employees/add 
app.get("/employees/add", function(req,res){
  //res.sendFile(path.join(__dirname + "/views/addEmployee.html" ));
  res.render("addEmployee");
});

// add a Post 'route' to listen on POST /employees/add
app.post("/employees/add", (req, res) => {
  data_service.addEmployee(req.body).then(function(data) {
    res.redirect("/employees");
  }).catch(function(err){
    res.render(err);
  })
});

// add a new 'route' to listen on /images/add
app.get("/images/add", function(req,res){
  //res.sendFile(path.join(__dirname + "/views/addImage.html" ));
  res.render("addImage");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  //res.sendFile(path.join(__dirname + "/views/about.html" ));
  res.render("about");
});

// setup another route to listen on /employees
app.get("/employees", function(req,res){
  if (req.query.status) {
    //res.send("status here");
    return data_service.getEmployeesByStatus(req.query.status).then(function(data){
      res.render("employees", {employees: data});
    }).catch(function(err){
      res.render({message: "no results"});
    })
  } else if (req.query.department) {
    //res.send("department here")
    data_service.getEmployeesByDepartment(req.query.department).then(function(data){
      res.render("employees", {employees: data});
    }).catch(function(err){
      res.render({message: "no results"});
    })
  } else if (req.query.manager) {
    //res.send("mamager here");
    data_service.getEmployeesByManager(req.query.manager).then(function(data){
      res.render("employees", {employees: data});
    }).catch(function(err){
      res.render({message: "no results"});
    })
  } else {
    //res.send("all employees here");;
    data_service.getAllEmployees().then(function(data){
      res.render("employees", {employees: data});
    }).catch(function(err){
      res.render({message: "no results"});
    })
  }
});

// setup another route to listen on /employee/value
app.get("/employee/:empNum", function(req,res){
  //res.send("value!");
  data_service.getEmployeeByNum(req.params.num).then(function(data){
    //res.json(data);
    res.render("employee", { employee: data });
  }).catch(function(err){
    res.render("employee",{message:"no results"});
    //res.status(404).send("Employee Not Found");
  });
});

// setup route /employee/update for post method
app.post("/employee/update", (req, res) => {
  data_service.updateEmployee(req.body).then(function() {
    res.redirect("/employees");
  }).catch(function(err){
    console.log(err);
  });
});

// setup another route to listen on /managers
app.get("/managers", function(req,res){
  //res.send("manager!");
  data_service.getManagers().then(function(data){
    res.json(data);
  }).catch(function(err){
    res.json({message: err});
  });
});

// setup another route to listen on /departments
app.get("/departments", function(req,res){
  //res.send("departments!");
  data_service.getDepartments().then(function(data){
    res.render("departments", {departments: data});;
  }).catch(function(err){
    res.render({message: err});
  });
});

  // no matching route to listen
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

// load the JSON firstly and then setup server
data_service.initialize().then(function() {
  // setup http server to listen on HTTP_PORT
  app.listen(HTTP_PORT, onHttpStart)
  }).catch(function(err) {
    console.log("Failed to start the sever - JSON files are broken");
  });
 

