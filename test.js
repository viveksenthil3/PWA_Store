const cloudinary = require('cloudinary')


cloudinary.config({ 
    cloud_name: 'dejpqcefw', 
    api_key: '377712138648833', 
    api_secret: 'mNYR-ourihMZ_KqDCqhicx1lqhM' 
  });


// cloudinary.v2.uploader.upload("E:\\Codes\\Web_development\\PWA_Store\\src\\uploads\\5ea4e159-20f8-4ef6-b57e-d8c17ad4f2f9.jpeg", function(error, result) {
//     console.log(result, error); 
// });

cloudinary.v2.api.delete_resources(['vivek'],
  function(error, result) {console.log(result, error); });