
// this router is universal, you can just use it for any project. the differnet is the input model object.
const express = require('express');
// input a model called myModel which has schema of a Schema
module.exports = function (myModel) {
    // returens router instanace which can be mounted as a middleware
    const router = express.Router();
    // const universalCtrl = require('../controllers/universal-controller')(myModel);

    router.use('/:id', (req, res, next) => { // OPTIONALLY: you can use middleware to fetch myModel object  
        myModel.findById(req.params.id.trim(), (error, myModel) => {
            if (error) {
                res.status(500).send(err);
            } else if (myModel) {
                req.myModel = myModel;
                next();
            }
            else {
                res.status(404).send('no data found');
            }
        })
    });

    router.route('/')
        .get((req, res, next) => {
            myModel.find({}, null, { sort: { _id: -1 } }, (error, myModels) => {
                if (error) return next(error);
                res.send(myModels);
            })
        })
        .post((req, res, next) => {
            let newmyModel = new myModel(req.body);
            newmyModel.save((error, results) => {
                if (error) return next(error);
                res.send(results);
            })
        })

    router.route('/:id')
        .get((req, res, next) => {
            res.json(req.myModel.toJSON());
        })
        .put((req, res, next) => {
            if (req.body.name) req.myModel.name = req.body.name;
            if (req.body.balance) req.myModel.balance = req.body.balance;
            req.myModel.save((error, results) => {
                res.send(results);
            })
        })
        .delete((req, res, next) => {
            req.myModel.remove((error, results) => {
                if (error) return next(error);
                res.send(results);
            })
        });
    return router;
}


