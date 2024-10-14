import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import uploadOnCloudinary from '../utils/Cloudinary.js';
import fs from 'fs';
import { User } from '../models/User.model.js  '; // Assuming your user model is located here

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // File is temporarily stored by multer
        const localFilePath = req.file.path;
        
        // Get userId from the request body
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Upload file to Cloudinary
        const uploadResponse = await uploadOnCloudinary(localFilePath);

        // Remove the file from local storage after uploading to Cloudinary
        fs.unlinkSync(localFilePath);

        if (uploadResponse) {
            // Update the user's profile picture with the Cloudinary URL
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profile: uploadResponse.url }, // Update the profile field with the Cloudinary URL
                { new: true } // Return the updated user document
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                message: "File uploaded and user profile updated successfully",
                user: updatedUser, // Return updated user info
                url: uploadResponse.url, // Include uploaded image URL in response
            });
        } else {
            return res.status(500).json({ message: "File upload failed" });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ message: "An error occurred during upload" });
    }
});

export default router;
