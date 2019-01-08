var ObjectID = require('mongodb').ObjectID;

class UserModel {
    constructor(userCollection) {
        this.userCollection = userCollection;
    }

    signIn(email) {
        return new Promise((resolve, reject) => {
            this.userCollection.findOne({
                status: 1,
                email: email
            }, (err, user) => {
                if (err) reject('Error getting user!');
                if (user) resolve(user);
                else resolve(null);
            });
        });
    }

    signUp(user) {
        return new Promise((resolve, reject) => {
            user.createdAt = new Date();
            user.status = 1;
            user.token = '';
            this.userCollection.insertOne(user, (err, r) => {
                if (err) reject('Error adding user!');
                else resolve(r.insertedCount);
            });

        });
    }

    hasEmail(email) {
        return new Promise((resolve, reject) => {
            this.userCollection.findOne({
                status: 1,
                email: email
            }, (err, email) => {
                if (err) reject('Error getting email!');
                if (email) resolve(email);
                else resolve(null);
            });
        });
    }

    updateToken(user_id, token) {
        return new Promise((resolve, reject) => {
            this.userCollection.updateOne({
                _id: ObjectID(user_id),
                status: 1,
            }, {
                $set: {
                    token: token
                }
            }, {}, (err, r) => {
                if (err) reject('Error updating token!');
                else resolve(r.result.ok == 1 && r.matchedCount > 0);
            });
        });
    }

}

module.exports = {
    UserModel
}