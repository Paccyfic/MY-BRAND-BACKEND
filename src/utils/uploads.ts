import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";


// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;

export const uploadOptions = {
    folder: 'my-brand',
    unique_filename: true,
    use_filename: true,
};

// CLOUDINARY CONFIG
cloudinary.config({
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    cloud_name: CLOUDINARY_CLOUD_NAME,
});

// UPLOAD TO CLOUDINARY
export const uploadToCloudinary = async (file: any, options) => {
    try {
        const uploaded = await cloudinary.uploader.upload(file, options);
        return uploaded;
    } catch (error) {
        throw new Error(error.message);
    }
};
