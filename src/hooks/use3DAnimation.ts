import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { three3DHelpersUtil } from '../utils/three-helpers';

interface AnimationOptions {
  targets: any;
  values: gsap.TweenVars;
  duration?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  onUpdate?: () => void;
}

interface TimelineOptions {
  paused?: boolean;
  onComplete?: () => void;
  onUpdate?: () => void;
}

interface Use3DAnimationHook {
  animate: (target: any, values: gsap.TweenVars, duration?: number, ease?: string) => gsap.core.Tween;
  createTimeline: (options?: TimelineOptions) => gsap.core.Timeline;
  stop: (target: any) => void;
  pause: (target: any) => void;
  resume: (target: any) => void;
  reverse: (target: any) => void;
  seek: (target: any, time: number) => void;
  restart: (target: any) => void;
}

/**
 * Custom hook for managing 3D animations using GSAP in React Three Fiber.
 *
 * This hook provides a set of functions for creating, controlling, and sequencing animations of Three.js objects within a React Three Fiber scene. It simplifies the integration of GSAP timelines and tweens into R3F components, providing hooks for handling updates and completions.
 * @returns {Use3DAnimationHook} An object containing animation control functions and a timeline creation function.
 */
export const use3DAnimation = (): Use3DAnimationHook => {
  const { scene } = useThree();
  const animations = useRef<gsap.core.Animation[]>([]);

  const animate = useCallback((target: any, values: gsap.TweenVars, duration: number = 1, ease: string = 'power3.inOut'): gsap.core.Tween => {
    if (!target) {
      throw new Error('Animation target cannot be null or undefined.');
    }

    if (!values || typeof values !== 'object') {
      throw new Error('Animation values must be a valid object.');
    }
    try {
      const animation = gsap.to(target, {
        ...values,
        duration: duration,
        ease: ease,
        onComplete: () => {
          // Clean up the animation from the array once it completes, if necessary
          animations.current = animations.current.filter((anim) => anim !== animation);
        },
      });
      animations.current.push(animation);
      return animation;
    } catch (err) {
      console.error('GSAP animation error', err);
      throw err;
    }
  }, []);

  const createTimeline = useCallback((options: TimelineOptions = {}): gsap.core.Timeline => {
    const timeline = gsap.timeline({
      paused: options.paused || false,
      onComplete: options.onComplete,
      onUpdate: options.onUpdate
    });
    return timeline;
  }, []);

  const stop = useCallback((target: any) => {
    if (!target) return;
    gsap.killTweensOf(target);
  }, []);

  const pause = useCallback((target: any) => {
    if (!target) return;
    gsap.pauseTweensOf(target);
  }, []);

  const resume = useCallback((target: any) => {
    if (!target) return;
    gsap.resumeTweensOf(target);
  }, []);

  const reverse = useCallback((target: any) => {
    if (!target) return;
    gsap.reverseTweensOf(target);
  }, []);

  const seek = useCallback((target: any, time: number) => {
    if (!target) return;
    gsap.getTweensOf(target).forEach(tween => tween.seek(time));
  }, []);

  const restart = useCallback((target: any) => {
    if (!target) return;
    gsap.getTweensOf(target).forEach(tween => tween.restart());
  }, []);

  useEffect(() => {
    return () => {
      animations.current.forEach((animation) => {
        animation.kill();
      });
      animations.current = [];
    };
  }, []);

  return {
    animate,
    createTimeline,
    stop,
    pause,
    resume,
    reverse,
    seek,
    restart
  };
};