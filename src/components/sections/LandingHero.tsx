import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import '../../styles/components/landing-hero.css';

export interface LandingHeroProps {
  modelPath?: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
}

interface GLTFResult extends THREE.GLTF {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
}

interface HeroAnimationProps {
  rotationSpeed?: number;
  floatHeight?: number;
}

const LandingHero: React.FC<LandingHeroProps> = React.memo(({
  modelPath = '/models/hero.glb',
  title,
  subtitle,
  ctaLabel,
  ctaLink,
}) => {
  LandingHero.displayName = 'LandingHero';
  const { isDarkMode } = useTheme();
  const { scene } = useThree();
  const [ loading, setLoading ] = useState(true)

  const groupRef = useRef<THREE.Group>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { nodes, materials } = useGLTF(modelPath) as GLTFResult;

  const { createTimeline } = use3DAnimation();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [error, setError] = useState<Error | null>(null);

  const animationProps: HeroAnimationProps = useMemo(() => ({
    rotationSpeed: 0.01,
    floatHeight: 0.1,
  }), []);

  useEffect(() => {
    if (inView && !tl.current && nodes) {
      tl.current = createTimeline({
        targets: groupRef.current?.rotation,
        values: { y: Math.PI * 2 },
        duration: 5,
        repeat: -1,
        yoyo: true,
      });
    }

    if (!inView && tl.current) {
      tl.current.pause();
    }

    return () => {
      if (tl.current) {
        tl.current.kill();
        tl.current = null;
      }
    };
  }, [inView, createTimeline, animationProps, nodes]);

   useEffect(() => {
         setLoading(false)
    }, []);

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
            <section ref={ref} className="py-20">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">An error occurred while loading the 3D model.</h2>
                    <p className="text-red-500">{error.message}</p>
                </div>
            </section>
        );
    }

    if(loading) {
      return (
        <section ref={ref} className="py-20">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg mb-8">{subtitle}</p>
              <a
                href={ctaLink}
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                aria-label={ctaLabel}
              >
                {ctaLabel}
              </a>
            </div>
            <div className="flex justify-center">
                <p>Loading 3D model...</p>
            </div>
          </div>
        </section>
      )
    }

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg mb-8">{subtitle}</p>
          <a
            href={ctaLink}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </a>
        </div>
        <div className="relative">
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <group ref={groupRef} position={[0, 0, 0]}>
              {nodes && Object.keys(nodes).map((key) => {
                const node = nodes[key] as THREE.Mesh;
                if (node && node instanceof THREE.Mesh) {
                  return (
                    <mesh
                      key={key}
                      geometry={node.geometry}
                      material={materials[node.material.name]}
                      castShadow
                      receiveShadow
                    />
                  );
                }
                return null;
              })}
            </group>
            <OrbitControls autoRotate enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>
    </section>
  );
});

export default LandingHero;