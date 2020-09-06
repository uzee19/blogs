const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/authentication');
const path = require('path');
const multer = require('multer');
const app = express();

// Public Folder
app.use(express.static('./public'));


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
      },
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}
    
  })
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Not a image file');
    }
  }

router.get('/welcome',(req,res) => res.render('welcome'));
router.get('/dashboard',ensureAuthenticated,(req,res)=> 
res.render('dashboard'));
router.get('/upload',ensureAuthenticated,(req,res) => res.render('uploading'));
router.post('/upload', (req, res) => {
    upload.array('myFile',5)(req, res, (err) => {
      if(err){
        
        req.flash('error_msg','error occured');
        res.redirect('/upload'
          
        );
      } else {
        if(req.files == undefined || req.files.length ==0){
          req.flash(
            'error_msg',
            'No file selected'
          );
          res.redirect('/upload');
        } else {
          
          req.flash('success_msg',`${req.files.length} File(s) uploaded successfully!`)
          
          res.redirect('/upload');
        }
      }
    });
  });

module.exports = router;