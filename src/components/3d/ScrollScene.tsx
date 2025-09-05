import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';

import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { useTheme } from '../../context/ThemeContext';
import { ThreeSceneProps } from '../../types';

import '../../styles/components/scroll-scene.css';

const ScrollScene: React.FC<ThreeSceneProps> = React.memo(({ children }) => {
  ScrollScene.displayName = 'ScrollScene';
  const { scene, camera, gl, size } = useThree();
  const { scrollY } = useScrollAnimation();
  const container = useRef<THREE.Group>(null);
  const { isDarkMode } = useTheme();

  const initialCameraPosition = useMemo(() => new THREE.Vector3(0, 0, 5), []);
  const maxScroll = 10;

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

  useEffect(() => {
    if (!camera) return;

    camera.position.copy(initialCameraPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, initialCameraPosition]);

  useFrame(() => {
    if (!camera || !container.current) return;
    const scrollPosition = scrollY.current;

    const newX = initialCameraPosition.x + scrollPosition * 0.5;
    const newY = initialCameraPosition.y + scrollPosition * 0.1;
    const newZ = initialCameraPosition.z - scrollPosition * 0.2;

    camera.position.set(newX, newY, newZ);

    container.current.rotation.y = scrollPosition * 0.1;

  });

  return (
    <group ref={container}>
      {children}
    </group>
  );
});

export default ScrollScene;