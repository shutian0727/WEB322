var employee = {};
var departments = [];
var fs = require("fs");
var empCount = 0;

module.exports.initialize = function() {
return new Promise(function(resolve, reject){
    try{
        fs.readFile('./data/employees.json',  function(err, data){
            if (err) throw err;
            employee = JSON.parse(data);
            empCount = employee.length;

        });
        fs.readFile("./data/departments.json", function(err, data){
            if(err) throw err;
            departments = JSON.parse(data);  
        });
    } catch (ex) {
        reject("Read File Error!");
    }
    resolve("JSON file succesfully read.");

});
}
module.exports.getAllEmployees = function() {
var allEmployees = [];
return new Promise(function(resolve, reject) {
    for (var i = 0; i < employee.length; i++) {
        allEmployees.push(employee[i]);
    }
    if (allEmployees.length == 0) {
        reject("No data");
    }
    resolve(allEmployees);
})
}
module.exports.getEmployeesByStatus = function(status) {
    var byStatus = [];
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < employee.length; i++) {
            if (employee[i].status == status) {
                byStatus.push(employee[i]);
            }
        }
        if (byStatus.length == 0) {
            reject("No Data");
        }
        resolve(byStatus);
    });
}

// Returns employees by Department.
module.exports.getEmployeesByDepartment = function(department) {
    var byDepartment = [];
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < employee.length; i++) {
            if (employee[i].department == department) {
                byDepartment.push(employee[i]);
            }
        }
        if (byDepartment.length == 0) {
            reject("No Data");
        }
        resolve(byDepartment);
    });
}

// Returns Employees by manager.
module.exports.getEmployeesByManager = function(manager) {
    var employeesBymaneger = [];

    return new Promise(function(resolve, reject) {
        for (let i = 0; i < employee.length; i++) {
            if (employee[i].employeeManagerNum == manager) {
                employeesBymaneger.push(employee[i]);
            }
        }
        if (employeesBymaneger.length == 0) {
            reject("No Data");
        }
        resolve(employeesBymaneger);
    });
}

// Returns employees by Number.
module.exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        for (let j = 0; j < employee.length; j++) {
            if (employee[j].employeeNum == num) {
                resolve(employee[j]);
            }
        }
        reject("No Data");
    });
}
module.exports.getManagers = function() {
    var manager = [];
    return new Promise(function(resolve, reject) {
        if (employee.length == 0) {
            reject("No Data");
        } else {
            for (var q = 0; q < employee.length; q++) {
                if (employee[q].isManager == true) {
                    manager.push(employee[q]);
                }
            }
            if (manager.length == 0) {
                reject("No Data");
            }
        }
        resolve(manager);
    });
    }
    
    module.exports.getDepartments = function() {
        var department = [];
        return new Promise(function(resolve, reject) {
            if (employee.length == 0) {
                reject("No Data");
            } else {
                for (var v = 0; v < departments.length; v++) {
                    department.push(departments[v]);
                }
                if (department.length == 0) {
                    reject("No Data");
                }
            }
            resolve(department);
        });
        }
        module.exports.addEmployee = function(employeeData)  {
            return new Promise((resolve, reject) => {
                empCount++;
                employeeData.employeeNum = empCount;
                employee.push(employeeData);
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