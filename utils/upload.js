const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure the uploads directories exist
const uploadsDirPaper = path.join(__dirname, '../uploads/paper');
const uploadsDirProfile = path.join(__dirname, '../uploads/profile');
const uploadDirProductImage = path.join(__dirname, '../uploads/product')

if (!fs.existsSync(uploadsDirPaper)) {
  fs.mkdirSync(uploadsDirPaper, { recursive: true });
}
if (!fs.existsSync(uploadsDirProfile)) {
  fs.mkdirSync(uploadsDirProfile, { recursive: true });
}
if (!fs.existsSync(uploadDirProductImage)) {
  fs.mkdirSync(uploadDirProductImage, { recursive: true });
}

// ===== Storage for Paper =====
const storagePaper = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirPaper);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, '-');
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${Date.now()}${extension}`);
  },
});

// ===== Storage for Profile Image =====
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirProfile);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, '-');
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${Date.now()}${extension}`);
  },
});
// storage for the product Image
const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirProductImage);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, '-');
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${Date.now()}${extension}`);
  }
})

// ===== File type checking function =====
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
// ===== File type checking function for papers =====
function checkFileTypePaper(file, cb) {
  const filetypes = /pdf|doc|docx|jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only Images, PDF, DOC, and DOCX files are allowed!');
  }
}
// ===== Uploaders =====
const uploadPaper = multer({
  storage: storagePaper,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    // you can add specific file type check for papers if you want
    checkFileTypePaper(file, cb);
  },
}).single('paper'); // name of the field when uploading papers

const uploadProfile = multer({
  storage: storageProfile,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profileImage'); // name of the field when uploading profile images

//upload image product
const uploadProduct = multer({
  storage: storageProduct,
  limits: { fileSize:10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');
// ===== Export both uploaders =====
module.exports = {
  uploadPaper,
  uploadProfile,
  uploadProduct   
};
