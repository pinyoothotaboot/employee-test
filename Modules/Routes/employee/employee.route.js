const isAuthenticated = require('../../Middlewares/check.authentication');
module.exports = function EmployeeRoute(app, employeeModel, HandleError) {

    app.get('/api/employee', isAuthenticated, (req, res) => {
        let employee_id = req.query.employee_id;
        let employee_name = req.query.employee_name;
        let skip = parseInt(req.query.skip);
        let limit = parseInt(req.query.limit);
        if (
            req.query.skip &&
            req.query.limit &&
            (isNaN(skip) && isNaN(limit))) {
            HandleError(res, 400, 'Invalid Request!');
        } else {
            if (employee_id && String(employee_id).length == 24) {
                employeeModel.getEmployeeById(employee_id)
                    .then((employee) => {
                        if (employee) {
                            res.send({
                                IsOk: true,
                                Data: employee
                            });
                        } else {
                            HandleError(res, 400, 'Employee not found!');
                        }
                    }, (err) => {
                        HandleError(res, 400, err);
                    });

            } else if (skip >= 0 && limit >= 0) {
                employeeModel.getEmployees(skip, limit)
                    .then((employees) => {
                        res.send({
                            IsOk: true,
                            Data: employees
                        });
                    }, (err) => {
                        HandleError(res, 400, err);
                    });
            } else if (employee_name && skip >= 0 && skip >= 0) {
                employeeModel.getEmployeesByName(employee_name, skip, limit)
                    .then((employees) => {
                        res.send({
                            IsOk: true,
                            Data: employees
                        });
                    }, (err) => {
                        HandleError(res, 400, err);
                    });
            } else {
                HandleError(res, 400, 'EmployeeId has problem!');
            }
        }
    });

    app.post('/api/employee', isAuthenticated, (req, res) => {
        let resultObject = req.body;
        employeeModel.addEmployee(resultObject)
            .then((isAdded) => {
                if (isAdded) {
                    res.send({
                        IsOk: true
                    });
                } else {
                    HandleError(res, 400, 'Employee not added!');
                }
            }, (err) => {
                HandleError(res, 400, err);
            });
    });

    app.put('/api/employee', isAuthenticated, (req, res) => {
        let employee_id = req.query.employee_id;
        let resultObjectUpdate = req.body;

        if (!employee_id || String(employee_id).length != 24) {
            HandleError(res, 400, 'Invalid Request!');
        } else {
            employeeModel.updateEmployee(employee_id, resultObjectUpdate)
                .then((isUpdated) => {
                    if (isUpdated) {
                        res.send({
                            IsOk: true
                        });
                    } else {
                        HandleError(res, 400, 'Employee not updated!');
                    }
                }, (err) => {
                    HandleError(res, 400, err);
                });
        }
    });

    app.delete('/api/employee', isAuthenticated, (req, res) => {
        let employee_id = req.query.employee_id;

        if (!employee_id || String(employee_id).length != 24) {
            HandleError(res, 400, 'Invalid Request!');
        } else {
            employeeModel.deleteEmployee(employee_id)
                .then((isDeleted) => {
                    if (isDeleted) {
                        res.send({
                            IsOk: true
                        });
                    } else {
                        HandleError(res, 400, 'Employee not deleted!');
                    }
                }, (err) => {
                    HandleError(res, 400, err);
                });
        }
    });

}