import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, SSAO } from '@react-three/postprocessing';

import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ThreeDComponentProps } from '../../types';

const AdvancedScene: React.FC<ThreeDComponentProps> = React.memo(({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelPath = '/models/default.glb',
  envMapIntensity = 1,
  receiveShadow = true,
  castShadow = true,
  animationName,
  animationLoop = true,
  onClick,
  onPointerOver,
  onPointerOut,
  ...props
}) => {
  AdvancedScene.displayName = 'AdvancedScene';

  const { isDarkMode, colors } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const { scene, gl, camera, size, viewport, performance } = useThree();
  const { animate, createTimeline } = use3DAnimation();
  const { scrollY } = useScrollAnimation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const quality = useMemo(() => {
    const performanceMetric = performance.current;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile || performanceMetric < 0.5) return 'low';
    if (performanceMetric < 0.8) return 'medium';
    return 'high';
  }, [performance]);

  const { nodes, materials } = useGLTF(modelPath) as any;

  useEffect(() => {
    setLoading(false);
  }, [nodes, materials]);

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

  if (error) {
    return (
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }

  if (loading) {
    return (
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="gray" transparent opacity={0.5} />
      </mesh>
    );
  }

  return (
    <group
      ref={groupRef}
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
      {...props}
    >
      {/* Add additional elements based on component needs */}
      {nodes && Object.keys(nodes).map((key) => {
        const node = nodes[key] as THREE.Mesh;
        if (node && node instanceof THREE.Mesh) {
          return (
            <mesh
              key={key}
              geometry={node.geometry}
              material={materials[node.material.name]}
              castShadow={castShadow}
              receiveShadow={receiveShadow}
            />
          );
        }
        return null;
      })}
    </group>
  );
});

export default AdvancedScene;