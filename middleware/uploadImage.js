const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ca-central-1",
});

s3 = new aws.S3();

module.exports.uploadPayout = multer({
  storage: multerS3({
    s3: s3,
    bucket: "facebook-lagui/docs",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

module.exports.uploadImageActors = multer({
  storage: multerS3({
    s3: s3,
    bucket: "lagui-cinema-mobile/acteurs",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

module.exports.uploadImagePublication = multer({
  storage: multerS3({
    s3: s3,
    bucket: "lagui-cinema/movies",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});
