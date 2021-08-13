//upload section created with help from example: 
// https://github.com/codebubb/tutorial-nodejs-file-upload/blob/master/s3-upload.js

//express imports
const express = require('express');
const router = express.Router();

//file upload related imports
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

//load aws credentials
aws.config.loadFromPath("./config/aws.json")

//load s3
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

//multer middleware
const upload = multer({
    storage: multerS3({
        s3,
		bucket: 'filigree-bucket',
		acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});

router.post('/',upload.array('avatar') , (req,res)=>{
	console.log("this is a function")
	res.json(req.files.map(e => e.location));
});

module.exports = router;