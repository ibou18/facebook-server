const router = require("express").Router();
const MaterielController = require("../controllers/materielController");
const { requireAuth } = require("../middleware/authMiddleware");
// const { uploadMaterielImage } = require("../utils/uploadImage");
const aws = require("aws-sdk");
const multer = require("multer");
// cmulter = require("multer")),
const multerS3 = require("multer-s3");
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ca-central-1",
});
s3 = new aws.S3();
var uploadMaterielImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "facebook-lagui/docs",
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

router.get("/", MaterielController.getAll);
router.post("/", uploadMaterielImage.array("files"), MaterielController.create);
router.get("/:id", MaterielController.info);
router.patch(
  "/:id",
  uploadMaterielImage.array("files"),
  MaterielController.update
);
router.delete("/:id", MaterielController.delete);

module.exports = router;
