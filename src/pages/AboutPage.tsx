import React, { memo, useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@/context/ThemeContext';
import { three3DHelpersUtil } from '@/utils/three-helpers';
import type { ThreeDComponentProps } from '@/types';
import MinimalLayout from '@/components/layout/MinimalLayout';
// import '../../styles/pages/about.css';

interface AboutPageProps extends ThreeDComponentProps { }

const AboutPage: React.FC<AboutPageProps> = memo(({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, }) => {
  AboutPage.displayName = 'AboutPage';
  const { isDarkMode } = useTheme();
  const { scene, camera, gl } = useThree();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = 0.01;

  useEffect(() => {
    let gltfLoader: GLTFLoader | null = null;

    const loadModel = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync('/models/about-page-element.glb');
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
  }, []);

  useEffect(() => {
    return () => {
      if (meshRef.current && meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
      }
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  const renderContent = () => {
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

    if (model === null) return <></>;

    return <primitive object={model} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />;
  };

  return (
    <MinimalLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center">About Our Company</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>To empower businesses with innovative solutions and exceptional service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul>
              <li>Innovation: We foster a culture of creativity and continuous improvement.</li>
              <li>Integrity: We operate with honesty, transparency, and ethical conduct.</li>
              <li>Customer Focus: We are committed to understanding and exceeding customer expectations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our History</h2>
            <p>Founded in 2024, we have grown from a small startup to a leading provider of SaaS products, serving clients worldwide.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Placeholder for team member profiles */}
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-gray-500">CEO</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold">Jane Smith</h3>
                <p className="text-sm text-gray-500">CTO</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold">Peter Jones</h3>
                <p className="text-sm text-gray-500">Head of Marketing</p>
              </div>
            </div>
          </section>
          <div className="model-3d-container">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }} style={{ height: '300px' }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
              <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
                {renderContent()}
              </Suspense>
              <OrbitControls autoRotate enableZoom={false} enablePan={false} />
            </Canvas>
          </div>
        </div>
      </section>
    </MinimalLayout>
  );
});

export default AboutPage;