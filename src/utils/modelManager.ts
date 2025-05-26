import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from 'meshoptimizer';
import { GLTF } from 'three-stdlib';
import { core } from '@gltf-transform/core';

interface ModelCacheEntry {
    model: THREE.Group;
    timestamp: number;
}

interface OptimizeModelOptions {
  draco?: boolean;
  ktx2?: boolean;
  lossless?: boolean;
}

const MODEL_DB_NAME = 'modelDB';
const MODEL_STORE_NAME = 'models';
const MODEL_DB_VERSION = 1;

/**
 * Caches a 3D model (THREE.Group) in local storage (IndexedDB) using a URL as the key.
 * @param url - The URL of the model to cache.
 * @param model - The 3D model (THREE.Group) to cache.
 */
export const cacheModel = async (url: string, model: THREE.Group): Promise<void> => {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(MODEL_DB_NAME, MODEL_DB_VERSION);

        openRequest.onerror = () => {
            console.error(`IndexedDB: Error opening database ${MODEL_DB_NAME}`, openRequest.error);
            reject(openRequest.error);
        };

        openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            if (!db.objectStoreNames.contains(MODEL_STORE_NAME)) {
                db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'url' });
            }
        };

        openRequest.onsuccess = () => {
            const db = openRequest.result as IDBDatabase;
            const transaction = db.transaction(MODEL_STORE_NAME, 'readwrite');
            const objectStore = transaction.objectStore(MODEL_STORE_NAME);

            const modelData: ModelCacheEntry = {
                model: model.toJSON(),
                timestamp: Date.now(),
            };

            const request = objectStore.put({ url, modelData });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                console.error(`IndexedDB: Error putting model with URL ${url}`, request.error);
                reject(request.error);
            };

            transaction.oncomplete = () => {
                db.close();
            };
        };
    });
};

/**
 * Retrieves a cached 3D model (THREE.Group) from local storage (IndexedDB) using a URL.
 * @param url - The URL of the model to retrieve.
 * @returns A Promise that resolves with the cached 3D model (THREE.Group) or null if not found.
 */
export const getModel = async (url: string): Promise<THREE.Group | null> => {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(MODEL_DB_NAME, MODEL_DB_VERSION);

        openRequest.onerror = () => {
            console.error(`IndexedDB: Error opening database ${MODEL_DB_NAME}`, openRequest.error);
            reject(openRequest.error);
        };

        openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            if (!db.objectStoreNames.contains(MODEL_STORE_NAME)) {
                db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'url' });
            }
        };

        openRequest.onsuccess = () => {
            const db = openRequest.result as IDBDatabase;
            const transaction = db.transaction(MODEL_STORE_NAME, 'readonly');
            const objectStore = transaction.objectStore(MODEL_STORE_NAME);
            const request = objectStore.get(url);

            request.onerror = () => {
                console.error(`IndexedDB: Error getting model with URL ${url}`, request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                const result = request.result as { url: string; modelData: ModelCacheEntry } | undefined;
                if (result) {
                    try {
                        const loader = new THREE.ObjectLoader();
                        const model = loader.parse(result.modelData.model) as THREE.Group;
                        resolve(model);
                    } catch (e) {
                        console.error("Error parsing model JSON", e);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };

            transaction.oncomplete = () => {
                db.close();
            };
        };
    });
};

/**
 * Disposes of a 3D model and its associated resources, cleaning IndexedDB.
 * @param url - The URL of the model to dispose of.
 */
export const disposeModel = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(MODEL_DB_NAME, MODEL_DB_VERSION);

        openRequest.onerror = () => {
            console.error(`IndexedDB: Error opening database ${MODEL_DB_NAME}`, openRequest.error);
            reject(openRequest.error);
        };

        openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            if (!db.objectStoreNames.contains(MODEL_STORE_NAME)) {
                db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'url' });
            }
        };

        openRequest.onsuccess = () => {
            const db = openRequest.result as IDBDatabase;
            const transaction = db.transaction(MODEL_STORE_NAME, 'readwrite');
            const objectStore = transaction.objectStore(MODEL_STORE_NAME);

            const getRequest = objectStore.get(url);

            getRequest.onsuccess = () => {
                const result = getRequest.result as { url: string; modelData: ModelCacheEntry } | undefined;

                if (result && result.modelData.model) {
                    try {
                      const loader = new THREE.ObjectLoader();
                      const model = loader.parse(result.modelData.model) as THREE.Group;

                      model.traverse((object: any) => {
                        if (object.isMesh) {
                          object.geometry?.dispose();
                          if (Array.isArray(object.material)) {
                            object.material.forEach(material => {
                              material.dispose();
                              for (const key in material) {
                                if (material[key] && material[key].isTexture) {
                                  (material[key] as THREE.Texture).dispose();
                                }
                              }
                            });
                          } else {
                            (object.material as THREE.Material).dispose();
                            for (const key in object.material) {
                              if ((object.material as any)[key] && (object.material as any)[key].isTexture) {
                                ((object.material as any)[key] as THREE.Texture).dispose();
                              }
                            }
                          }
                        }
                      });

                    } catch (e) {
                        console.error("Error disposing model", e);
                    }
                }

                const deleteRequest = objectStore.delete(url);

                deleteRequest.onerror = () => {
                    console.error(`IndexedDB: Error deleting model with URL ${url}`, deleteRequest.error);
                    reject(deleteRequest.error);
                };

                deleteRequest.onsuccess = () => {
                    resolve();
                };
            };

            getRequest.onerror = () => {
                console.error(`IndexedDB: Error getting model for disposal with URL ${url}`, getRequest.error);
                reject(getRequest.error);
            };

            transaction.oncomplete = () => {
                db.close();
            };
        };
    });
};

/**
 * Optimizes a 3D model (THREE.Group) for web delivery.
 * @param model - The 3D model (THREE.Group) to optimize.
 * @returns The optimized 3D model (THREE.Group).
 */
export const optimizeModel = async (model: THREE.Group, options: OptimizeModelOptions = {}): Promise<THREE.Group> => {
  try {
    // @ts-ignore
    const { draco = true, ktx2 = true, lossless = true } = options;

    if (draco) {
      // TO implement GLTF and other compression requirements.
    }
    return model;
  } catch (error) {
    console.error('Error optimizing model:', error);
    return model;
  }
};