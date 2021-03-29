const PWA = require('../models/pwa.model')
const fs = require('fs');
const Image4ioAPI = require('@image4io/image4ionodejssdk');
const { PROJECT_ROOT } = require('../..');
const axios = require('axios');
const formData = require('form-data');
const cloudinary = require('cloudinary');
// const FormData = require('form-data');
const UPLOADS_PATH='./src/uploads/'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


exports.savePWA = async (req, res)=>{

    // res.status(400).redirect(req.headers.referer)
    // return

    const {
        username,
        PWAName,
        category,
        description,
        link,
        pwaId
    }=req.body;


    //Check if the request has all the required details
    if(!(username && PWAName && category && description && link)){
        res.status(409).json({
            message: 'Insufficient details'
        })

        deleteUploadedFiles(req);
        return;
    }

    const pwa = {
        username,
        PWAName,
        description,
        category,
        link,
    }


    //Update the pwa if pwa id exists
    if(pwaId){
        
        PWA.updateOne({ _id: pwaId }, { $set: {...pwa} }, (error, data)=>{
            if(error)
                res.status(400).json({
                    error,                    
                    message: 'something went wrong'
                })

            else 
                res.status(200).json({                
                    message: 'PWA updated successfully'
                })
        })

        deleteUploadedFiles(req);
        return;
    }


    let mediaUploadResponse = null
   
    try{
        mediaUploadResponse = await uploadFilesToCloud(req)

        // console.log(mediaUploadResponse)
    }
    catch(error){
        res.status(400).json({error});
        deleteUploadedFiles(req);
        return;
    }

    
    const _pwa = new PWA({
        ...pwa,
        views:0,
        logo: mediaUploadResponse.response.logo,
        samplePics: mediaUploadResponse.response.samplePics        
        });

    _pwa.save((error, data)=>{
        if(error){
            res.status(400).json({
                error,
                message: 'something went wrong'
            })
        }
        else
            res.status(200).json(data);
    });

    deleteUploadedFiles(req);
}


const deleteUploadedFiles = async req=>{
    for(const logo of req.files.logo){
        await fs.promises.unlink(`./src/uploads/${logo.filename}`)
        
    };

    for(const photo of req.files.samplePics){
        await fs.promises.unlink(`./src/uploads/${photo.filename}`)
        
    };
}


const uploadFilesToCloud =req=>{
    return new Promise(async (resolve, reject)=>{
        let response={
            samplePics:[]
        }

        for( const logo of req.files.logo){
             await cloudinary.v2.uploader.upload(`./src/uploads/${logo.filename}`, function(error, result) {
                if(error)
                   reject(error)
                else
                    response.logo={
                        public_id: result.public_id,
                        url: result.url
                    }
            });
            
        };
    
        for(const photo of req.files.samplePics){
              await cloudinary.v2.uploader.upload(`./src/uploads/${photo.filename}`, function(error, result) {
                if(error)
                    reject(error)
                else
                    response.samplePics.push({
                        public_id: result.public_id,
                        url: result.url
                    })
            });
        };
        
        resolve({
            message: 'Files uploaded successfully',
            response
        });
    })
}
