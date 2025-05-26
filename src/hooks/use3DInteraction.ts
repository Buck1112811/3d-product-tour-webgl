import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { three3DHelpersUtil } from '../utils/three-helpers';

interface Use3DInteractionProps {
  onHover?: (object: THREE.Object3D | null) => void;
  onClick?: (object: THREE.Object3D | null) => void;
  onDrag?: (object: THREE.Object3D | null, position: THREE.Vector3) => void;
}

interface Use3DInteractionResult {
  hovered: THREE.Object3D | null;
  clicked: THREE.Object3D | null;
  isDragging: boolean;
}

/**
 * Custom hook for managing 3D object interactions.
 * @param props - Callbacks for hover, click, and drag events.
 * @returns An object containing the interaction states.
 */
const use3DInteraction = (props: Use3DInteractionProps): Use3DInteractionResult => {
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [hovered, setHovered] = useState<THREE.Object3D | null>(null);
  const [clicked, setClicked] = useState<THREE.Object3D | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, scene, gl } = useThree();
  const domElement = gl.domElement;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    three3DHelpersUtil.performRaycast(mouse.current, camera, scene)
      .then((intersections: THREE.Intersection[]) => {
        if (intersections.length > 0 && intersections[0].object !== hovered) {
          const object = intersections[0].object;
          setHovered(object);
          if (props.onHover) {
            props.onHover(object);
          }
        } else if (intersections.length === 0 && hovered) {
          setHovered(null);
          if (props.onHover) {
            props.onHover(null);
          }
        }
      })
      .catch(error => {
        console.error("Error during raycasting:", error);
      });
  }, [camera, scene, hovered, props, domElement]);

  const handleClick = useCallback((event: MouseEvent) => {
    three3DHelpersUtil.performRaycast(mouse.current, camera, scene)
      .then((intersections: THREE.Intersection[]) => {
        if (intersections.length > 0) {
          const object = intersections[0].object;
          setClicked(object);
          if (props.onClick) {
            props.onClick(object);
          }
        } else {
          setClicked(null);
          if (props.onClick) {
            props.onClick(null);
          }
        }
      })
      .catch(error => {
        console.error("Error during raycasting:", error);
      });
  }, [camera, scene, props, mouse]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        setTouchStartX(touch.clientX);
        setTouchStartY(touch.clientY);
      setIsDragging(true);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStartX(null);
    setTouchStartY(null);
  }, []);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent) => {
    if (isDragging && hovered) {
      event.preventDefault();
      event.stopPropagation();
            let clientX: number, clientY: number;

            if (event instanceof MouseEvent) {
                clientX = event.clientX;
                clientY = event.clientY;
            } else if (event instanceof TouchEvent && event.touches.length > 0) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else {
                return;
            }
      const rect = domElement.getBoundingClientRect();
      mouse.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      three3DHelpersUtil.performRaycast(mouse.current, camera, scene)
        .then((intersections: THREE.Intersection[]) => {
          if (intersections.length > 0 && props.onDrag) {
            props.onDrag(hovered, intersections[0].point);
          }
        })
        .catch(e => console.error("Error performing raycast during drag:", e));
    }
  }, [isDragging, hovered, camera, scene, props, domElement]);

  useEffect(() => {
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    domElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    domElement.addEventListener('touchmove', handleDrag, { passive: false });
    domElement.addEventListener('mousemove', handleDrag);

    return () => {
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchend', handleTouchEnd);
      domElement.removeEventListener('touchmove', handleDrag);
      domElement.removeEventListener('mousemove', handleDrag);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd, handleDrag, domElement]);

  return {
    hovered,
    clicked,
    isDragging,
  };
};

export default use3DInteraction;