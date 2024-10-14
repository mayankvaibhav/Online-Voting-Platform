import express from 'express';
import multer from 'multer';
import uploadOnCloudinary from '../utils/Cloudinary.js';

const imagerouter = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary directory for storing uploaded files

// Route to handle file upload
imagerouter.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const localFilePath = req.file.path; // Get the temporary file path

        console.log(localFilePath)

        // Call the function to upload the file to Cloudinary
        const response = await uploadOnCloudinary(localFilePath);

        // Check if the upload was successful
        if (response) {
            return res.status(200).json({ url: response.url }); // Send back the URL
        } else {
            return res.status(500).json({ message: 'Error uploading file to Cloudinary.' });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Server error occurred.' });
    }
});

export default imagerouter;
