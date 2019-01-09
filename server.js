var express = require('express'); // Web Framework
var app = express();
var morgan = require('morgan'); // Logger
var compression = require('compression'); // Compress data before response to client
var bodyParser = require('body-parser'); // Get data from body client
var cors = require('cors');
var http = require('http');
var MongoClient = require('mongodb').MongoClient;


var HanddleError = require('./Modules/Middlewares/handdle.error');
const { EmployeesModel } = require('./Modules/Models/employees/employee.model');
const { UserModel } = require('./Modules/Models/users/user.model');

var url = "mongodb://localhost:27017";
let httpServer = http.createServer(app);

// กำหนด ENV ถ้ายังไม่มี ENV ให้เป็น development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// กำหนดเงื่อนไข evironment
// โดยถ้าเป็น development ให้มีการ log ดู โดย morgan
// ถ้าเป็น production ไม่ต้อง log ให้มีการบีบอัดโดย compression
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(cors);
    app.use(compression);
}

// middleware ส่งข้อมูลเข้ารหัส urlencode ,json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// กำหนด Header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Methods', 'PUT,POST,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// เชื่อมต่อ Mongodb
MongoClient.connect(url, (err, client) => {

    if (err) return console.log(err);

    var db = client.db('test');

    let employeeModel = new EmployeesModel(db.collection('Employee'));
    let userModel = new UserModel(db.collection('User'));

    require('./Modules/Routes/user/user.route')(app, userModel, HanddleError);
    require('./Modules/Routes/employee/employee.route')(app, employeeModel, HanddleError);

    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        });
    });

    // เริ่มต้นทำงาน server ที่ port = 3000
    httpServer.listen(3000, function() {
        console.log('Server running at http://localhost:3000');
    });

});