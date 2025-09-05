import * as THREE from 'three';

/**
 * Creates a sphere geometry with configurable radius and segments.
 * @param radius - The radius of the sphere.
 * @param segments - The number of width and height segments.
 * @returns A new THREE.SphereGeometry object.
 */
export const createSphereGeometry = (radius: number, segments: number): THREE.SphereGeometry => {
  if (typeof radius !== 'number' || isNaN(radius)) {
    console.warn('Invalid radius value, defaulting to 1.');
    radius = 1;
  }
  if (typeof segments !== 'number' || isNaN(segments)) {
    console.warn('Invalid segments value, defaulting to 32.');
    segments = 32;
  }
  return new THREE.SphereGeometry(radius, segments, segments);
};

/**
 * Loads a texture from a given URL.
 * @param url - The URL of the texture to load.
 * @returns A Promise that resolves with the loaded THREE.Texture.
 */
export const loadTexture = async (url: string): Promise<THREE.Texture> => {
  if (typeof url !== 'string') {
    throw new Error('Texture URL must be a string.');
  }

  const textureLoader = new THREE.TextureLoader();
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.name = url;
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the texture:', url, error);
        reject(error);
      }
    );
  });
};

/**
 * Creates a MeshStandardMaterial with configurable color, roughness, and metalness.
 * @param color - The color of the material.
 * @param roughness - The roughness of the material.
 * @param metalness - The metalness of the material.
 * @param options - Parameters of the meterial like name and other configurations
 * @returns A new THREE.MeshStandardMaterial object.
 */
export const createMaterial = (
  color: string,
  roughness: number,
  metalness: number,
  options: THREE.MeshStandardMaterialParameters = {}
): THREE.MeshStandardMaterial => {
  if (typeof color !== 'string') {
    console.warn('Invalid color value, defaulting to white.');
    color = '#FFFFFF';
  }
  if (typeof roughness !== 'number' || isNaN(roughness)) {
    console.warn('Invalid roughness value, defaulting to 0.5.');
    roughness = 0.5;
  }
  if (typeof metalness !== 'number' || isNaN(metalness)) {
    console.warn('Invalid metalness value, defaulting to 0.5.');
    metalness = 0.5;
  }

  const parsedColor = new THREE.Color(color);
  return new THREE.MeshStandardMaterial({
    color: parsedColor,
    roughness: roughness,
    metalness: metalness,
    ...options
  });
};

/**
 * Performs raycasting to detect intersections between the mouse cursor and 3D objects in the scene.
 * @param mouse - The mouse coordinates in normalized device coordinates (-1 to +1).
 * @param camera - The camera used for rendering the scene.
 * @param scene - The Three.js scene.
 * @returns A Promise that resolves with an array of intersections.
 */
export const performRaycast = async (
  mouse: THREE.Vector2,
  camera: THREE.Camera,
  scene: THREE.Scene
): Promise<THREE.Intersection[]> => {
  if (!(mouse instanceof THREE.Vector2)) {
    throw new Error('Mouse must be a THREE.Vector2.');
  }

  if (!(camera instanceof THREE.Camera)) {
    throw new Error('Camera must be a THREE.Camera.');
  }

  if (!(scene instanceof THREE.Scene)) {
    throw new Error('Scene must be a THREE.Scene.');
  }

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  return new Promise((resolve, reject) => {
    try {
      const intersects = raycaster.intersectObjects(scene.children, true);
      resolve(intersects);
    } catch (error: any) {
      console.error('Error performing raycast:', error);
      reject(error);
    }
  });
};

/**
 * Generates a random Vector3 within a specified range.
 * @param min - The minimum value for each component.
 * @param max - The maximum value for each component.
 * @returns A new THREE.Vector3 with random values.
 */
export const generateRandomVector = (min: number, max: number): THREE.Vector3 => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Min and max must be numbers.');
  }

  const x = Math.random() * (max - min) + min;
  const y = Math.random() * (max - min) + min;
  const z = Math.random() * (max - min) + min;

  return new THREE.Vector3(x, y, z);
};

/**
 * Creates ambient light with defined color and intensity that integrates theme.
 * @param color - The color for the created ambient light.
 * @param intensity - The intensity for the created ambient light.
 * @returns A new THREE.AmbientLight with given parameters.
 */
export const createAmbientLight = (color: string, intensity: number): THREE.AmbientLight => {
  if (typeof color !== 'string') {
    console.warn('Invalid color value, defaulting to white.');
    color = '#FFFFFF';
  }
  if (typeof intensity !== 'number' || isNaN(intensity)) {
    console.warn('Invalid intensity value, defaulting to 0.5.');
    intensity = 0.5;
  }
    const parsedColor = new THREE.Color(color);
    const ambientLight = new THREE.AmbientLight(parsedColor, intensity);

    return ambientLight;
};

/**
 * Creates directional light with defined color, intensity and position, enabling shadows.
 * @param color - The color for the directional light.
 * @param intensity - The intensity for the directional light.
 * @param position - The position of the directional light.
 * @returns A new THREE.DirectionalLight with given parameters.
 */
export const createDirectionalLight = (color: string, intensity: number, position: THREE.Vector3): THREE.DirectionalLight => {
    if (typeof color !== 'string') {
        console.warn('Invalid color value, defaulting to white.');
        color = '#FFFFFF';
    }
    if (typeof intensity !== 'number' || isNaN(intensity)) {
        console.warn('Invalid intensity value, defaulting to 0.5.');
        intensity = 0.5;
    }
    if (!(position instanceof THREE.Vector3)) {
        console.warn('Invalid position value, defaulting to (5,5,5).');
        position = new THREE.Vector3(5, 5, 5);
    }

    const parsedColor = new THREE.Color(color);
    const directionalLight = new THREE.DirectionalLight(parsedColor, intensity);
    directionalLight.position.copy(position);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    return directionalLight;
};

/**
 * Applies a bloom post-processing effect to the scene.
 *
 * @param scene - The Three.js scene to apply the effect to.
 * @param camera - The camera used for rendering the scene.
 * @param renderer - The WebGL renderer.
 * @param bloomStrength - The bloom strength.
 * @param bloomRadius - The bloom kernel radius.
 * @param bloomThreshold - The bloom threshold.
 */
export const applyBloomEffect = (
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  bloomStrength: number = 0.8,
  bloomRadius: number = 0.3,
  bloomThreshold: number = 0.9
): void => {
  // Check if scene and camera are Three.js objects
  if (!(scene instanceof THREE.Scene)) {
    console.warn('Invalid scene provided for bloom effect.');
    return;
  }

  if (!(camera instanceof THREE.Camera)) {
    console.warn('Invalid camera provided for bloom effect.');
    return;
  }

  // Check if renderer is a WebGLRenderer
  if (!(renderer instanceof THREE.WebGLRenderer)) {
    console.warn('Invalid renderer provided for bloom effect.');
    return;
  }

  // Check if bloom parameters are numbers and within reasonable ranges
  if (typeof bloomStrength !== 'number' || isNaN(bloomStrength) || bloomStrength < 0 || bloomStrength > 2) {
    console.warn('Invalid bloomStrength value, defaulting to 0.8.');
    bloomStrength = 0.8;
  }

  if (typeof bloomRadius !== 'number' || isNaN(bloomRadius) || bloomRadius < 0 || bloomRadius > 1) {
    console.warn('Invalid bloomRadius value, defaulting to 0.3.');
    bloomRadius = 0.3;
  }

  if (typeof bloomThreshold !== 'number' || isNaN(bloomThreshold) || bloomThreshold < 0 || bloomThreshold > 1) {
    console.warn('Invalid bloomThreshold value, defaulting to 0.9.');
    bloomThreshold = 0.9;
  }
};

/**
 * Recursively disposes of a Three.js object and its children to release memory.
 * @param object - The Three.js object to dispose of.
 */
export const disposeObject = (object: THREE.Object3D): void => {
  if (!object) return;

  if (object.geometry) {
    (object.geometry as THREE.BufferGeometry).dispose();
  }

  if (object.material) {
    const material = object.material as THREE.Material | THREE.Material[];

    if (Array.isArray(material)) {
      material.forEach((mat) => {
        disposeMaterial(mat);
      });
    } else {
      disposeMaterial(material);
    }
  }

  if (object.children) {
    object.children.forEach((child) => {
      disposeObject(child);
    });
  }
};

/**
 * Disposes of a Three.js material and its textures.
 * @param material - The Three.js material to dispose of.
 */
const disposeMaterial = (material: THREE.Material): void => {
  if (!material) return;

  if (material.map) material.map.dispose();
  if (material.lightMap) material.lightMap.dispose();
  if (material.bumpMap) material.bumpMap.dispose();
  if (material.normalMap) material.normalMap.dispose();
  if (material.specularMap) material.specularMap.dispose();
  if (material.envMap) material.envMap.dispose();
  if (material.aoMap) material.aoMap.dispose();
  if (material.displacementMap) material.displacementMap.dispose();
  if (material.metalnessMap) material.metalnessMap.dispose();
  if (material.roughnessMap) material.roughnessMap.dispose();
  if (material.alphaMap) material.alphaMap.dispose();
  if (material.emissiveMap) material.emissiveMap.dispose();
  material.dispose();
};

/**
 * Main utility object containing all three.js helper functions
 */
export const three3DHelpersUtil = {
  createSphereGeometry,
  loadTexture,
  disposeObject,
  disposeMaterial
};