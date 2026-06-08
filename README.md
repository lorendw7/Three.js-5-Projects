# Three.js 学习仓库

> 一个循序渐进学习 **Three.js** 的代码仓库。
> 每个知识点都拆成**最小可运行例子**，配**详细中文注释** + **官方文档英文要点**。

学习分两条线：
- **基础课（L1~L17）**：把每块技术拆成最小例子学透（见下方"课程大纲"）。
- **5 个实战项目**：配合 YouTube 教程动手做完整的小项目，把基础课学的东西串起来用（见下方"5 个实战项目"）。

每一课 / 每个项目都是一个独立文件夹，互不干扰。

---

## 🗺 技术总览

| 技术块 | 具体内容 | 对应课程 |
|--------|---------|---------|
| **JS 基础** | ES6+ 模块、Promise / async-await（加载资源是异步的）| L3 |
| **Three.js 核心** | Scene / PerspectiveCamera / WebGLRenderer | L1 ✅ |
| **灯光系统** | AmbientLight 打底 + DirectionalLight / PointLight 主光 | L2 ✅ / L6 |
| **几何体与材质** | 各种几何体、材质参数、纹理贴图、坐标辅助 | L4 / L5 |
| **氛围基础** | 雾 fog、渐变背景、场景环境 | L7 |
| **加载 GLB 模型** | GLTFLoader 加载 .glb，调位置/缩放/材质 | L8 |
| **加载进度条** | LoadingManager（大模型加载需要进度提示）| L9 |
| **模型压缩解码** | DRACOLoader / meshopt（给大模型减负）| L10 |
| **模型动画** | AnimationMixer 播放 GLB 自带动画 | L11 |
| **真实反光** | HDRI 环境贴图（RGBELoader），让金属/反光材质真实 | L12 |
| **泛光 Bloom** | EffectComposer 后期处理——灯光发光感的关键 | L13 |
| **景深 DoF** | EffectComposer 景深，突出主体、虚化背景 | L14 |
| **粒子系统** | Points 做漂浮光点 / 星空 | L15 |
| **缓动动画** | GSAP 做镜头运动和过渡 | L16 |
| **（可选）省力方案** | React Three Fiber + Drei 封装版 | L17 |

> 注：每块技术只学**最小可运行例子**。

---

## 📚 课程大纲（学习路径）

### 阶段一 · 打地基

- [x] **第一课 · 第一个场景** — `lesson-01-first-scene/`
  Scene / Camera / Renderer 三件套，渲染一个旋转立方体。

- [x] **第二课 · 灯光与鼠标控制** — `lesson-02-light-and-controls/`
  受光材质 MeshStandardMaterial、环境光+方向光、OrbitControls 鼠标拖动视角。

- [x] **第三课 · JS 复习（ES6+ 与异步）** — `lesson-03-js-essentials/`
  import/export 模块、const/let、箭头函数、解构、模板字符串；
  **重点：Promise 与 async/await**——因为后面加载资源全是异步操作。

### 阶段二 · 物体、材质与氛围

- [x] **第四课 · 几何体家族 + 坐标辅助** — `lesson-04-geometries/`
  Box / Sphere / Torus / Cylinder 等几何体；AxesHelper / GridHelper 辅助理解坐标系。

- [ ] **第五课 · 材质与纹理贴图** — `lesson-05-textures/`
  TextureLoader 加载图片贴图，map / normalMap / roughnessMap 等。

- [ ] **第六课 · 灯光进阶** — `lesson-06-lights-deep/`
  PointLight 点光源 + 衰减(decay/distance)、SpotLight；阴影 shadow 入门。

- [ ] **第七课 · 雾、背景与场景环境** — `lesson-07-atmosphere/`
  Scene.fog 雾效、渐变背景、scene.environment 基础。

### 阶段三 · 加载 GLB 模型

- [ ] **第八课 · 用 GLTFLoader 加载第一个模型** — `lesson-08-gltf-loader/`
  加载一个 .glb 模型，调位置/缩放/旋转/材质。

- [ ] **第九课 · 加载进度条 LoadingManager** — `lesson-09-loading-manager/`
  统一管理加载、显示百分比进度条（为加载大模型做准备）。

- [ ] **第十课 · 大模型压缩解码 DRACO / meshopt** — `lesson-10-draco/`
  解决大模型加载卡顿，配 DRACOLoader 解码。

- [ ] **第十一课 · 播放模型动画 AnimationMixer** — `lesson-11-animation-mixer/`
  播放 GLB 内置动画。

### 阶段四 · 氛围与质感

- [ ] **第十二课 · HDRI 环境贴图** — `lesson-12-hdri-environment/`
  RGBELoader 加载 .hdr，让金属/反光材质有真实环境反射。

- [ ] **第十三课 · 泛光 Bloom 后期处理** — `lesson-13-bloom/`
  EffectComposer + UnrealBloomPass，让灯光/亮部发光。

- [ ] **第十四课 · 景深 DoF** — `lesson-14-depth-of-field/`
  BokehPass 景深，虚化背景突出主体。

- [ ] **第十五课 · 粒子系统** — `lesson-15-particles/`
  Points + PointsMaterial 做漂浮光点 / 星空；
  附带小节：用 Canvas `getImageData()` 读照片像素，把照片变成粒子（聚散效果基础）。

- [ ] **第十六课 · GSAP 缓动动画** — `lesson-16-gsap/`
  用 GSAP 做镜头运动、过渡、交互动画。

### （可选）阶段五 · 省力方案

- [ ] **第十七课 · React Three Fiber + Drei** — `lesson-17-r3f/`
  用 React 封装版做个最小例子，体会 Drei 把 OrbitControls / 环境 / Bloom 都封装成组件后开发有多快。

---

## 🎬 5 个实战项目（配合 YouTube 教程）

跟着 [Bobby Roe](https://www.youtube.com/@RobotBobby9) 的教程动手做 5 个完整小项目，把基础课的知识串起来实践。
每个项目放在独立文件夹，建议**学完对应的基础课后再做**，效果最好。

- [ ] **项目一 · Textures 纹理实战** — `project-1-textures/`
  给 3D 模型应用各种纹理贴图。免费纹理素材：[Poly Haven](https://polyhaven.com/textures)。
  *关联基础课：L5 纹理 / L8 加载模型*

- [ ] **项目二 · 3D 地球仪 Globe** — `project-2-globe/`
  做一个漂浮在星空中、带国家轮廓的地球。
  代码参考：[bobbyroe/3d-globe-with-threejs](https://github.com/bobbyroe/3d-globe-with-threejs)
  *关联基础课：L4 几何体 / L5 纹理 / L15 粒子（星空）*

- [ ] **项目三 · 简易粒子特效** — `project-3-particles/`
  快速做出火焰 Fire、烟雾 Smoke、闪光 Sparkles 等效果。
  代码参考：[bobbyroe/Simple-Particle-Effects](https://github.com/bobbyroe/Simple-Particle-Effects)
  *关联基础课：L13 Bloom / L15 粒子系统*

- [ ] **项目四 · 滚动动画 Scroll Animation** — `project-4-scroll-animation/`
  随页面滚动触发的平滑动画。
  代码参考：[bobbyroe](https://github.com/bobbyroe/scroll-animation) 的 scroll-animation 仓库
  *关联基础课：L16 GSAP 缓动*

- [ ] **项目五 · 物理引擎 Physics** — `project-5-physics/`
  用 Three.js + Rapier 物理引擎做可交互的物理效果（碰撞、重力等）。
  代码参考：[bobbyroe](https://github.com/bobbyroe/physics-with-rapier-and-three) 的 physics 仓库
  *新技术：Rapier 物理引擎（基础课未涵盖，项目中现学）*

> 可以直接去 [Bobby Roe 的 GitHub](https://github.com/bobbyroe) 找对应仓库即可。

---

## 🛠 技术栈

- **Three.js** `^0.184` — 3D 渲染核心
- **Vite** `^8` — 开发服务器 + 打包工具
- 后续会用到：GSAP（动画）、Rapier（物理引擎，项目五）、(可选) React + React Three Fiber + Drei

---

## 🚀 如何运行

```bash
# 安装依赖（只需第一次）
npm install

# 启动开发服务器（改代码自动热刷新）
npm run dev
```

然后浏览器打开 **http://localhost:5173/** ，从课程目录首页点进每一课。
也可直接访问某一课，例如 http://localhost:5173/lesson-02-light-and-controls/

```bash
npm run build    # 打包成可部署的静态文件（输出到 dist/）
npm run preview  # 本地预览打包结果
```

---

## 📁 目录结构

```
Three.js-5-Projects/
├── node_modules/              # 依赖（git 忽略）
├── index.html                 # 课程目录首页
├── package.json
├── README.md                  # 本文件
├── lesson-01-first-scene/     # 基础课：每课一个独立文件夹
│   ├── index.html             #   页面入口（引入 main.js）
│   └── main.js                #   本课的 Three.js 代码（含详细注释）
├── lesson-02-light-and-controls/
├── ...
├── project-1-textures/        # 实战项目：每个项目一个独立文件夹
├── project-2-globe/
└── ...
```

---

## 📖 学习方法建议

1. 每课先**运行看效果**，再对照 `main.js` 的注释从上到下读一遍。
2. 做每课末尾的**动手练习**，改参数、存盘、看浏览器实时变化。
3. 遇到 API 不懂，查[官方文档](https://threejs.org/docs/)和[官方示例](https://threejs.org/examples/)。
4. 每学完一课就 `git commit` 一次，积累成果。
