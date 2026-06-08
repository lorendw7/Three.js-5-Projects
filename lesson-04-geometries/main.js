// ============================================================
// 第四课：几何体家族 + 坐标辅助（AxesHelper / GridHelper）
// ============================================================
//
// 本课目标：
//   1) 认识常用几何体：Box / Sphere / Torus / Cylinder / Cone / Plane
//   2) 学会用 AxesHelper（坐标轴）和 GridHelper（地面网格）看懂三维坐标系
//   3) 用 mesh.position.set(x, y, z) 把多个物体摆在不同位置
//
// 骨架（场景/相机/渲染器/灯光/OrbitControls）和第二课一样，重点看第 4、5 部分。

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ------------------------------------------------------------
// 1. 场景 / 相机 / 渲染器
// ------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111418); // 深灰背景，物体更清楚

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 把相机放在斜上方往下看，这样能同时看清网格地面和一排物体。
camera.position.set(6, 5, 9);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// ------------------------------------------------------------
// 2. 灯光（用了吃光材质，必须有灯，否则全黑——第二课的坑）
// ------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.5)); // 环境光，亮度 0.5，物体不会全黑了，但看不清立体感
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 8, 6);
scene.add(dirLight);


// ------------------------------------------------------------
// 3. 坐标辅助 Helper（本课重点①）
// ------------------------------------------------------------
// 【AxesHelper 坐标轴】画出从原点出发的三条彩色线，帮你认方向：
//   红色 = X 轴（左右）  绿色 = Y 轴（上下）  蓝色 = Z 轴（前后）
//   口诀：RGB ↔ XYZ（红绿蓝 对 XYZ）
// 参数是轴的长度。
const axes = new THREE.AxesHelper(5);
scene.add(axes);

// 【GridHelper 网格地面】画一张参考网格，像方格地板，方便判断位置和大小。
//   参数：(总尺寸, 分几格)
const grid = new THREE.GridHelper(20, 20);
scene.add(grid);


// ------------------------------------------------------------
// 4. 几何体家族（本课重点②）
// ------------------------------------------------------------
// 复习：物体 Mesh = 几何体 Geometry（形状） + 材质 Material（外观）。
// 这一课我们造 6 种常见几何体，用同一种材质，摆成一排对比。
//
// 注意各几何体的【构造参数】不同，下面注释里写了最常用的几个。

// 统一用一个稍微反光的标准材质（方便看出立体感）。
// flatShading: true 让球/圆柱显示成"多边形切面"，能看清几何体是由三角面拼的。
function makeMaterial(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 });
}

// 用一个数组集中管理：每项 = [几何体, 颜色, 放在 x 的位置]
const items = [
  // BoxGeometry(宽, 高, 深)：立方体/长方体
  [new THREE.BoxGeometry(1.4, 1.4, 1.4), 0xff5566, -6],

  // SphereGeometry(半径, 水平分段, 垂直分段)：球。分段越多越圆滑。
  [new THREE.SphereGeometry(1, 6, 4), 0x44ddff, -3.6],

  // TorusGeometry(主半径, 管半径, 径向分段, 管分段)：甜甜圈/圆环
  [new THREE.TorusGeometry(0.9, 0.35, 16, 48), 0xffcc33, -1.2],

  // CylinderGeometry(顶半径, 底半径, 高, 圆周分段)：圆柱。顶底半径不同→圆台
  [new THREE.CylinderGeometry(0, 0.8, 1.8, 32), 0x88ff88, 1.2],

  // ConeGeometry(底半径, 高, 圆周分段)：圆锥（其实是顶半径=0 的圆柱）
  [new THREE.ConeGeometry(0.9, 1.8, 32), 0xcc88ff, 3.6],

  // PlaneGeometry(宽, 高)：一张平面薄片（默认竖着面向 +Z）
  [new THREE.PlaneGeometry(1.8, 1.8), 0xdddddd, 6],
];

// 把每个几何体做成 Mesh，摆到对应位置，加进场景。
const meshes = [];
for (const [geometry, color, x] of items) {
  const mesh = new THREE.Mesh(geometry, makeMaterial(color));

  // position.set(x, y, z)：把物体放到指定坐标。
  // y = 1 让它们抬到网格地面上方一点，不要陷进地里。
  mesh.position.set(x, 1, 0);

  // 平面默认是单面渲染（背面看不见），转一下让它正对我们更好看（可选）。
  if (geometry.type === 'PlaneGeometry') {
    mesh.material.side = THREE.DoubleSide; // 双面都渲染，转到背面也可见
  }

  scene.add(mesh);
  meshes.push(mesh);
}

meshes[0].position.set(meshes[0].position.x, 3, meshes[0].position.z); // 把第一个物体升高到 y=3，看看坐标轴和网格地面的参考作用。

// ------------------------------------------------------------
// 5. 控制器 + 动画循环
// ------------------------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0); // 让相机围绕"物体所在高度"转，而不是地面原点

function animate() {
  // 让每个几何体都缓慢自转，方便从各角度观察形状。
  for (const mesh of meshes) {
    mesh.rotation.y += 0.01;
    mesh.rotation.x += 0.004;
  }
  controls.update(); // 开了 enableDamping，每帧必须 update（第二课的规律）
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


// ------------------------------------------------------------
// 6. 自适应窗口大小
// ------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 改了相机参数必须 update（第二课的坑）
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ------------------------------------------------------------
// 📝 动手练习（改完存盘，浏览器会自动热刷新）：
//   1) 把 SphereGeometry 的分段从 (32,16) 改成 (6,4)，看球变成什么样。
//   2) 把某个 mesh 的 position 改成 (x, 3, 0)，看它升高，对照绿色 Y 轴。
//   3) 把 CylinderGeometry 顶半径改成 0，看它变成圆锥（验证"圆锥=顶半径0的圆柱"）。
//   4) 删掉灯光那两行，看物体是不是又变全黑了（复习第二课的坑）。
// ------------------------------------------------------------
