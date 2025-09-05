import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { EffectComposer, Bloom, DepthOfField, SSAO } from '@react-three/postprocessing';
import { useTheme } from '@/context/ThemeContext';
import { use3DAnimation } from '@/hooks/use3DAnimation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { three3DHelpersUtil } from '@/utils/three-helpers';
import type { ThreeDComponentProps } from '@/types';
import MinimalLayout from '@/components/layout/MinimalLayout';

const ExperiencePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <MinimalLayout>
      <div className="container mx-auto py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-center">Section 1: Core Features</h2>
          <p className="text-gray-600 text-center">Exploring basic product functionality</p>
          <div className="h-96">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
              <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
              <directionalLight position={[5, 5, 5]} intensity={isDarkMode ? 0.5 : 0.8} castShadow />
              {/* Simple Model Load with basic geometry - LOW Mesh  */}
              <FakeMesh />
              <OrbitControls autoRotate enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-center">Section 2: Enhanced Capabilities</h2>
          <p className="text-gray-600 text-center">Diving into more advanced tools and integrations</p>
          <div className="h-96">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
              <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
              <directionalLight position={[5, 5, 5]} intensity={isDarkMode ? 0.5 : 0.8} castShadow />
              {/* ThreeJS loader to upload mesh (GLTF or GLB) - Medium Mesh */}
              <LoadTest />
              <OrbitControls autoRotate enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-center">Section 3: Immersive Experience</h2>
          <p className="text-gray-600 text-center">Showcasing the most visually stunning aspects of the product</p>
          <div className="h-96">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
              <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
              {/* Test the component with the function for Reload- HIGH mesh */}
              <TestReload />
              <OrbitControls autoRotate enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </section>
      </div>
    </MinimalLayout>
  );
};

interface TestModelProps {
  scale?: number;
}

const FakeMesh: React.FC<TestModelProps> = ({ scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene, gl, camera } = useThree();
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'black' : 'gray';
    const rotationSpeed = 0.01;
  const [error, setError] = useState<Error | null>(null);
  
    useFrame(() => {
          if (meshRef.current) {
              meshRef.current.rotation.x += rotationSpeed;
              meshRef.current.rotation.y += rotationSpeed;
          }
      });
  return (
    <mesh position={[0, 0, 0]} ref={meshRef} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const LoadTest: React.FC<TestModelProps> = ({ scale = 1 }) => {
    const { scene, gl, camera } = useThree();
    const [ loading, setLoading ] = useState(true)
    const { isDarkMode } = useTheme();
    const [error, setError] = useState<Error | null>(null);
    const [model, setModel] = useState<THREE.Group | null>(null);

      useEffect(() => {
          let gltfLoader: GLTFLoader | null = null;

          const loadModel = async () => {
              try {
                  setLoading(true);
                  setError(null);

                  gltfLoader = new GLTFLoader();
                  const gltf = await gltfLoader.loadAsync('/models/lowpoly.glb');
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
                  setError(error);
                  setLoading(false);
              } finally {
                  // GLTFLoader doesn't have dispose method
              }
          };

          loadModel();

          return () => {
              // GLTFLoader doesn't have dispose method
          };
      }, []);

    const renderModel = () => {
          if (error) {
              return (
                  <Html center>
                      <div style={{ color: 'red' }}>Error loading model: {error.message}</div>
                  </Html>
              );
          }

          if (loading) {
              return <Html center>Loading...</Html>;
          }
          if(model === null) return <></>;
          return <primitive object={model} position={[0,0,0]}/>;
      };

  return (
      <>{renderModel()}</>
  );
};

const TestReload: React.FC<TestModelProps> = ({ scale = 1 }) => {
    const { scene, gl, camera } = useThree();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [model, setModel] = useState<THREE.Group | null>(null);
    const [reload, setReload] = useState(false);
    const { isDarkMode } = useTheme();
  
    const color = isDarkMode ? 'black' : 'white';

    useEffect(() => {
        let gltfLoader: GLTFLoader | null = null;

        const loadModel = async () => {
            try {
                setLoading(true);
                setError(null);

                gltfLoader = new GLTFLoader();
                const gltf = await gltfLoader.loadAsync('/models/tree.glb');
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
                setError(error);
                setLoading(false);
            } finally {
                // GLTFLoader doesn't have dispose method
            }
        };

        loadModel();

        return () => {
            gltfLoader?.dispose();
        };
    }, [reload]);

    const handleRetry = () => {
        setReload(prev => !prev);
    };

    const renderModel = () => {
        if (error) {
            return (
                <Html center>
                    <div style={{ color: 'red' }}>Error loading model: {error.message}</div>
                    <button onClick={handleRetry}>Retry</button>
                </Html>
            );
        }

        if (loading) {
            return <Html center>Loading...</Html>;
        }
        if(model === null) return <></>;
        return <primitive object={model} position={[0,0,0]}/>;
    };

    return (
            <>{renderModel()}</>
    );
};

export default ExperiencePage;