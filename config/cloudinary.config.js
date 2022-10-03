const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

module.exports = {
    subirImagen: async (filePath) => {
        return await cloudinary.uploader.upload(filePath, {
          folder: 'reipost'
        });
    },
      
    borrarImagen: async (publicId) => {
        return await cloudinary.uploader.destroy(publicId)
    }
}