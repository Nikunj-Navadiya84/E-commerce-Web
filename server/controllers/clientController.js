const fs = require("fs");
const path = require("path");
const Client = require("../models/Client");
const logger = require("../Logger/logger");

const getLogMetadata = (req) => ({
    username: req.user ? req.user.id : "Unknown",
    ip: req.ip,
});


// Create Client
exports.createClient = async (req, res) => {
    try {
        const { name, description, review } = req.body;
        const images = req.file ? req.file.path : "";
        const date = new Date();

        const client = new Client({
            name,
            description,
            images,
            review,
            date,
        });

        await client.save();

        logger.info(`Product Created Successfully....Client Id: ${client._id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        res.status(201).json({ success: true, message: "Client created successfully", client });
    } catch (error) {
        logger.error("Error creating Client", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: error.message,
            stack: error.stack,
            ...getLogMetadata(req),
        });

        res.status(500).json({ success: false, message: "Error creating Client", error: error.message });
    }
};


// get Client
exports.getClient = async (req, res) => {
    try {
        logger.info("Fetching all client", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        const client = await Client.find(); 

        if (!client || client.length === 0) {
            logger.warn("No client found", {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req),
            });
            return res.status(404).json({ success: false, message: "No client found" });
        }

        logger.info(`Fetched ${client.length} client`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        return res.status(200).json({ success: true, message: "client fetched successfully", client });

    } catch (err) {
        logger.error("Error fetching client", {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req),
        });

        return res.status(500).json({ success: false, message: "Error fetching client", error: err.message });
    }
};


// Update Client
exports.updateClient = async (req, res) => {
    try {
        let editid = req.params.id;
        const { name, description, review } = req.body;

        logger.info(`Received Updating Request for....Client ID: ${editid}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        const oldClient = await Client.findById(editid);
        if (!oldClient) {
            logger.warn(`Client ID: ${editid} not found`, {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req),
            });
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        let updatedData = { name, description, review };

        // Remove undefined fields
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

        // Handle single image update
        if (req.file) {
            deleteImages([oldClient.images]); // Delete the old image
            updatedData.images = req.file.path;
        } else {
            updatedData.images = oldClient.images;
        }

        const updatedClient = await Client.findByIdAndUpdate(editid, updatedData, { new: true });

        logger.info(`Successfully Updated....Client ID: ${editid}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req),
        });

        res.status(200).json({ success: true, message: "Client updated", client: updatedClient });

    } catch (err) {
        logger.error(`Error updating client ID: ${req.params.id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req),
        });
        res.status(500).json({ success: false, message: "Error updating client", error: err.message });
    }
};


// Delete Client
exports.deleteClient = async (req, res) => {
    try {
        let clientId = req.params.id;

        if (!clientId) {
            return res.status(400).send({ success: false, message: "Invalid client ID" });
        }

        logger.info(`Received Delete Request for....Client ID: ${clientId}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req)
        });

        let client = await Client.findById(clientId);
        if (!client) {
            logger.warn(`Not Found Client with ID: ${clientId}`, {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                ...getLogMetadata(req)
            });
            return res.status(404).send({ success: false, message: "Client not found" });
        }

        deleteImages(client.images)

        await Client.findByIdAndDelete(clientId);
        logger.info(`Successfully Deleted....Client ID: ${clientId}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            ...getLogMetadata(req)
        });

        res.status(200).send({ success: true, message: "Client successfully deleted" });
    } catch (err) {
        logger.error(`Error deleting Client ID: ${req.params.id}`, {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            error: err.message,
            stack: err.stack,
            ...getLogMetadata(req)
        });
        res.status(500).send({ success: false, message: "Internal Server Error", error: err.message });
    }
};


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
