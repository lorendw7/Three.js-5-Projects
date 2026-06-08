// ============================================================
// 第三课：JS 复习（ES6+ 语法 + 异步 Promise / async-await）
// ============================================================
//
// 为什么要单独学这一课？
// 因为从第八课开始，"加载贴图、加载 .glb 模型、加载 HDR" 全都是【异步操作】：
// 你发出"去加载"的命令后，文件不会瞬间到位（可能要等几百毫秒甚至几秒），
// 代码必须"等它好了再用它"。这就是 Promise / async-await 要解决的问题。
//
// 本课没有 3D 画面，所有结果用下面这个 print() 同时打印到【网页黑框】和【控制台】。

import * as THREE from 'three';

// 小工具：把内容打印到页面 #log 和浏览器控制台（方便你对照执行顺序）
const logEl = document.getElementById('log');
function print(msg) {
  console.log(msg);
  logEl.textContent += msg + '\n';
}


// ============================================================
// 第一部分：ES6+ 常用语法（后面每课都在用，先扫一遍）
// ============================================================
print('===== 第一部分：ES6+ 语法 =====');

// ------------------------------------------------------------
// 1. const / let —— 不再用 var
// ------------------------------------------------------------
//   const：常量，声明后不能再重新赋值（指向不变）。默认优先用它。
//   let  ：变量，值会变的才用（比如循环计数、累加）。
const PI = 3.14;       // PI = 4 会直接报错
let count = 0;         // count 之后可以改
count = count + 1;
print(`const PI = ${PI}, let count = ${count}`);

// ------------------------------------------------------------
// 2. 模板字符串（反引号 ` `）—— 上面那行就在用
// ------------------------------------------------------------
// 用 `${变量}` 直接把变量塞进字符串，不用再写 'a' + b + 'c' 的加号拼接。
const name = '立方体';
print(`这是一个 ${name}，它有 ${6} 个面。`);

// ------------------------------------------------------------
// 3. 箭头函数 () => {}
// ------------------------------------------------------------
// 写法更短的函数。这两种写法效果一样：
function addOld(a, b) { return a + b; }      // 传统写法
const addNew = (a, b) => a + b;              // 箭头写法（单行可省略 return 和 {}）
print(`箭头函数 addNew(2,3) = ${addNew(2, 3)}`);
// 你在第一二课的 resize 监听里写的 () => {...} 就是箭头函数。

// ------------------------------------------------------------
// 4. 解构赋值（destructuring）—— 从对象/数组里"拆"出值
// ------------------------------------------------------------
// import { OrbitControls } from '...' 里的 { } 就是对象解构。
const point = { x: 1, y: 2, z: 3 };
const { x, z } = point;            // 一次性取出 x 和 z
print(`解构对象：x=${x}, z=${z}`);

const colors = ['red', 'green', 'blue'];
const [first, , third] = colors;   // 数组解构（中间留空跳过 green）
print(`解构数组：first=${first}, third=${third}`);

// ------------------------------------------------------------
// 5. import / export —— 模块化
// ------------------------------------------------------------
// 文件顶部的 import * as THREE from 'three' 就是模块导入。
// 把代码拆成多个文件，各管各的，用 export 暴露、import 取用。
// （Three.js 的 addons 也是这样一个个按需 import 进来的。）
print('import/export：本文件顶部已经在用了 ✔');


// ============================================================
// 第二部分：异步基础 —— 为什么需要它？
// ============================================================
print('\n===== 第二部分：同步 vs 异步 =====');

// 同步代码：一行一行从上往下执行，上面没跑完，下面绝不会跑。
print('A：同步第一行');
print('B：同步第二行');

// 但"加载一个文件"需要时间。如果它是同步的，整个网页会【卡死】直到文件到位。
// 所以加载类操作都是【异步】的：先"挂个单"，浏览器在后台去办，
// 不阻塞后面的代码；办好了再回头通知你。
// setTimeout 模拟一个"要等 1 秒才完成"的异步任务：
setTimeout(() => {
  print('D：异步任务完成（等了 1 秒后才打印）');
}, 1000);

print('C：同步第三行（注意它比 D 先打印！）');
// 👆 执行顺序会是 A → B → C → (1秒后) → D
//    这就是异步：C 不用等 D，先继续往下跑。


// ============================================================
// 第三部分：Promise —— 异步任务的"凭证"
// ============================================================
//
// MDN: "A Promise is an object representing the eventual completion
//       (or failure) of an asynchronous operation."
// 翻译：Promise 是一个"代表某个异步操作最终会成功或失败"的对象——
//       就像一张【取餐小票】：下单后先给你票，餐做好了凭票取餐。
//
// Promise 有三种状态：
//   pending  （进行中，还没好）
//   fulfilled（成功）→ 触发 .then(结果 => ...)
//   rejected （失败）→ 触发 .catch(错误 => ...)

print('\n===== 第三部分：Promise =====');

// 造一个 Promise：模拟"加载一张贴图"，0.5 秒后成功返回。
function fakeLoadTexture(url) {
  return new Promise((resolve, reject) => {
    print(`  开始加载：${url} ...`);
    setTimeout(() => {
      const ok = true;                 // 改成 false 可体验失败分支
      if (ok) resolve(`[${url} 的图片数据]`); // 成功：交出结果
      else reject(new Error('图片不存在'));    // 失败：抛出错误
    }, 500);
  });
}

// 用 .then() 拿成功结果，用 .catch() 接住失败：
fakeLoadTexture('砖墙.jpg')
  .then((data) => print(`  ✔ Promise 成功拿到：${data}`))
  .catch((err) => print(`  ✗ Promise 失败：${err.message}`));


// ============================================================
// 第四部分：async / await —— 让异步代码"看起来像同步"
// ============================================================
//
// MDN: "The await keyword ... pauses execution until the promise settles."
// .then() 链写多了会嵌套很深、不好读。
// async/await 是它的"语法糖"：用 await 等一个 Promise 的结果，
// 写起来就像普通的一行行同步代码，但实际上不会卡住浏览器。
//
// 规则：
//   1) await 只能用在 async 函数里。
//   2) await 一个 Promise → 暂停这个函数，等它好了把结果给你。
//   3) 用 try / catch 接住可能的失败（替代 .catch）。

print('\n===== 第四部分：async / await =====');

async function loadAll() {
  try {
    // await：等贴图加载好，把结果赋给 data，再往下走。
    const data1 = await fakeLoadTexture('地面.jpg');
    print(`  ✔ await 拿到：${data1}`);

    const data2 = await fakeLoadTexture('天空.jpg'); // 上一个好了才加载这个（顺序加载）
    print(`  ✔ await 拿到：${data2}`);

    print('  两张贴图都加载完了，现在可以安全地用它们建场景 🎉');
  } catch (err) {
    print(`  ✗ 加载出错：${err.message}`);
  }
}
loadAll();


// ============================================================
// 第五部分：联系 Three.js —— 真实的加载就是这样
// ============================================================
//
// 重点：Three.js 的加载器都自带 Promise 版方法，名字叫 xxxAsync()。
// 比如 TextureLoader.loadAsync(url) 直接返回一个 Promise，
// 所以你可以直接 await 它！这正是第五课、第八课要用的写法。

print('\n===== 第五部分：联系 Three.js（真实加载）=====');

async function realThreeLoad() {
  const loader = new THREE.TextureLoader();
  try {
    // 这是一张 Three.js 官方自带的示例贴图（随库附带，能直接加载到）。
    const texture = await loader.loadAsync(
      'https://threejs.org/examples/textures/uv_grid_opengl.jpg'
    );
    print(`  ✔ 真·贴图加载成功！尺寸：${texture.image.width} × ${texture.image.height}`);
    print('  → 第五课就会把这种 texture 贴到材质的 map 上。');
  } catch (err) {
    print(`  ✗ 真·贴图加载失败（可能没网）：${err.message}`);
  }
}
realThreeLoad();


// ------------------------------------------------------------
// 本课没有 setAnimationLoop / 渲染，因为重点是 JS 语法本身。
// 看完控制台输出顺序，你就理解"异步"了——这就是后面加载资源的基础。
// ------------------------------------------------------------
