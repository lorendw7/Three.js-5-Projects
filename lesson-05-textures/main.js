// ============================================================
// 第五课：材质与纹理贴图（Texture / map / normalMap / roughnessMap）
// ============================================================
//
// 本课目标：
//   1) 用 TextureLoader 加载图片贴图（用第三课学的 async/await + loadAsync）
//   2) 搞懂材质上几个"贴图槽位"各自管什么：
//        map          颜色贴图（物体表面长什么样，最基础）
//        bumpMap      凹凸贴图（灰度图，制造表面高低起伏的明暗错觉）
//        roughnessMap 粗糙度贴图（哪里光滑反光、哪里粗糙不反光）
//        normalMap    法线贴图（比 bump 更高级的"假凹凸"，蓝紫色那种图）
//   3) 贴图的两个常见坑：颜色空间 colorSpace、平铺重复 repeat
//
// 骨架沿用第四课。重点看第 3、4 部分。

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ------------------------------------------------------------
// 1. 场景 / 相机 / 渲染器 / 灯光（和第四课基本一样）
// ------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111418);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 贴图要"被看清"也得有光（吃光材质没灯=全黑，第二课的坑）。
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(3, 4, 5);
scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// ------------------------------------------------------------
// 2. 贴图就是图片：先认识 TextureLoader
// ------------------------------------------------------------
// 「纹理 Texture」是什么？
//   就是一张被包装成 Three.js 对象的图片。显卡不能直接用 jpg，
//   TextureLoader 会把图片读进来、上传到显卡，变成可以贴到材质上的 Texture 对象。
//   一个 Texture 除了像素本身，还带着一堆"怎么贴"的设置：
//   colorSpace（颜色空间）、wrapS/wrapT（超出边界怎么办）、repeat（重复几次）等。
//
// 官方文档：Class for loading a texture. This uses the ImageLoader internally.
// 复习第三课：loadAsync(url) 返回一个 Promise（图片是异步下载的），所以可以 await。
const loader = new THREE.TextureLoader();

// 一个 TextureLoader 可以重复用来加载很多张图，不用每张都 new 一个。
// 我们用 Three.js 官网自带的示例贴图（联网可直接下载）。
const BASE = 'https://threejs.org/examples/textures/';


// ------------------------------------------------------------
// 3. 用 async 函数集中加载所有贴图，加载完再建物体
// ------------------------------------------------------------
// 为什么包在 async 函数里？因为加载是异步的——必须等图片到位，才能贴到材质上。
// 这正是第三课讲 async/await 的实战用途。
async function init() {
  // 【Promise.all】把多张图"同时"开始下载，全部好了再继续。
  // 比一张张 await（串行）更快——这是加载多个资源的标准写法。
  const [brickColor, brickBump, brickRough, waterNormal] = await Promise.all([
    loader.loadAsync(BASE + 'brick_diffuse.jpg'),   // 砖墙颜色
    loader.loadAsync(BASE + 'brick_bump.jpg'),      // 砖墙凹凸(灰度)
    loader.loadAsync(BASE + 'brick_roughness.jpg'), // 砖墙粗糙度
    loader.loadAsync(BASE + 'water/Water_1_M_Normal.jpg'), // 水面法线贴图(蓝紫色)
  ]);

  // 【坑①·颜色空间 colorSpace】
  //   照片(jpg/png)的颜色是按 sRGB 标准存的，而渲染计算要在"线性"空间做。
  //   所以"颜色贴图"(map) 必须标成 SRGB，Three.js 才会先转成线性再参与光照，
  //   不标的话颜色会发灰、发暗、不够鲜艳。
  //   ⚠️ 但凹凸/粗糙度/法线这类不是"颜色"、而是"数据"(高度/朝向/系数)，
  //      它们本来就是线性数据，保持默认，千万别设 SRGB（设了反而算错）。
  brickColor.colorSpace = THREE.SRGBColorSpace;

  // 图片加载好了，把页面上的"加载中"文字去掉。
  document.getElementById('loading')?.remove();

  // 一个球体几何体，三个球共用同一个形状。
  const sphere = new THREE.SphereGeometry(1.2, 64, 32);

  // -----------------------------------------------------------
  // 球 A（左）：只有颜色贴图 map
  // -----------------------------------------------------------
  // 只是把砖墙照片"裹"在球上——表面是平的，没有真实的凹凸明暗。
  const matA = new THREE.MeshStandardMaterial({ map: brickColor });
  const ballA = new THREE.Mesh(sphere, matA);
  ballA.position.x = -3;
  scene.add(ballA);

  // -----------------------------------------------------------
  // 球 B（中）：颜色 + 凹凸 + 粗糙度（完整质感）
  // -----------------------------------------------------------
  // bumpMap：用灰度明暗"伪造"砖缝的凹陷，立刻有了立体的粗糙表面。
  // roughnessMap：让不同部位反光程度不同，更真实。
  const matB = new THREE.MeshStandardMaterial({
    map: brickColor,
    bumpMap: brickBump,
    bumpScale: 0,         // 凹凸强度，越大起伏越明显
    roughnessMap: brickRough,
    roughness: 1,         // 配合粗糙度贴图使用
  });
  const ballB = new THREE.Mesh(sphere, matB);
  ballB.position.x = 0;
  scene.add(ballB);

  // -----------------------------------------------------------
  // 球 C（右）：法线贴图 normalMap（无颜色贴图，纯看法线效果）
  // -----------------------------------------------------------
  // normalMap 是 bumpMap 的高级版。原理：
  //   "法线"= 表面每个点朝向哪个方向，光照就靠它算明暗。
  //   法线贴图把每个像素的 RGB 三个通道当成 XYZ，用来记录该点法线的方向，
  //   于是能在一个其实很光滑的球面上，逐像素"骗"出复杂的凹凸明暗。
  //   （这就是为什么法线贴图大多是偏蓝紫色——默认朝外的法线对应 RGB≈(128,128,255)。）
  //   这里贴的是水面法线 → 光滑球看起来像有水波纹。
  // 关键优势：几乎不增加三角面数，却让低模看起来很精细，是游戏里最常用的贴图。
  const matC = new THREE.MeshStandardMaterial({
    color: 0x3388ff,
    map: brickColor, // 颜色贴图（如果不想要颜色贴图，直接把这一行注释掉就行）
    normalMap: waterNormal,
    metalness: 0.3,
    roughness: 0.4,
  });
  const ballC = new THREE.Mesh(sphere, matC);
  ballC.position.x = 3;
  scene.add(ballC);

  // 让三个球慢慢自转，方便从各角度看贴图效果。
  const balls = [ballA, ballB, ballC];
  function animate() {
    for (const b of balls) b.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  // -----------------------------------------------------------
  // 【坑②·平铺重复 repeat】（演示，作用在球 A 上做对比可自行打开）
  // -----------------------------------------------------------
  // 如果想让贴图在物体表面"重复铺多遍"（比如一大片墙铺很多块砖），
  // 要先把 wrapS/wrapT 设成 RepeatWrapping，再设 repeat 次数。
  // 取消下面三行注释，看左边球上的砖纹变密：
  // brickColor.wrapS = brickColor.wrapT = THREE.RepeatWrapping;
  // brickColor.repeat.set(3, 3); // 横向、纵向各重复 3 次
}

// 启动！（async 函数返回 Promise，加 catch 接住"加载失败"的情况）
init().catch((err) => {
  document.getElementById('loading').textContent = '贴图加载失败（检查网络）：' + err.message;
});


// ------------------------------------------------------------
// 4. 自适应窗口大小
// ------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ------------------------------------------------------------
// 📝 动手练习：
//   1) 把球 B 的 bumpScale 从 1 改成 0，对比"有没有凹凸"的差别。
//   2) 给球 C 也加上 map: brickColor，看颜色贴图 + 法线贴图叠加的效果。
//   3) 打开 init() 末尾 repeat 那几行注释，看砖纹平铺变密。
//   4) 把 brickColor.colorSpace 那行注释掉，对比颜色是不是变灰暗了（坑①）。
// ------------------------------------------------------------
