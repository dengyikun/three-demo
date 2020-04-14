import {
    CylinderGeometry,
    ImageUtils,
    FrontSide,
    BackSide,
    Mesh,
    MeshPhongMaterial,
    MeshFaceMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer
} from './vendor/three.module.js';

// 银幕
const scene = new Scene();

// 相机
const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 30;

// 渲染器
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光
const lights = [];
lights[0] = new PointLight(0xffffff, 1, 0);
lights[1] = new PointLight(0xffffff, 1, 0);
lights[2] = new PointLight(0xffffff, 1, 0);
lights[3] = new PointLight(0xffffff, 1, 0);

// 灯光位置
lights[0].position.set(200, 0, 0);
lights[1].position.set(0, 0, -200);
lights[2].position.set(-200, 0, 0);
lights[3].position.set(0, 0, 200);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);
scene.add(lights[3]);

// 圆柱体参数
const data = {
    radiusTop: 5, // 顶部半径
    radiusBottom: 5, // 底部半径
    height: 6, // 高度
    radialSegments: 36, // 侧面分段数
    heightSegments: 1, // 高度分段数
    openEnded: true, // 顶部、底部是否开放
    thetaStart: 0, // 第一个分段的起始角度
    thetaLength: Math.PI * 2 // 侧面包围的角度
};

// 构造圆柱体
const geometry = new CylinderGeometry(
    data.radiusTop,
    data.radiusBottom,
    data.height,
    data.radialSegments,
    data.heightSegments,
    data.openEnded,
    data.thetaStart,
    data.thetaLength
);

// 圆柱体正面贴图
const materialFront = new MeshPhongMaterial({
    map: ImageUtils.loadTexture('./img/front.png'),
    side: FrontSide,
    transparent: true,
});

// 圆柱体背面贴图
const materialBack = new MeshPhongMaterial({
    map: ImageUtils.loadTexture('./img/back.png'),
    side: BackSide,
    transparent: true,
});

const meshFaceMaterial = new MeshFaceMaterial([materialFront, materialBack]);

// 复制一份圆柱体表面，用以承载背面贴图
for (let i = 0, len = geometry.faces.length; i < len; i++) {
    const face = geometry.faces[i].clone();
    face.materialIndex = 1;
    geometry.faces.push(face);
    geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
}

// 合成圆柱体
const cylinder = new Mesh(geometry, meshFaceMaterial);

scene.add(cylinder);

// 延 Y 轴的旋转角度
let rotateY = 0

// 渲染
const render = function () {

    requestAnimationFrame(render);

    // 偏移圆柱体位置
    cylinder.position.set(-2.6, -9 + window.scrollY * 0.02, 0);
    // 旋转圆柱体
    cylinder.rotation.set(0, rotateY, 0);

    renderer.render(scene, camera);

};

render();

// 滑动事件处理
let startX = null;

function onMoveStart() {
    startX = null;
}

function onMove(event) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    if (startX !== null) {
        rotateY += (clientX - startX) * 0.004;
    }
    startX = clientX;
}

function onMoveEnd() {
    startX = null;
}

document.addEventListener('mousedown', onMoveStart, false);
document.addEventListener('mousemove', onMove, false);
document.addEventListener('mouseup', onMoveEnd, false);

document.addEventListener('touchstart', onMoveStart, false);
document.addEventListener('touchmove', onMove, false);
document.addEventListener('touchend', onMoveEnd, false);

// 页面缩放事件处理
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);