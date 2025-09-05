import React, { memo, useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { Link, useLocation } from 'react-router-dom';

import MinimalLayout from '@/components/layout/MinimalLayout';
import { useTheme } from '@/context/ThemeContext';
import { three3DHelpersUtil } from '@/utils/three-helpers';
import type { ThreeDComponentProps } from '@/types';
import '../styles/pages/model-showcase.css';

interface ModelShowcasePageProps extends ThreeDComponentProps {
  modelPath?: string;
  modelName?: string;
  modelDescription?: string;
}

const ModelShowcasePage: React.FC<ModelShowcasePageProps> = memo(({
  modelPath = '/models/default.glb',
  modelName = '3D Model Showcase',
  modelDescription = 'Explore the details of our amazing 3D model.',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  ...props
}) => {
  ModelShowcasePage.displayName = 'ModelShowcasePage';
  const { isDarkMode } = useTheme();
  const { scene, camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    document.title = modelName;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', modelDescription);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = modelDescription;
      document.head.appendChild(newMeta);
    }
  }, [modelName, modelDescription]);

  useEffect(() => {
    let gltfLoader: GLTFLoader | null = null;

    const loadModel = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(modelPath);
        const loadedModel = gltf.scene;

        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setModel(loadedModel);
        setLoading(false);
      } catch (error: any) {
        console.error('Error loading model:', error);
        setLoadError(error);
        setLoading(false);
      } finally {
        // GLTFLoader doesn't have dispose method
      }
    };

    loadModel();

    return () => {
      // GLTFLoader doesn't have dispose method
    };
  }, [modelPath]);

  useEffect(() => {
    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  three3DHelpersUtil.disposeMaterial(material);
                });
              } else {
                three3DHelpersUtil.disposeMaterial(object.material);
              }
            }
          }
        });
      }
    };
  }, []);

  const renderModel = () => {
    if (loadError) {
      return (
        <Html center>
          <div style={{ color: 'red' }}>Error loading model: {loadError.message}</div>
        </Html>
      );
    }

    if (loading) {
      return <Html center>Loading...</Html>;
    }

    return model ? <primitive object={model} position={position as [number, number, number]} rotation={rotation as [number, number, number]} /> : null;
  };

  return (
    <MinimalLayout>
      <section className="model-showcase-page">
        <div className="container mx-auto">
          <h1 className="model-name">{modelName}</h1>
          <p className="model-description">{modelDescription}</p>
          <div className="model-container">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
              <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
              <directionalLight position={[5, 5, 5]} intensity={isDarkMode ? 0.5 : 0.8} castShadow />
              <Suspense fallback={<Html center>Loading...</Html>}>
                {renderModel()}
              </Suspense>
              <OrbitControls autoRotate enableZoom enablePan />
            </Canvas>
          </div>
        </div>
      </section>
    </MinimalLayout>
  );
});

export default ModelShowcasePage;