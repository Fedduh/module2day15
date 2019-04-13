const express = require('express');
const router = express.Router();
const Multer = require('multer');

const Picture = require('../models/Picture');
const multerS3 = require('multer-s3');

const aws = require('aws-sdk');
const s3 = new aws.S3();

const storage = new multerS3({
  s3: s3,
  bucket: 'ironhack-test',
  key: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

const multer = Multer({storage: storage});



/* GET home page */
router.get('/', (req, res, next) => {

  Picture.find()
    .then(pictures => {


      res.render('index', {pictures: pictures});
    })
    .catch(err => {
      console.log(err);
    })
});

router.post('/upload', multer.single('picture'), (req, res, next) => {

  console.log(req.file);
  Picture.create({
    name: req.body.name,
    path: req.file.location,
    originalName: req.file.originalname
  })
  .then(picture => {
    res.send(picture);
  })
  .catch(err => {
    console.log(err);
  })

})

module.exports = router;
