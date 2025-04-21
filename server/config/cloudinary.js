const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: "dogf8zihu",
    api_key: "799898662893418",
    api_secret: "GvGLfNosSIAdi850asqobTVVVnU"
});

module.exports = cloudinary; 