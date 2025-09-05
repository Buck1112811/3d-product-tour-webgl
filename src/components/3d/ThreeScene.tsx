import React, { memo, useRef, useEffect, useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { useTheme } from '../../context/ThemeContext';
import { ThreeSceneProps } from '../../types';
import { Stats } from '@react-three/drei'

import '../../styles/components/three-scene.css';

interface ThreeSceneContextType {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
}

const ThreeSceneContext = React.createContext<ThreeSceneContextType | undefined>(undefined);

const useThreeScene = (): ThreeSceneContextType => {
  const context = React.useContext(ThreeSceneContext);
  if (!context) {
    throw new Error('useThreeScene must be used within a ThreeScene component');
  }
  return context;
};

const ThreeScene: React.FC<ThreeSceneProps> = memo(({ children }) => {
  ThreeScene.displayName = 'ThreeScene';
  const { scene, camera, gl, size } = useThree();
  const container = useRef<THREE.Group>(null);
  const { isDarkMode } = useTheme();

  const initialCameraPosition = useMemo(() => new THREE.Vector3(0, 0, 5), []);

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.useLegacyLights = false;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;

    return () => {
      gl.dispose()
    };
  }, [])

  useEffect(() => {
    if (!camera) return;

    camera.position.copy(initialCameraPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, initialCameraPosition]);

  useEffect(() => {
    if (!container.current) return;

    const cleanup = () => {
      if (container.current) {
        container.current.traverse((object) => {
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
    return cleanup;
  }, []);

  return (
    <ThreeSceneContext.Provider value={{ scene, camera, renderer: gl }}>
      <group ref={container}>
        <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
        <directionalLight position={[5, 5, 5]} intensity={isDarkMode ? 0.5 : 0.8} castShadow />
        {children}
        <OrbitControls autoRotate enableZoom={false} enablePan={false} />
        <Stats />
      </group>
    </ThreeSceneContext.Provider>
  );
});

export { ThreeScene, useThreeScene };