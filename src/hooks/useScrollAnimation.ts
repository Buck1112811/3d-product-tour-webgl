import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { three3DHelpersUtil } from '@/utils/three-helpers';
import { useTheme } from '@/context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  start: number;
  end: number;
  duration: number;
  easing: string;
  targets: any;
  values: gsap.TweenVars;
  onUpdate?: () => void;
  onComplete?: () => void;
}

interface UseScrollAnimationReturn {
  scrollY: React.MutableRefObject<number>;
  registerScrollTrigger: (options: ScrollAnimationOptions) => void;
  destroyScrollTriggers: () => void;
  scrollProgress: number;
}

/**
 * Custom hook for creating scroll-triggered animations using GSAP in React Three Fiber.
 * @returns {UseScrollAnimationReturn} An object containing the scroll position and animation control functions.
 */
export const useScrollAnimation = (): UseScrollAnimationReturn => {
  const { scene } = useThree();
  const scrollY = useRef(0);
  const scrollTriggers = useRef<gsap.utils.FnAnimation[]>([])
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const registerScrollTrigger = useCallback((options: ScrollAnimationOptions) => {
    const { start, end, duration, easing, targets, values, onUpdate, onComplete } = options;

    const trigger = ScrollTrigger.create({
      scroller: window,
      trigger: scene?.children,
      start: `top+=${start * 100}% bottom`,
      end: `top+=${end * 100}% bottom`,
      scrub: duration,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollY.current = self.progress;
        setScrollProgress(self.progress)
        if (onUpdate) {
          onUpdate();
        }
      },
      onComplete: onComplete,
      animation: gsap.to(targets, values, { duration, ease: easing })
    })
      scrollTriggers.current.push(trigger);
    }, [scene]);

    const destroyScrollTriggers = useCallback(() => {
        scrollTriggers.current.forEach(trigger => {
            trigger.kill()
        })
    }, [])

  return {
    scrollY: scrollY,
    registerScrollTrigger,
    destroyScrollTriggers,
    scrollProgress: scrollProgress
  };
};