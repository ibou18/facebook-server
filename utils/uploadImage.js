const multer = require("multer");

const uploadImage = (name) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/images/" + name);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  return storage;
};

exports.uploadMaterielImage = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|)$/)) {
      const multerError = new Error("Image allow only jpg, jpeg or png!");
      // Ne jamais modifier ce nom car, il est utilisé ds le middleware error-handler.js
      multerError.name = "multerError";
      return cb(multerError);
    }
    cb(undefined, true);
  },
  storage: uploadImage("materiels"),
});
