import { ReactNode } from 'react'
import * as THREE from 'three'

export interface ThreeDComponentProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  children?: ReactNode
}

export interface ThreeSceneProps extends ThreeDComponentProps {
  modelPath?: string
  autoRotate?: boolean
  enableZoom?: boolean
  enablePan?: boolean
}

export interface ModelShowcasePageProps {
  modelPath?: string
  title?: string
  description?: string
}

export interface AboutPageProps {
  title?: string
  description?: string
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface GLTFResult extends THREE.Object3D {
  nodes: { [key: string]: THREE.Mesh }
  materials: { [key: string]: THREE.Material }
  animations: THREE.AnimationClip[]
  scene: THREE.Scene
  scenes: THREE.Scene[]
  cameras: THREE.Camera[]
  asset: {
    generator: string
    version: string
  }
}

export interface AnimationOptions {
  duration?: number
  ease?: string
  delay?: number
  repeat?: number
  yoyo?: boolean
}

export interface ScrollAnimationOptions {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
}
