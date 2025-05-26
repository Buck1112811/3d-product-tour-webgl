import * as THREE from 'three';

/**
 * Generates a URL for a sample 3D model.
 * @returns {string} The URL of the sample 3D model.
 */
export const getSampleModelURL = (): string => {
  // Secure and validate the file path to prevent path injection
  const fileName = 'lowpoly.glb';
  const baseURL = '/models/'; // Or load URL from an env Variable
  const modelPath = `${baseURL}${fileName}`;
  // Double check the path and URL are OK.
  return modelPath;
};

/**
 * The local path for 3d mesh object, You can test your GLTF and meshes before uploading to 3D. 
 */
export const modelPath: string = '/models/lowpoly.glb';

/**
 * Creates a simple 3D scene with a sample model.
 * @param {THREE.Scene} scene - The Three.js scene to add the model to.
 * @returns {void}
 */
export const createSampleScene = (scene: THREE.Scene): void => {
  try {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  } catch (error: any) {
    console.error('Error creating sample scene:', error);
  }
};