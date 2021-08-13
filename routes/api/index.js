var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var userRouter = require("./user");
var loginRouter = require("./login");
var groupRouter = require("./groups");
var threadRouter = require("./thread");
var uploadRouter = require("./upload");

router.use('/user',userRouter);
router.use('/login',loginRouter);
router.use('/groups',groupRouter);
router.use('/thread',threadRouter);
router.use('/upload',uploadRouter);

module.exports = router;