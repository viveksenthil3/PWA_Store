const express = require('express');
const { savePWA } = require('../controllers/pwa.controlers');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const UPLOADS_PATH = 'src/uploads/';


const multer = require('multer');
const { isValidPwaUpdate } = require('../middlewares/common.middlewares');
const pwaImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOADS_PATH);
    },
    filename: function (req, file, cb) {
      let extentions = file.mimetype.split('/');
      let filename = `${uuidv4()}.${extentions[extentions.length-1]}`;

      if(req.body.filenames)
        req.body.filenames.push(filename)
      else
        req.body.filenames=[filename]
        
      cb(null, filename);
    }
  });

  const upload = multer({ storage: pwaImgStorage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'samplePics', maxCount: 8 }])


router.post('/savePWA', upload, savePWA)


module.exports = router;