'use strict';

let scene,
  camera,
  renderer,
  raycaster,
  controls,
  mouse;

let objectCache = {};

let width,
  height;

let house,
  balcony,soloData;


var CUTOUTS = [{url:"p_0.png",scaleX:21,scaleY:30,x:0,y:16,z:-18},{url:"p_1.png",scaleX:30,scaleY:34,x:2,y:18,z:-6},{url:"p_3.png",scaleX:25,scaleY:27,x:0,y:16,z:0}];
function init() {
  width = window.innerWidth,
    height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, -120);
  camera.lookAt(new THREE.Vector3(0, 5, 0));

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x5cdfda, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  house = createHouse();
  house.position.set(-180, 0, 0)
  scene.add(house);

  for (var i = 0; i < 12; i++) {
    balcony = createBalcony();
    balcony.position.set(-28, 250, 12)
    balcony.scale.set(0.95, 0.9, 0.9)
    scene.add(balcony);
    balcony.sprite = null;
    var self = this;
    var bal = balcony;
    var t = TweenMax.to(balcony.position, 8, {
      y: "-=500",
      repeat: -1,
      ease: Linear.easeNone,
      onRepeat: addSpriteToBalcony,
      onRepeatParams: [bal],
        onStart: addSpriteToBalcony,
      onStartParams: [bal]
    });
    t.progress(i / 12);
  }
  addLights();
  /*   balcony2 = createBalcony();
    balcony2.position.set(-15,25,5)
      balcony2.scale.set(0.9,0.9,0.9)
    scene.add(balcony2);
    
    
      balcony3 = createBalcony();
    balcony3.position.set(-15,-75,5)
      balcony3.scale.set(0.9,0.9,0.9)
    scene.add(balcony3);
    
    TweenMax.to(balcony3.position,4,{y:"+=100",repeat:-1,ease:Linear.easeNone});
    TweenMax.to(balcony2.position,4,{y:"+=100",repeat:-1,ease:Linear.easeNone});
    TweenMax.to(balcony.position,4,{y:"+=100",repeat:-1,ease:Linear.easeNone});
   
   */

  document.getElementById('world').appendChild(renderer.domElement);

  window.addEventListener('resize', onResize, false);
}

function createHouse() {
  var geometry = new THREE.BoxGeometry(300, 200, 1);
  var material = new THREE.MeshStandardMaterial({
    color: 0xeeeac8
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;

  return cube;
}

function createBalcony() {
  var tgTex = new TG.Texture(256, 256)
    .add(new TG.Noise().tint(223 / 255, 209 / 255, 182 / 255))
    .add(new TG.Transform().offset(0, 0).scale(80, 80).angle(Math.random()));
  var texture = new THREE.Texture(tgTex.toCanvas());
  texture.needsUpdate = true;

  var tgTex2 = new TG.Texture(128, 128)
    .add(new TG.Noise())
    .add(new TG.Transform().offset(0, 0).scale(40, 40).angle(Math.random()));
  var textureLight = new THREE.Texture(tgTex2.toCanvas());
  textureLight.needsUpdate = true;

  var b = new THREE.Group()
  var geometry = new THREE.BoxGeometry(30, 1.5, 40);
  var material = new THREE.MeshStandardMaterial({
    color: 0xb3997e,
    map: texture,
    lightMap: textureLight
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.receiveShadow = true;
  cube.castShadow = true;

  var cube2 = new THREE.Mesh(geometry, material);
  cube2.rotation.z = rad(90);
  cube2.position.x = -14;
  cube2.position.y = 10;
  cube2.receiveShadow = true;
  cube2.castShadow = true;
  cube2.scale.x = .7;

  var darkMat = new THREE.MeshStandardMaterial({
    color: 0x000200
  });
  var handleGeo = new THREE.BoxGeometry(1, 1, 1);
  var handle1 = new THREE.Mesh(handleGeo, darkMat)
  handle1.position.set(1, 20, -19)
  handle1.scale.set(30, .75, 1)
  handle1.castShadow = handle1.receiveShadow = true;

  var handle2 = new THREE.Mesh(handleGeo, darkMat)
  handle2.position.set(15, 20, 1)
  handle2.scale.set(39, .75, 1)
  handle2.rotation.y = rad(90)
  handle2.castShadow = handle2.receiveShadow = true;

  var handle3 = new THREE.Mesh(handleGeo, darkMat)
  handle3.position.set(0, 20, 20)
  handle3.scale.set(30, .75, 1)
  handle3.castShadow = handle3.receiveShadow = true;

  var handle4 = new THREE.Mesh(handleGeo, darkMat)
  handle4.position.set(1, 3, -19)
  handle4.scale.set(30, .75, 1)
  handle4.castShadow = handle1.receiveShadow = true;
  
  for(var i=0; i < 12; i++){
    var h = new THREE.Mesh(handleGeo, darkMat)
    h.position.set(-12 + 2.5*i, 10, -19)
    h.scale.set(.32, 20, .32)
    h.castShadow = h.receiveShadow = true;
    b.add(h);
  }
  
   for(var i=0; i < 11; i++){
    var h = new THREE.Mesh(handleGeo, darkMat)
    h.position.set(-12 + 2.5*i, 10, 19)
    h.scale.set(.32, 20, .32)
    h.castShadow = h.receiveShadow = true;
    b.add(h);
  }
  
  
  for(var i=0; i < 12; i++){
    var h = new THREE.Mesh(handleGeo, darkMat)
    h.position.set(15, 10, -17 + 3*i)
    h.scale.set(.3, 20, .3)
    h.castShadow = h.receiveShadow = true;
    b.add(h);
  }

  b.add(cube2);
  b.add(cube);

  b.add(handle1);
  b.add(handle2);
  b.add(handle3);
  b.add(handle4);

  return b;

}

function addSpriteToBalcony(balcony) {
  if (balcony.sprite) {
    balcony.remove(balcony.sprite);
    balcony.sprite = null;
  }
  
  var data;
  
  data = CUTOUTS[Math.floor(Math.random() * CUTOUTS.length)]
  
  if(soloData) 
    {
      data = soloData;
    }
  if(Math.random()>0.06)return;

  var tl = new THREE.TextureLoader();
  tl.crossOrigin = '';
  var spriteMap = tl.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/8076/" + data.url);
 
  var geometry = new THREE.PlaneGeometry( data.scaleX, data.scaleY );
  var material = new THREE.MeshStandardMaterial( {map:spriteMap,color: 0xffffff, side: THREE.DoubleSide,transparent:true} );
  var sprite = new THREE.Mesh( geometry, material );
  balcony.add(sprite);
  sprite.receiveShadow = true; 
  sprite.position.set(data.x, data.y, data.z)
  balcony.sprite = sprite; 
}

function addLights() {
  const light = new THREE.HemisphereLight(0x89e1ff, 0xaade8a, 1);
  scene.add(light);

  const directLight1 = new THREE.DirectionalLight(0xfcffaf);
  directLight1.intensity = 30;
  directLight1.castShadow = true;
  directLight1.position.set(1500, 700, -300);
  directLight1.shadowCameraNear = 1000;
  directLight1.shadowCameraFar = 1800;
  directLight1.shadowCameraLeft = -50;
  ''
  directLight1.shadowCameraRight = 50;
  directLight1.shadowCameraTop = 120;
  directLight1.shadowCameraBottom = -120;
  directLight1.shadowCameraVisible = true;
  directLight1.shadowCameraVisible = true;
  directLight1.shadowMapWidth = 1024;
  directLight1.shadowMapHeight = 1024;

  scene.add(directLight1);

  const directLight2 = new THREE.DirectionalLight({
    color: 0xd9fbfc,
    intensity: 3,
  });
  directLight2.castShadow = false;
  directLight2.position.set(-27, 100, 6);
  scene.add(directLight2);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
  renderer.toneMappingExposure = Math.pow(1.4, 4.0);

}

function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

}

function rad(degrees) {
  return degrees * (Math.PI / 180);
}

init();
animate();