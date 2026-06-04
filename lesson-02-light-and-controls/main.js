// ============================================================
// 第二课：灯光 + 鼠标拖动视角(OrbitControls)
// ============================================================
//
// 本课在第一课基础上做两件事：
//   1) 把"不吃光"的材质换成"吃光"的材质，并加灯光 → 立方体有立体明暗
//   2) 加 OrbitControls → 用鼠标拖动、滚轮缩放来观察物体

import * as THREE from 'three';
// OrbitControls 不在核心库里，属于"附加组件(addons)"，要单独引入。
// 路径 'three/addons/...' 由 Vite 自动解析到 node_modules。
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ------------------------------------------------------------
// 1. 场景 / 相机 / 渲染器（和第一课一样）
// ------------------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// ------------------------------------------------------------
// 2. 物体：换成"会受灯光影响"的材质
// ------------------------------------------------------------
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 【本课重点①】MeshStandardMaterial 是基于物理的(PBR)材质，
// 它会对灯光做出反应：迎光面亮、背光面暗，从而产生立体感。
// 注意：如果场景里没有任何灯光，用这种材质的物体会是纯黑色！
//   - color     表面颜色
//   - roughness 粗糙度(0=镜面光滑, 1=完全粗糙)
//   - metalness 金属度(0=非金属, 1=金属)
const material = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  roughness: 0.1,
  metalness: 0.9,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


// ------------------------------------------------------------
// 3. 灯光 Light
// ------------------------------------------------------------
// 真实世界里物体能被看见是因为有光。Three.js 也一样。
// 常见做法是"环境光 + 方向光"组合：

// 【本课重点②a】环境光 AmbientLight：
// 均匀照亮场景里所有物体的所有面，没有方向、不产生阴影。
// 作用是给暗部一个"底色亮度"，避免背光面死黑。
//   参数：(颜色, 强度)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight); // 灯光也是对象，同样要 add 到场景

// 【本课重点②b】方向光 DirectionalLight：
// 模拟太阳——平行光，有明确方向，能造出明暗对比(立体感)。
//   参数：(颜色, 强度)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
// 设置光源位置，光线方向 = 从这个位置射向原点(0,0,0)。
// 放在右上前方，立方体就会右上亮、左下暗。
directionalLight.position.set(-3, 4, 5);
scene.add(directionalLight);


// ------------------------------------------------------------
// 4. 轨道控制器 OrbitControls
// ------------------------------------------------------------
// 【本课重点③】让用户用鼠标围绕目标点转动相机：
//   - 左键拖动 = 旋转视角
//   - 滚轮     = 缩放远近
//   - 右键拖动 = 平移
// 创建时传入"相机"和"监听鼠标事件的 DOM 元素"(渲染画布)。
const controls = new OrbitControls(camera, renderer.domElement);

// 开启阻尼(惯性)：拖动后会有顺滑的减速效果，手感更好。
// 注意：开了阻尼后，必须在动画循环里每帧调用 controls.update()。
controls.enableDamping = true;

// 设置缩放距离范围：用户可以缩放到多近、多远。
controls.minDistance = 3;
controls.maxDistance = 10;

// ------------------------------------------------------------
// 5. 动画循环
// ------------------------------------------------------------
function animate() {
  // 这一课我们让立方体自己也慢慢转(可选)，方便看清各个面的明暗。
  cube.rotation.y += 0.005;

  // 因为开了 enableDamping，每帧都要 update，阻尼效果才会生效。
  controls.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


// ------------------------------------------------------------
// 6. 自适应窗口大小
// ------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
