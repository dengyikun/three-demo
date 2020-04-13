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
} from "./vendor/three.module.js";

var twoPi = Math.PI * 2;

var scene = new Scene();

var camera = new PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 2000 );
camera.position.z = 30;

var renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var lights = [];
lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 3 ] = new PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 200, 0, 0 );
lights[ 1 ].position.set( 0, 0, -200 );
lights[ 2 ].position.set( -200, 0, 0 );
lights[ 3 ].position.set( 0, 0, 200 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );
scene.add( lights[ 3 ] );

var data = {
  radiusTop: 5,
  radiusBottom: 5,
  height: 6,
  radialSegments: 36,
  heightSegments: 1,
  openEnded: true,
  thetaStart: 0,
  thetaLength: twoPi
};

var geometry = new CylinderGeometry(
  data.radiusTop,
  data.radiusBottom,
  data.height,
  data.radialSegments,
  data.heightSegments,
  data.openEnded,
  data.thetaStart,
  data.thetaLength
);

var materialFront = new MeshPhongMaterial( {
  map: ImageUtils.loadTexture('./img/front.png'),
  side: FrontSide,
  transparent: true,
} )

var materialBack = new MeshPhongMaterial( {
  map: ImageUtils.loadTexture('./img/back.png'),
  side: BackSide,
  transparent: true,
} )

var meshFaceMaterial = new MeshFaceMaterial([materialFront, materialBack])

for (var i = 0, len = geometry.faces.length; i < len; i++) {
  var face = geometry.faces[i].clone();
  face.materialIndex = 1;
  geometry.faces.push(face);
  geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
}

var cylinder = new Mesh( geometry, meshFaceMaterial );

cylinder.position.set( -2.6, -9, 0 )

scene.add( cylinder );

var render = function () {
  
  requestAnimationFrame( render );

  renderer.setClearAlpha(1)
  renderer.render( scene, camera );
  
};

render();

var startX = null;

function onMoveStart() {
  startX = null
}

function onMove(event) {
  var clientX = event.touches ? event.touches[0].clientX : event.clientX
  if (startX !== null) {
    var x = (clientX - startX) * 0.002
    geometry.rotateY(x)
  }
  startX = clientX
}

function onMoveEnd() {
  startX = null
}

document.addEventListener( 'mousedown', onMoveStart, false );
document.addEventListener( 'mousemove', onMove, false );
document.addEventListener( 'mouseup', onMoveEnd, false );

document.addEventListener( 'touchstart', onMoveStart, false );
document.addEventListener( 'touchmove', onMove, false );
document.addEventListener( 'touchend', onMoveEnd, false );

function onScroll() {
  cylinder.position.set( -2.6, -9 + window.scrollY * 0.02, 0 )
}

window.addEventListener( 'scroll', onScroll, false );

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onResize, false );