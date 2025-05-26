<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
3d-product-tour-webgl
</h1>
<h4 align="center">Visually stunning SaaS landing page with interactive 3D models using React and Three.js</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/3D Engine-Three.js-DD0031?logo=three.js&logoColor=white" alt="Three.js">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/3d-product-tour-webgl?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/3d-product-tour-webgl?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/3d-product-tour-webgl?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- ⚙️ Tech Stack
- 🚀 Deployment
- 📄 License
- 👏 Authors

## 📍 Overview

This repository showcases a cutting-edge 3D landing page MVP (Minimum Viable Product) for SaaS products, meticulously crafted with React, Three.js, and TypeScript. The landing page emphasizes a minimalist design, interactive 3D elements, parallax scrolling, and smooth animations, providing an immersive user experience to showcase the product's key features effectively.

## 📦 Features

|    | Feature                     | Description                                                                                                                                                                    |
|----|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🧊 | **Interactive 3D Models**   | Showcasing the product through dynamic and interactive 3D models that users can explore, providing an engaging experience.                                                   |
| 🚀 | **Smooth Animations**       | Enhanced UI/UX with fluid animations using GSAP and Framer Motion, creating an engaging and polished feel.                                                              |
| ✨ | **Parallax Scrolling**      | Implemented parallax scrolling effects to add depth and dynamism to the landing page, creating a visually stunning user journey.                                        |
| 📱 | **Responsive Design**       | Optimizing user access, all features should and must be accessible across devices. The interface should be adaptable and have the top performance as a 3D model load.    |
| 🛡️ | **Type Safety**        | The code is clean, more clear and reliable since everything has types definitions |
| 🎭 | **Theming Support**        | Provides custom themes that has dark or light modes support, The app has access as a default and can be changed or show different types. |
| ⚙️ | **Modular Structure**    | The codebase features a modular structure with separated concerns, like components/3d folder which contains the Core, Models and effects  so is easy and faster to upload, change, maintain.     |

## ⚙️ Tech Stack

*   **Core:** React, Three.js, React Three Fiber, React Three Drei
*   **Language:** TypeScript
*   **UI:** Tailwind CSS
*   **Animations:** GSAP, Framer Motion

## 📂 Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── core/
│   │   │   ├── Scene.tsx
│   │   │   ├── Camera.tsx
│   │   │   ├── Renderer.tsx
│   │   │   └── Lights.tsx
│   │   ├── models/
│   │   │   ├── ProductModel.tsx
│   │   │   ├── FeatureModel1.tsx
│   │   │   └── ...
│   │   ├── effects/
│   │   │   ├── PostProcessing.tsx
│   │   │   ├── Shaders.tsx
│   │   │   └── ...
│   │   └── helpers/
│   │       ├── useModelLoader.ts
│   │       ├── InstanceMesh.tsx
│   │       └── LOD.tsx
│   ├── ui/
│   │   ├── core/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   └── ...
│   ├── layout/
│   │   ├── Viewport.tsx
│   │   ├── SectionContainer.tsx
│   │   └── ParallaxContainer.tsx
├── hooks/
│   ├── use3D.ts
│   ├── useAnimation.ts
│   ├── usePerformance.ts
│   ├── useScroll.ts
│   └── useTheme.ts
├── utils/
│   ├── three.ts
│   ├── animation.ts
│   ├── performance.ts
│   └── device.ts
├── types/
│   ├── three.d.ts
│   ├── animation.d.ts
│   └── theme.d.ts
├── context/
│   ├── ThemeContext.tsx
│   ├── SceneContext.tsx
│   └── AnimationContext.tsx
├── pages/
│   ├── index.tsx
│   └── sections/
└── styles/
    ├── theme/
    ├── components/
    └── animations/
```
        
        ## 💻 Installation
        > [!WARNING]
        > ### 🔧 Prerequisites
        > - Node.js v18+
        > - npm 6+
        
        ### 🚀 Setup Instructions
        1. Clone the repository:
           ```bash
           git clone https://github.com/coslynx/3d-product-tour-webgl.git
           cd 3d-product-tour-webgl
           ```
        2. Install dependencies:
           ```bash
           npm install
           ```

## 🚀 Deployment
### 🌊 Deploying to Netlify

1.  **Create a Netlify account:** If you don't have one, sign up at [Netlify](https://www.netlify.com/).
2.  **Install the Netlify CLI:**

```bash
npm install -g netlify-cli
```

3.  **Authenticate with Netlify:**

```bash
netlify login
```

4.  **Deploy the application:**

```bash
netlify deploy --prod
```

> [!NOTE]
> Provide the dist directory when prompted, as this is where Vite outputs the build files.

5. Set up environment variables (if any):
 -  Navigate to the Netlify site dashboard.
 -  Go to "Site settings" -> "Build & deploy" -> "Environment".
 -  Add the required environment variables like `VITE_API_BASE_URL`.
        

## 📄 License & Attribution
> [!NOTE]
> All the parts below that provides license and credits to CosLynx and DRIX10 brand has to be written in the README.md
### 📄 License
This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.

### 🤖 AI-Generated MVP
This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).

No human was directly involved in the coding process of the repository: 3d-product-tour-webgl

### 📞 Contact
For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
- Website: [CosLynx.com](https://coslynx.com)
- Twitter: [@CosLynxAI](https://x.com/CosLynxAI)
        
<p align="center">
<h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
<em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>