import { openDB } from 'idb';

export const PRODUCT_FORM_DB_NAME = 'productFormDB';
const STORE_NAME = 'files';
const IMAGE_STORE = 'images';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(PRODUCT_FORM_DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
    },
  });
};

export const saveFile = async (file: File, id: string, meta: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, { id, file, meta });
};

export const getAllFiles = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteAllFiles = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};

export const saveImageFile = async (file: File, id: string, meta: any) => {
  const db = await initDB();
  await db.put(IMAGE_STORE, { id, file, meta });
};

export const getAllImageFiles = async () => {
  const db = await initDB();
  return db.getAll(IMAGE_STORE);
};

export const deleteAllImageFiles = async () => {
  const db = await initDB();
  await db.clear(IMAGE_STORE);
};
