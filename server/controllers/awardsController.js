const fs = require("fs");
const path = require("path");
const logger = require("../Logger/logger");
const Awards = require("../models/awards");


const getLogMetadata = (req) => ({
    username: req.user ? req.user.id : "Unknown",
    ip: req.ip,
});


// Add Awards
exports.createAwards = async (req, res) => {
    try {
        const { name, category,state } = req.body;
        const images = req.file ? req.file.path : "";
        const date = new Date();

        const awards = new Awards({
            name,
            images,
            category,
            state,
            date,
            user: req.user.id,
        });

        await awards.save();

        logger.info(`Product Created Successfully....Awards Id: ${awards._id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        res.status(201).json({ success: true, message: "Awards created successfully", awards });
    } catch (error) {
        logger.error("Error creating Awards", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: error.message,
            stack: error.stack,
            ...getLogMetadata(req),
        });

        res.status(500).json({ success: false, message: "Error creating Awards", error: error.message });
    }
}


// View Awards
exports.getAwards = async (req, res) => {
    try {
        logger.info("Fetching all Awards", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        const awards = await Awards.find({ user: req.user.id });

        if (!awards || awards.length === 0) {
            logger.warn("No Awards found", {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req),
            });
            return res.status(404).json({ success: false, message: "No Awards found" });
        }

        logger.info(`Fetched ${awards.length} Awards`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        return res.status(200).json({ success: true, message: "Awards fetched successfully", awards });

    } catch (err) {
        logger.error("Error fetching Awards", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req),
        });

        return res.status(500).json({ success: false, message: "Error fetching Awards", error: err.message });
    }
}


// Update Awards
exports.updateAwards = async (req, res) => {
    try {
        let editid = req.params.id;
        const { name, category, state } = req.body;

        logger.info(`Received Updating Request for....Awards ID: ${editid}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        const oldawards = await Awards.findById(editid);
        if (!oldawards) {
            logger.warn(`Awards ID: ${editid} not found`, {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req),
            });
            return res.status(404).json({ success: false, message: "Awards not found" });
        }

        let updatedData = { name, category , state};

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

        // Handle single image update
        if (req.file) {
            deleteImages([oldawards.images]); // Delete the old image
            updatedData.images = req.file.path;
        } else {
            updatedData.images = oldawards.images;
        }

        const updatedawards = await Awards.findByIdAndUpdate(editid, updatedData, { new: true });

        logger.info(`Successfully Updated....Awards ID: ${editid}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        res.status(200).json({ success: true, message: "Awards updated", awards: updatedawards });

    } catch (err) {
        logger.error(`Error updating awards ID: ${req.params.id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req),
        });
        res.status(500).json({ success: false, message: "Error updating awards", error: err.message });
    }
}


// delete Awards
exports.deleteAwards = async (req, res) => {
    try {
        let awardsId = req.params.id;

        if (!awardsId) {
            return res.status(400).send({ success: false, message: "Invalid awards ID" });
        }

        logger.info(`Received Delete Request for - awards ID: ${awardsId}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req)
        });

        let awards = await Awards.findById(awardsId);
        if (!awards) {
            logger.warn(`Not Found awards with ID: ${awardsId}`, {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req)
            });
            return res.status(404).send({ success: false, message: "awards not found" });
        }

        deleteImages(awards.images)

        await Awards.findByIdAndDelete(awardsId);
        logger.info(`Successfully Deleted - awards ID: ${awardsId}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req)
        });

        res.status(200).send({ success: true, message: "awards successfully deleted" });
    } catch (err) {
        logger.error(`Error deleting awards ID: ${req.params.id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req)
        });
        res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
}


// Function to delete images from uploads folder
const deleteImages = (images) => {
    if (!images) return;

    const imagePaths = Array.isArray(images) ? images : [images];
    imagePaths.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "..", imagePath);

        if (fs.existsSync(fullPath)) { // Ensure the file exists before deleting
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error(`Error deleting image: ${fullPath}`, err.message);
                } else {
                    console.log(`Deleted image: ${fullPath}`);
                }
            });
        } else {
            console.error(`Image not found: ${fullPath}`);
        }
    });
};
