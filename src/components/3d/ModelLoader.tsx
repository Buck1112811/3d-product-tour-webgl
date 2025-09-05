import React, { Suspense, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three-stdlib';
import { KTX2Loader } from 'three-stdlib';
import { MeshoptDecoder } from 'meshoptimizer';
import { Environment, OrbitControls, Html, useGLTF } from '@react-three/drei';

import { three3DHelpersUtil } from '../../utils/three-helpers';
import { useTheme } from '../../context/ThemeContext';
import type { ThreeDComponentProps } from '../../types';

interface ModelLoaderProps extends ThreeDComponentProps {
    url: string;
    dracoDecoderPath?: string;
    ktx2TranscoderPath?: string;
    maxLODDistance?: number;
    fallbackSrc?: string;
    onLoad?: () => void;
    onError?: (error: ErrorEvent) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = React.memo(({
    url,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    dracoDecoderPath = 'https://www.gstatic.com/draco/v1/decoders/',
    ktx2TranscoderPath = 'https://cdn.jsdelivr.net/npm/basis-universal@1.4.0/dist/basisu_transcoder.wasm',
    maxLODDistance = 50,
    fallbackSrc,
    onLoad,
    onError,
    ...props
}) => {
    ModelLoader.displayName = 'ModelLoader';
    const { scene, gl, camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<Error | null>(null);
    const [highResModel, setHighResModel] = useState<THREE.Group | null>(null);
    const [lowResModel, setLowResModel] = useState<THREE.Group | null>(null);
    const {createEnvironmentMap} = three3DHelpersUtil;

    const { isDarkMode, colors } = useTheme();

    const envMap = useMemo(() => {
        return createEnvironmentMap(
          isDarkMode ? colors.darkEnvMap : colors.lightEnvMap,
          gl
        );
    }, [isDarkMode, colors, gl.renderer]);

    useEffect(() => {
        let dracoLoader: DRACOLoader | null = null;
        let ktx2Loader: KTX2Loader | null = null;

        const loadModels = async () => {
            try {
                setLoading(true);
                setLoadError(null);

                dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath(dracoDecoderPath);

                ktx2Loader = new KTX2Loader();
                ktx2Loader.setTranscoderPath(ktx2TranscoderPath);
                ktx2Loader.detectSupport(gl.renderer);

                const gltfLoader = new GLTFLoader();
                gltfLoader.setDRACOLoader(dracoLoader);
                gltfLoader.setKTX2Loader(ktx2Loader);
                gltfLoader.setMeshoptDecoder(MeshoptDecoder);

                const gltf = await gltfLoader.loadAsync(url);
                const model = gltf.scene;

                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material.envMap = envMap;
                        child.material.envMapIntensity = 1;
                    }
                });
                setHighResModel(model);
                setLoading(false);
                if (onLoad) {
                    onLoad();
                }
            } catch (error: any) {
                console.error('Error loading model:', error);
                setLoadError(error);
                setLoading(false);
                if (onError) {
                    onError(error);
                }
            } finally {
                dracoLoader?.dispose();
                ktx2Loader?.dispose();
            }
        };

        loadModels();

        return () => {
            dracoLoader?.dispose();
            ktx2Loader?.dispose();
        };
    }, [url, dracoDecoderPath, ktx2TranscoderPath, gl, onLoad, onError]);

    useEffect(() => {
        if(highResModel){
        if(highResModel.material){
                three3DHelpersUtil.disposeMaterial(highResModel.material)
        }
        if(highResModel.geometry){
            highResModel.geometry.dispose()
        }
        setHighResModel(null)
        }
    }, [highResModel]);

    const renderModel = () => {
        if (loadError && fallbackSrc) {
            return <Html center><img src={fallbackSrc} alt="Fallback" /></Html>;
        }

        if (loadError) {
            return (
                <Html center>
                    <div style={{ color: 'red' }}>Error loading model: {loadError.message}</div>
                    <button onClick={() => {
                        setLoading(true)
                        setLoadError(null)
                    }}>Retry</button>
                </Html>
            );
        }

        if (loading) {
            return <Html center>Loading...</Html>;
        }
        if(highResModel === null) return <></>;
        return <primitive object={highResModel} position={[0,0,0]}/>;
    };

    return (
        <group ref={groupRef} position={position as [number, number, number]} rotation={rotation as [number, number, number]} scale={scale}>
            <Suspense fallback={<Html center>Loading...</Html>}>
            {renderModel()}
            </Suspense>
        </group>
    );
});

export default ModelLoader;