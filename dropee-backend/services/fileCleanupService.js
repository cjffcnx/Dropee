const FileModel = require('../model/fileModel');
const { deleteStoredFile } = require('./fileStorageService');

let cleanupTimer = null;

const safelyDeleteStoredFile = async (storageId) => {
    try {
        await deleteStoredFile(storageId);
    } catch (error) {
        if (error.code !== 'ENOENT' && error.message !== 'FileNotFound') {
            console.error('Failed to delete stored file:', error.message);
        }
    }
};

const cleanupExpiredFiles = async () => {
    const expiredFiles = await FileModel.find({
        expiresAt: { $lte: new Date() },
    }).select('_id storageId');

    if (expiredFiles.length === 0) {
        return;
    }

    for (const file of expiredFiles) {
        await safelyDeleteStoredFile(file.storageId);
    }

    await FileModel.deleteMany({
        _id: { $in: expiredFiles.map((file) => file._id) },
    });
};

const removeLegacyTtlIndex = async () => {
    try {
        const indexes = await FileModel.collection.indexes();
        const ttlIndex = indexes.find(
            (index) => index.name === 'createdAt_1' && index.expireAfterSeconds
        );

        if (ttlIndex) {
            await FileModel.collection.dropIndex(ttlIndex.name);
        }
    } catch (error) {
        if (error.codeName !== 'NamespaceNotFound') {
            console.error('Failed to update file indexes:', error.message);
        }
    }
};

const startFileCleanupTask = () => {
    if (cleanupTimer) {
        return;
    }

    cleanupTimer = setInterval(() => {
        cleanupExpiredFiles().catch((error) => {
            console.error('File cleanup failed:', error.message);
        });
    }, 6 * 60 * 60 * 1000);
};

module.exports = {
    cleanupExpiredFiles,
    removeLegacyTtlIndex,
    startFileCleanupTask,
};