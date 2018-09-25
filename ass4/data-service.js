var fs = require("fs");

var employess = [];
var departments = [];
var empCount = 0; // count the number of employees

module.exports.initialize = function() {
    return new Promise(function(resolve,reject){
        fs.readFile('./data/employees.json', function(err,data){
            if(err){
                reject("Can Not Open employees.json File");
            }else{
                employess = JSON.parse(data);
                empCount = employess.length;

                fs.readFile('./data/departments.json', function(err,data){
                    if(err){
                        reject("Can Not Open department.json File");
                    }else{
                        departments = JSON.parse(data);
                        resolve("Succefully Reading JSON Files");
                    }
                });
            }
        });
    });
}

module.exports.getAllEmployees = function(){
    var arryAllEmployees = [];
    return new Promise(function(resolve,reject){
        for (let i = 0; i < employess.length; i++) {
            arryAllEmployees.push(employess[i]);
        }

        if (arryAllEmployees.length == 0){
            reject("No Result Returned");
        } else {
            resolve(arryAllEmployees);
        }
    });
}

module.exports.getEmployeesByStatus = function(status){
    var arryByStatus = [];
    return new Promise(function(resolve,reject){
        for(let i = 0; i < employess.length; i++){
            if(employess[i].status == status){
                arryByStatus.push(employess[i]);
            }
        }

        if (arryByStatus.length == 0){
            reject("No Result Returned");
        } else {
            resolve(arryByStatus);
        }
    });
}

module.exports.getEmployeesByDepartment = function(department){
    var arryByDepartment = [];
    return new Promise(function(resolve,reject){
        for(let i = 0; i < employess.length; i++){
            if(employess[i].department == department){
                arryByDepartment.push(employess[i]);
            }
        }

        if(arryByDepartment.length == 0){
            reject("No Result Returned");
        } else {
            resolve(arryByDepartment);
        }
    });
}

module.exports.getEmployeesByManager = function(manager) {
    var arrayGetEmployeesByMannager = [];
    return new Promise(function(resolve,reject) {
        for (let i = 0; i < employess.length; i++) {
            if (employess[i].employeeManagerNum == manager) {
                arrayGetEmployeesByMannager.push(employess[i]);
            }
        }

        if (arrayGetEmployeesByMannager.length == 0 ) {
            reject("No Result Returned");
        } else {
            resolve(arrayGetEmployeesByMannager);
        }
    });
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve,reject){
        for(let i = 0; i < employess.length; i++){
            if(employess[i].employeeNum == num){
                resolve(employess[i]);
            }
        }

        reject("No Result Returned");
    });
}

module.exports.getManagers = function() {
    var arryGetManagers = [];
    return new Promise(function(resolve,reject){
        for (let i = 0; i < employess.length; i++) {
            if (employess[i].isManager == true) {
                arryGetManagers.push(employess[i]);       
            }
        }

        if (arryGetManagers.length == 0) {
            reject("No Result Returned");
        } else {
            resolve(arryGetManagers);
        }
     });
}

module.exports.getDepartments = function() {
    var arryGetDepartments = [];
    return new Promise(function(resolve,reject){
        for (let i = 0; i < departments.length; i++) {
            arryGetDepartments.push(departments[i]);       
        }

        if (arryGetDepartments.length == 0) {
            reject("No Result Return");
        } else {
            resolve(arryGetDepartments);
        }
    });
}

module.exports.addEmployee = function(employeeData) {
    return new Promise(function(resolve,reject) {
        try {
            empCount++;
            employeeData.employeeNum = empCount;
            employess.push(employeeData);
        } catch(ex) {
            reject("Failed to Add Employee");
        }
        
        resolve();
    });
}

module.exports.updateEmployee = function(employeeData) {
    return new Promise(function(resolve,reject) {
        try {
            for (let i = 0; i < employess.length; i++) {
                if (employess[i].employeeNum == employeeData.employeeNum) {
                    //employess.splice(employeeData.employeeNum - 1, 1, employeeData);
                    employess[i] = employeeData;
                }
            }
        } catch(ex) {
            reject("Failed to Update Employee");
        }

        resolve();
    });
}