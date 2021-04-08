const PWA = require('../models/pwa.model')
const fs = require('fs');
const Image4ioAPI = require('@image4io/image4ionodejssdk');
const { PROJECT_ROOT } = require('../..');
const axios = require('axios');
const formData = require('form-data');
const cloudinary = require('cloudinary');
const reviewModel = require('../models/review.model');
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
        PWAName,
        category,
        description,
        link,
        pwaId
    }=req.body;

    const username = req.session.email

    //Check if the request has all the required details
    if(!(username && PWAName && category && description!=undefined && link)){
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
                res.redirect('/')
                // status(200).json({                
                //     message: 'PWA updated successfully'
                // })
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
            res.redirect('/')
            // status(200).json(data);
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



exports.homePage= async (req, res)=>{

    try{
        const pwas = await PWA.aggregate([
            {
              '$group': {
                '_id': '$category', 
                'pwas': {
                  '$push': '$$ROOT'
                }
              }
            }, {
              '$project': {
                'pwas': {
                  '$slice': [
                    '$pwas', 5
                  ]
                }
              }

            }, {
                '$sort' :{
                    '_id':1
                }

            }
          ]);
    
    
        res.render('home', {pwas})
    }
    catch(error){
        res.status(400).json({error});
        return;
    }
    

}


exports.getPWAs = async (req, res)=>{
    const {
        PWAName
    }= req.body

    if(!PWAName){
        res.json({
            pwas:[]
        });

        return;
    }

    try{
        const pwas = await PWA.find({ PWAName: {$regex: PWAName , $options: "i"} }).limit(5);
    
    
        res.json({pwas})
    }
    catch(error){
        res.status(400).json({error});
        return;
    }

}



exports.detailedView = async (req, res)=>{
    const {
        PWAId
    }= req.query

    if(!PWAId){
        res.redirect('/');
        return;
    }

    try{
        const pwa = await PWA.findOne({ _id: PWAId});
        let reviews = await reviewModel.find({PWAId});

        reviews = await JSON.parse(JSON.stringify(reviews))
    
    
        res.render('detailedView',{
            pwa,
            reviews, 
            isLogin: req.session.isLogin
        })
    }
    catch(error){
        res.redirect('/');
        return;
    }

}



exports.deletePWA = async (req, res)=>{
    const {
        PWAId
    }= req.body

    if(!PWAId){
        res.status(409).json({
            message: 'Insufficient details'
        });

        return;
    }

    try{
        const pwa = await PWA.deleteOne({ _id: PWAId});
    
    
        res.send()
    }
    catch(error){
        res.status(400).json({error});
        return;
    }

}


exports.addReview = async (req, res)=>{

    // res.status(400).redirect(req.headers.referer)
    // return

    const {
        rating,
        review,
        PWAId
    }=req.body;

    const email = req.session.email
    const username = req.session.username

    //Check if the request has all the required details
    if(!(rating && review && PWAId )){
        res.status(409).json({
            message: 'Insufficient details'
        })

        return;
    }

    const Review = {
        rating,
        review,
        PWAId,
        email,
        username
    }


    //Update the pwa if pwa id exists   
    
    const _review = new reviewModel(Review)

    _review.save((error, data)=>{
        if(error){
            res.status(400).json({
                error,
                message: 'something went wrong'
            })
        }
        else
            // res.redirect('/')
            res.status(200);
    });

    
}

