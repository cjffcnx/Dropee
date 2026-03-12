const fs = require('fs');
const mongoose = require('mongoose');

const getBucket = () => {
    if (!mongoose.connection.db) {
        throw new Error('MongoDB connection is not ready');
    }

    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
    });
};

const uploadFileFromDisk = (file) => {
    return new Promise((resolve, reject) => {
        const bucket = getBucket();
        const readStream = fs.createReadStream(file.path);
        const uploadStream = bucket.openUploadStream(file.filename, {
            contentType: file.mimetype,
            metadata: {
                originalName: file.originalname,
            },
        });

        readStream.on('error', reject);
        uploadStream.on('error', reject);
        uploadStream.on('finish', () => {
            resolve({
                storageId: uploadStream.id.toString(),
            });
        });

        readStream.pipe(uploadStream);
    });
};

const deleteStoredFile = async (storageId) => {
    if (!storageId) {
        return;
    }

    const bucket = getBucket();
    const objectId = new mongoose.Types.ObjectId(storageId);
    await bucket.delete(objectId);
};

const openDownloadStream = (storageId) => {
    const bucket = getBucket();
    return bucket.openDownloadStream(new mongoose.Types.ObjectId(storageId));
};

module.exports = {
    uploadFileFromDisk,
    deleteStoredFile,
    openDownloadStream,
};