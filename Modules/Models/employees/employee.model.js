var ObjectID = require('mongodb').ObjectID;

class EmployeesModel {
    constructor(employeeCollection) {
        this.employeeCollection = employeeCollection;
    }

    getEmployees(skip, limit) {
        return new Promise((resolve, reject) => {
            this.employeeCollection.find({
                    status: 1
                })
                .skip(skip)
                .limit(limit)
                .toArray((err, employee) => {
                    if (err) reject('Error getting employees!');
                    resolve(employee);
                });
        });
    }

    getEmployeeById(employee_id) {
        return new Promise((resolve, reject) => {
            this.employeeCollection.findOne({
                _id: ObjectID(employee_id),
                status: 1
            }, (err, employee) => {
                if (err) reject('Error getting employee!');
                if (employee) resolve(employee);
                else resolve(null);
            });
        });
    }

    getEmployeesByName(searchName, skip, limit) {
        return new Promise((resolve, reject) => {
            this.employeeCollection.find({
                    status: 1,
                    $name: {
                        $search: searchName
                    }
                })
                .skip(skip)
                .limit(limit)
                .toArray((err, employees) => {
                    if (err) reject('Error getting employees!');
                    resolve(employees);
                });
        });
    }

    addEmployee(employee) {
        return new Promise((resolve, reject) => {
            employee.createdAt = new Date();
            employee.status = 1;
            this.employeeCollection.insertOne(employee, (err, r) => {
                if (err) reject('Error adding a employee!');
                else resolve(r.insertedCount);
            });
        });
    }

    updateEmployee(employee_id, updateEmployee) {
        return new Promise((resolve, reject) => {
            this.employeeCollection.updateOne({
                _id: ObjectID(employee_id),
                status: 1
            }, {
                $set: updateEmployee
            }, {}, (err, r) => {
                if (err) reject('Error updating employee!');
                else resolve(r.result.ok == 1 && r.matchedCount > 0);
            });
        });
    }

    deleteEmployee(employee_id) {
        return new Promise((resolve, reject) => {
            this.employeeCollection.updateOne({
                _id: ObjectID(employee_id),
                status: 1
            }, {
                $set: {
                    status: 0
                }
            }, {}, (err, r) => {
                if (err) reject('Error deleting employee!');
                else resolve(r.result.ok == 1 && r.matchedCount > 0);
            });
        });
    }
}

module.exports = {
    EmployeesModel
};