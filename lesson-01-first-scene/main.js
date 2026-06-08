// ============================================================
// 第一课：第一个 Three.js 场景（一个旋转的立方体）
// ============================================================
//
// 【本课地位】这是整个课程的地基。任何 Three.js 程序都离不开这 5 块：
//   1) Scene 场景   2) Camera 相机   3) Renderer 渲染器
//   4) Mesh 物体(几何体+材质)   5) 动画循环
// 记住这个骨架，后面每一课都只是往这个骨架里加东西。
//
// 引入整个 Three.js 库，并起名叫 THREE。
// 之后所有 Three.js 的类都通过 THREE.xxx 来用，比如 THREE.Scene。
// 这里只写包名 'three'，由 Vite 自动从 node_modules 里找到它。
import * as THREE from 'three';


// ------------------------------------------------------------
// 1. 场景 Scene
// ------------------------------------------------------------
// Scene（场景）是一个"容器/舞台"，你要显示的一切——
// 物体、灯光、相机——都要放进这个场景里。
// 官方文档：A scene allows you to set up what and where is to be rendered.
const scene = new THREE.Scene();


// ------------------------------------------------------------
// 2. 相机 Camera（透视相机）
// ------------------------------------------------------------
// 相机决定我们"从哪里、以什么方式"观察场景。
// PerspectiveCamera 是透视相机，模拟人眼：近大远小，最真实常用。
//
// 4 个参数：
//   fov    = 75   视野角度(field of view)，单位度。越大看到范围越广（像广角镜头）。
//   aspect = 宽/高 画面宽高比。用窗口的宽÷高，防止画面被拉伸变形。
//   near   = 0.1  近裁剪面：比这更近的东西不显示。
//   far    = 1000 远裁剪面：比这更远的东西不显示（节省性能）。
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 相机默认在原点(0,0,0)，立方体也在原点，会"贴脸"看不见。
// 把相机沿 z 轴往后(屏幕外方向)挪 5 个单位，退后才能看清立方体。
camera.position.z = 5;


// ------------------------------------------------------------
// 3. 渲染器 Renderer
// ------------------------------------------------------------
// 渲染器负责把"相机看到的场景"真正画(render)到屏幕上。
// WebGLRenderer 使用显卡(WebGL)绘制，是最常用的渲染器。
//   （WebGL 是浏览器里调用 GPU 画 3D 的标准技术，Three.js 帮我们把它的复杂细节封装好了。）
//   antialias: true 开启抗锯齿，让物体边缘更平滑（否则斜边会有锯齿状台阶）。
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 设置渲染尺寸 = 整个浏览器窗口大小。
renderer.setSize(window.innerWidth, window.innerHeight);

// 渲染器内部会创建一个 <canvas> 元素(renderer.domElement)，
// 这一步把它插入到网页 body 里，画面才会出现在页面上。
document.body.appendChild(renderer.domElement);


// ------------------------------------------------------------
// 4. 物体 Mesh = 几何体 Geometry + 材质 Material
// ------------------------------------------------------------
// 在 Three.js 里，一个可见物体(Mesh)由两部分组成：
//   - Geometry 几何体：物体的"形状/骨架"（顶点、面）
//   - Material 材质：物体表面的"外观"（颜色、反光等）

// 几何体：一个长宽高都是 1 的立方体(盒子)。
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 材质：MeshBasicMaterial 是最简单的材质，不受灯光影响，
// 给什么颜色就显示什么颜色。这里 0x00ff88 是十六进制颜色(青绿色)。
// （下一课我们会换成需要灯光的材质，体现立体明暗。）
const material = new THREE.MeshBasicMaterial({ color: 0xff3366 });

// 把几何体和材质组合成一个网格物体 Mesh。
const cube = new THREE.Mesh(geometry, material);

// 关键：物体必须 add 到场景里，才会被渲染出来。
scene.add(cube);


// ------------------------------------------------------------
// 5. 动画循环 Animation Loop
// ------------------------------------------------------------
// 一帧静止画面是不够的，我们要让立方体持续旋转，所以需要"每帧重画"。
// animate 函数里：先改一点旋转角度，再渲染一次。
function animate() {
  // rotation 以弧度(radian)为单位，不是角度！(360° = 2π ≈ 6.28 弧度，所以 0.01 弧度约等于 0.57°)
  // 每帧 +0.01，一秒约 60 帧，立方体就缓慢转动。
  cube.rotation.x += 0.03; // 绕 x 轴（水平轴）旋转
  cube.rotation.y += 0.01; // 绕 y 轴（竖直轴）旋转

  // 用相机把当前场景渲染到屏幕。
  renderer.render(scene, camera);
}

// setAnimationLoop 是官方推荐的循环方式：
// 浏览器会在每次刷新前(通常每秒约60次)自动调用 animate。
// 比手写 requestAnimationFrame 更省心，也兼容 VR/AR。
renderer.setAnimationLoop(animate);


// ------------------------------------------------------------
// 6. 自适应窗口大小（可选，但几乎每个项目都会写）
// ------------------------------------------------------------
// 当用户改变浏览器窗口大小时，更新相机和渲染器，避免画面变形。
window.addEventListener('resize', () => {
  // 更新相机的宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 改了相机参数后必须调用这个，让改动生效。
  camera.updateProjectionMatrix();
  // 让渲染画布也跟着变成新的窗口大小。
  renderer.setSize(window.innerWidth, window.innerHeight);
});
