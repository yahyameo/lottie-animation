import { openDB } from 'idb';

const dbPromise = openDB('lottie-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('animations')) {
            const store = db.createObjectStore('animations', {
                keyPath: 'id',
            });
            store.createIndex('nameIndex', 'name');
            store.createIndex('uploadedIndex', 'uploaded');
        } else {
            const store = db.transaction('animations', 'versionchange').objectStore('animations');
            if (!store.indexNames.contains('nameIndex')) {
                store.createIndex('nameIndex', 'name');
            }
            if (!store.indexNames.contains('uploadedIndex')) {
                store.createIndex('uploadedIndex', 'uploaded');
            }
        }
    },
});

export const saveAnimation = async (animation: any = {}) => {
    const db = await dbPromise;
    await db.put('animations', animation);
};

export const getAnimations = async () => {
    const db = await dbPromise;
    return await db.getAll('animations');
};
export const getUnsyncedAnimations = async () => {
    const db = await dbPromise;
    const tx = db.transaction('animations', 'readonly');
    const store = tx.objectStore('animations');
    const index = store.index('uploadedIndex');
    const keyRange = IDBKeyRange.only(0);
    return await index.getAll(keyRange);
};

