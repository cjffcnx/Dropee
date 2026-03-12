import { openDB } from 'idb';
import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';

const DB_NAME = 'dropee-offline';
const STORE_NAME = 'upload-queue';

const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addToQueue = async (item) => {
  const db = await getDB();
  await db.add(STORE_NAME, { ...item, timestamp: Date.now() });
};

export const getQueue = async () => {
  const db = await getDB();
  return db.getAll(STORE_NAME);
};

export const removeFromQueue = async (id) => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};

const useOfflineQueue = (onSuccess) => {
  const processingRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const processQueue = useCallback(async () => {
    if (processingRef.current || !navigator.onLine) return;
    processingRef.current = true;

    try {
      const queue = await getQueue();
      for (const item of queue) {
        try {
          const formData = new FormData();
          formData.append('userId', item.userId);
          if (item.shareTitle) formData.append('shareTitle', item.shareTitle);
          if (item.email) formData.append('email', item.email);
          if (item.phone) formData.append('phone', item.phone);
          item.files.forEach((file) => formData.append('files', file));

          const response = await axios.post(`${baseUrl}api/v1/files/sendFile`, formData);
          if (response.data.status === 200) {
            await removeFromQueue(item.id);
            if (onSuccessRef.current) onSuccessRef.current(response.data);
          }
        } catch (err) {
          console.error('Offline queue item failed:', err);
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener('online', handleOnline);
    // Try to process on mount too
    if (navigator.onLine) {
      processQueue();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, [processQueue]);

  return { addToQueue, processQueue };
};

export default useOfflineQueue;
