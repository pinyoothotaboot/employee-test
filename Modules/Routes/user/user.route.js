const sha256 = require('sha256');
const jwt = require('jsonwebtoken');

const isAuthenticated = require('../../Middlewares/check.authentication');

module.exports = function UserRoute(app, userModel, HandleError) {
    app.post('/api/signup', (req, res) => {
        let user = req.body;
        userModel.hasEmail(user.email)
            .then((email) => {
                if (email) {
                    HandleError(res, 400, 'Email has registed!');
                } else {
                    user.password = sha256.x2(user.password);
                    userModel.signUp(user)
                        .then((isAdded) => {
                            if (isAdded) {
                                res.send({
                                    IsOk: true,
                                    Data: "Insert Successed"
                                });
                            } else {
                                HandleError(res, 400, 'User not added!');
                            }
                        }, (err) => {
                            HandleError(res, 400, err);
                        });
                }
            }, (err) => {
                HandleError(res, 400, err);
            });
    });

    app.post('/api/signin', (req, res) => {
        let user = req.body;
        userModel.signIn(user.email)
            .then((result) => {
                if (result) {
                    isPassword = sha256.x2(user.password);
                    if (result.password == isPassword) {
                        const token = jwt.sign({
                                email: result.email,
                                userId: result._id,
                                name: result.name
                            },
                            process.env.NODE_JWT_KEY, {
                                expiresIn: "100d"
                            });

                        userModel.updateToken(result._id, token)
                            .then((isUpdated) => {
                                if (isUpdated) {
                                    res.send({
                                        IsOk: true,
                                        token: token
                                    });
                                } else {
                                    HandleError(res, 400, 'Token not updated!');
                                }
                            }, (err) => {
                                HandleError(res, 400, err);
                            });

                    } else {
                        HandleError(res, 400, 'Password is not matched!');
                    }
                } else {
                    HandleError(res, 400, 'Email is not founded!');
                }
            }, (err) => {
                HandleError(res, 400, err);
            });
    });
}