import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

console.log('dustline loading... (polish update)');

function getById(id) {
  return document.getElementById(id);
}

let clamp = THREE.MathUtils.clamp;
let lerp = THREE.MathUtils.lerp;


function makeTex(size, drawIt) {
  let c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  drawIt(c.getContext('2d'), size);
  let t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function dotNoise(g, s, howMany, a, dark) {
  for (let i = 0; i < howMany; i++) {
    if (dark) {
      g.fillStyle = 'rgba(20,16,10,' + a * Math.random() + ')';
    } else {
      g.fillStyle = 'rgba(255,246,220,' + a * Math.random() + ')';
    }
    let r = Math.random() * 2.2 + 0.5;
    g.fillRect(Math.random() * s, Math.random() * s, r, r);
  }
}

let texs = {};

texs.sandstone = makeTex(256, (g, s) => {
  g.fillStyle = '#8a744f';
  g.fillRect(0, 0, s, s);
  let rows = 6;
  let bh = s / rows;
  for (let r = 0; r < rows; r++) {
    let x = (r % 2) * -30;
    while (x < s) {
      let bw = 60 + Math.random() * 50;
      let v = (Math.random() * 26 - 13) | 0;
      g.fillStyle = 'rgb(' + (179 + v) + ',' + (155 + v) + ',' + (112 + v) + ')';
      g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
      g.fillStyle = 'rgba(255,255,255,0.07)';
      g.fillRect(x + 2, r * bh + 2, bw - 4, 3);
      g.fillStyle = 'rgba(0,0,0,0.10)';
      g.fillRect(x + 2, r * bh + bh - 6, bw - 4, 4);
      x += bw;
    }
  }
  dotNoise(g, s, 500, 0.10, true);
  let gr = g.createLinearGradient(0, s * 0.6, 0, s);
  gr.addColorStop(0, 'rgba(60,45,25,0)');
  gr.addColorStop(1, 'rgba(60,45,25,0.22)');
  g.fillStyle = gr;
  g.fillRect(0, 0, s, s);
});

texs.stone = makeTex(256, (g, s) => {
  g.fillStyle = '#5c5a53';
  g.fillRect(0, 0, s, s);
  let rows = 4;
  let bh = s / rows;
  for (let r = 0; r < rows; r++) {
    let x = (r % 2) * -40;
    while (x < s) {
      let bw = 90 + Math.random() * 60;
      let v = (Math.random() * 24 - 12) | 0;
      g.fillStyle = 'rgb(' + (132 + v) + ',' + (128 + v) + ',' + (118 + v) + ')';
      g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
      x += bw;
    }
  }
  dotNoise(g, s, 700, 0.12, true);
});

texs.sand = makeTex(256, (g, s) => {
  g.fillStyle = '#b59a6b';
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = 'rgba(' + (140 + Math.random() * 30 | 0) + ',' + (115 + Math.random() * 25 | 0) + ',' + (75 + Math.random() * 20 | 0) + ',0.18)';
    g.beginPath();
    g.ellipse(Math.random() * s, Math.random() * s, 10 + Math.random() * 30, 6 + Math.random() * 18, Math.random() * 3, 0, 7);
    g.fill();
  }
  dotNoise(g, s, 900, 0.16, true);
  dotNoise(g, s, 500, 0.10, false);
});

texs.wood = makeTex(256, (g, s) => {
  g.fillStyle = '#8a6842';
  g.fillRect(0, 0, s, s);
  let planks = 4;
  let pw = s / planks;
  for (let p = 0; p < planks; p++) {
    let v = (Math.random() * 18 - 9) | 0;
    g.fillStyle = 'rgb(' + (138 + v) + ',' + (104 + v) + ',' + (66 + v) + ')';
    g.fillRect(p * pw + 2, 0, pw - 4, s);
    g.strokeStyle = 'rgba(60,40,20,0.25)';
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      let x = p * pw + 4 + Math.random() * (pw - 8);
      g.moveTo(x, 0);
      g.bezierCurveTo(x + 6, s * 0.33, x - 6, s * 0.66, x, s);
      g.lineWidth = 0.8 + Math.random();
      g.stroke();
    }
  }
  g.strokeStyle = '#5f4527';
  g.lineWidth = 14;
  g.strokeRect(0, 0, s, s);
  g.strokeStyle = 'rgba(0,0,0,0.35)';
  g.lineWidth = 2;
  g.strokeRect(7, 7, s - 14, s - 14);
  g.fillStyle = '#3a2c1a';
  let nailSpots = [[16, 16], [s - 16, 16], [16, s - 16], [s - 16, s - 16]];
  for (let i = 0; i < nailSpots.length; i++) {
    g.beginPath();
    g.arc(nailSpots[i][0], nailSpots[i][1], 4, 0, 7);
    g.fill();
  }
  dotNoise(g, s, 200, 0.08, true);
});

texs.plaster = makeTex(256, (g, s) => {
  g.fillStyle = '#cbbd9b';
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 26; i++) {
    g.fillStyle = 'rgba(150,135,100,' + (0.04 + Math.random() * 0.06) + ')';
    g.beginPath();
    g.ellipse(Math.random() * s, Math.random() * s, 8 + Math.random() * 40, 6 + Math.random() * 24, Math.random() * 3, 0, 7);
    g.fill();
  }
  dotNoise(g, s, 600, 0.10, true);
  dotNoise(g, s, 300, 0.06, false);
});

texs.stripes = makeTex(128, (g, s) => {
  let bw = s / 8;
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? '#a63c2a' : '#dfcfae';
    g.fillRect(i * bw, 0, bw + 1, s);
  }
  dotNoise(g, s, 150, 0.12, true);
});
texs.sky = makeTex(512, (g, s) => {
  let gr = g.createLinearGradient(0, 0, 0, s);
  gr.addColorStop(0, '#5e93cf');
  gr.addColorStop(0.55, '#a9c6e4');
  gr.addColorStop(0.8, '#dfe0cf');
  gr.addColorStop(1, '#e8d9ba');
  g.fillStyle = gr;
  g.fillRect(0, 0, s, s);
});
texs.sky.wrapS = THREE.ClampToEdgeWrapping;
texs.sky.wrapT = THREE.ClampToEdgeWrapping;


function letterTex(L) {
  return makeTex(128, (g, s) => {
    g.font = 'bold 92px Arial';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = 'rgba(210,140,50,0.5)';
    g.fillText(L, s / 2 + 3, s / 2 + 5);
    g.fillStyle = 'rgba(245,240,230,0.9)';
    g.fillText(L, s / 2, s / 2);
  });
}

function siteBoxTex(L) {
  return makeTex(256, (g, s) => {
    g.strokeStyle = 'rgba(255,255,255,0.5)';
    g.lineWidth = 10;
    g.setLineDash([28, 16]);
    g.strokeRect(24, 24, s - 48, s - 48);
    g.setLineDash([]);
    g.fillStyle = 'rgba(255,255,255,0.75)';
    g.font = 'bold 150px Arial';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(L, s / 2, s / 2 + 8);
  });
}


let scene = new THREE.Scene();
scene.background = texs.sky;
scene.fog = new THREE.Fog(0xd8cfb4, 70, 240);

let camera = new THREE.PerspectiveCamera(74, innerWidth / innerHeight, 0.05, 400);
let camRig = new THREE.Group();
camRig.add(camera);
camRig.rotation.y = Math.PI;
scene.add(camRig);
camera.position.set(0, 1.62, 0);

let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  document.body.innerHTML = '<p style="color:#fff;font-family:monospace;padding:40px">webgl doesnt work here so the game cant start, sorry</p>';
  throw err;
}
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
 document.body.appendChild(renderer.domElement);

  let controls = new PointerLockControls(camera, renderer.domElement);

 scene.add(new THREE.HemisphereLight(0xbfd6ea, 0x9a8a68, 0.95));

let sun = new THREE.DirectionalLight(0xffeecf, 2.4);
sun.position.set(55, 85, -25);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 240;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun);

let shadowTarget = new THREE.Object3D();
scene.add(shadowTarget);
sun.target = shadowTarget;

let tmpVec = new THREE.Vector3();
let fwd = new THREE.Vector3();
let right = new THREE.Vector3();
let wish = new THREE.Vector3();
let tmpQuat = new THREE.Quaternion();

let wallList = [];

let wallGrid = {};
let gridBuilt = false;
let nearTmp = [];
let GRID = 8;

function buildWallGrid() {
  wallGrid = {};
  for (let i = 0; i < wallList.length; i++) {
    let w = wallList[i];
    let cx0 = Math.floor(w.x0 / GRID);
    let cx1 = Math.floor(w.x1 / GRID);
    let cz0 = Math.floor(w.z0 / GRID);
    let cz1 = Math.floor(w.z1 / GRID);
    for (let cx = cx0; cx <= cx1; cx++) {
      for (let cz = cz0; cz <= cz1; cz++) {
        let k = cx + '_' + cz;
        if (!wallGrid[k]) wallGrid[k] = [];
        wallGrid[k].push(i);
      }
    }
  }
  gridBuilt = true;
}

function wallsNear(x, z) {
  if (!gridBuilt) return wallList;
  let cx = Math.floor(x / GRID);
  let cz = Math.floor(z / GRID);
  nearTmp.length = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let a = wallGrid[(cx + i) + '_' + (cz + j)];
      if (a) for (let q = 0; q < a.length; q++) nearTmp.push(wallList[a[q]]);
    }
  }
  return nearTmp;
}

function rampHeight(w, x, z) {
  let p = w.ramp.ax === 'x' ? x : z;
  let t = clamp((p - w.ramp.a0) / (w.ramp.a1 - w.ramp.a0), 0, 1);
  return w.ramp.h0 + (w.ramp.h1 - w.ramp.h0) * t;
}

function hitsWall(x, z, feetY, h) {
  let R = 0.4;
  let near = wallsNear(x, z);
  for (let i = 0; i < near.length; i++) {
    let w = near[i];
    if (x + R > w.x0 && x - R < w.x1 && z + R > w.z0 && z - R < w.z1) {
      let top = w.ramp ? rampHeight(w, x, z) : w.y1;
      if (top > feetY + 0.55 && w.y0 < feetY + h) return true;
    }
  }
  return false;
}

function floorAt(x, z, feetY) {
  let g = 0;
  let near = wallsNear(x, z);
  for (let i = 0; i < near.length; i++) {
    let w = near[i];
    if (x + 0.35 > w.x0 && x - 0.35 < w.x1 && z + 0.35 > w.z0 && z - 0.35 < w.z1) {
      let top = w.ramp ? rampHeight(w, x, z) : w.y1;
      if (top <= feetY + 0.55 && top > g) g = top;
    }
  }
  return g;
}

function pushWall(x0, x1, z0, z1, y0, y1, ramp) {
  wallList.push({ x0: x0, x1: x1, z0: z0, z1: z1, y0: y0, y1: y1, ramp: ramp });
}

function makeMat(tex, rx, ry) {
  let t = tex.clone();
  t.needsUpdate = true;
  t.repeat.set(rx, ry);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, metalness: 0 });
}

function addWall(x0, z0, x1, z1, h, y0, tex) {
  if (h === undefined) h = 5;
  if (y0 === undefined) y0 = 0;
  if (!tex) tex = 'sandstone';
  let w = x1 - x0;
  let d = z1 - z0;
  let m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    makeMat(texs[tex], Math.max(w, d) / 3.2, Math.max(h / 3.2, 0.5))
  );
  m.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(x0, x1, z0, z1, y0, y0 + h);
}

let crateMat = new THREE.MeshStandardMaterial({ map: texs.wood, roughness: 0.9 });
let crateGeos = {};

function addCrate(x, z, sz, h, y0) {
  if (!sz) sz = 2.2;
  if (!h) h = 1.1;
  if (!y0) y0 = 0;
  let k = sz + '_' + h;
  if (!crateGeos[k]) {
    
    
      crateGeos[k] = new THREE.BoxGeometry(sz, h, sz);}
   let m = new THREE.Mesh(crateGeos[k], crateMat);
  m.position.set(x, y0 + h / 2, z);
  m.rotation.y = (Math.random() - 0.5) * 0.05;
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(x - sz / 2, x + sz / 2, z - sz / 2, z + sz / 2, y0, y0 + h);
}

let barrelMat = new THREE.MeshStandardMaterial({ color: 0x9c3a28, roughness: 0.85, metalness: 0.2 });
let barrelGeo = null;

function addBarrel(x, z, y0) {
  if (!y0) y0 = 0;
  if (x < -43 || x > 43 || z < -43 || z > 43) {
    console.log('barrel fell out of the map, oh well');
    return;
  }
  if (!barrelGeo) {
    barrelGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.3, 12);
  }
  let m = new THREE.Mesh(barrelGeo, barrelMat);
  m.position.set(x, y0 + 0.65, z);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
//change the box



  pushWall(x - 0.5, x + 0.5, z - 0.5, z + 0.5, y0, y0 + 1.3);
}

let postGeo = new THREE.BoxGeometry(0.14, 2.8, 0.14);
let postMat = new THREE.MeshStandardMaterial({ color: 0x55412b, roughness: 0.95 });

function addStall(x, z) {
  if (x < -40 || x > 40) {
    console.log('stall ended up outside the walls, skipping that one');
    return;
  }
  addWall(x - 1.5, z - 0.7, x + 1.5, z + 0.7, 1.0, 0, 'wood');
  let posts = [
    [x - 1.6, z + 1.0, 1],
    [x + 1.6, z + 1.0, 1],
    [x - 1.6, z - 0.8, 0.75],
    [x + 1.6, z - 0.8, 0.75]
  ];
  for (let i = 0; i < posts.length; i++) {
    let p = new THREE.Mesh(postGeo, postMat);
    p.position.set(posts[i][0], 1.4 * posts[i][2], posts[i][1]);
    p.scale.y = posts[i][2];
    p.castShadow = true;
    scene.add(p);
  }
  let top = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.09, 2.2), makeMat(texs.stripes, 2, 1));
  top.position.set(x, 2.45, z + 0.15);
  top.rotation.x = -0.3;
  top.castShadow = true;
  scene.add(top);
}

let carBodyMat = new THREE.MeshStandardMaterial({ color: 0x5f7183, roughness: 0.55, metalness: 0.3 });
let carGlassMat = new THREE.MeshStandardMaterial({ color: 0x2c3439, roughness: 0.3, metalness: 0.4 });
let wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 10);
let wheelMat = new THREE.MeshStandardMaterial({ color: 0x1d1d1d, roughness: 0.95 });

function addCar(x, z, alongX) {
  if (x < -40 || x > 40 || z < -40 || z > 40) {
    console.log('car ended up outside the map, not adding that one');
    return;
  }
  let sx = alongX ? 4.2 : 1.9;
  let sz = alongX ? 1.9 : 4.2;
  let body = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.75, sz), carBodyMat);
  body.position.set(x, 0.72, z);
  body.castShadow = true;
  body.receiveShadow = true;
  scene.add(body);
  pushWall(x - sx / 2, x + sx / 2, z - sz / 2, z + sz / 2, 0, 1.1);

  let cabX = alongX ? 2.0 : 1.7;
  let cabZ = alongX ? 1.7 : 2.0;
  let cab = new THREE.Mesh(new THREE.BoxGeometry(cabX, 0.65, cabZ), carGlassMat);
  cab.position.set(alongX ? x - 0.4 : x, 1.42, alongX ? z : z - 0.4);
  cab.castShadow = true;
  scene.add(cab);
  pushWall(cab.position.x - cabX / 2, cab.position.x + cabX / 2, cab.position.z - cabZ / 2, cab.position.z + cabZ / 2, 1.1, 1.75);

  for (let i = 0; i < 4; i++) {
    let w = new THREE.Mesh(wheelGeo, wheelMat);
    if (alongX) {
      w.position.set(x + (i < 2 ? -1.35 : 1.35), 0.34, z + (i % 2 ? 0.8 : -0.8));
      w.rotation.x = Math.PI / 2;
    } else {
      w.position.set(x + (i % 2 ? 0.8 : -0.8), 0.34, z + (i < 2 ? -1.35 : 1.35));
      w.rotation.z = Math.PI / 2;
    }
    w.castShadow = true;
    scene.add(w);
  }
}

function addRampX(x0, x1, zc, w, h0, h1) {
  let L = x1 - x0;
  let H = h1 - h0;
  let slope = Math.hypot(L, H);
  let m = new THREE.Mesh(
    new THREE.BoxGeometry(slope, 0.35, w),
    makeMat(texs.stone, slope / 3, w / 3)
  );
  m.rotation.z = Math.atan2(H, L);
  m.position.set((x0 + x1) / 2, (h0 + h1) / 2 - 0.17, zc);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(x0, x1, zc - w / 2, zc + w / 2, 0, Math.max(h0, h1), { ax: 'x', a0: x0, a1: x1, h0: h0, h1: h1 });
}

function addRampZ(z0, z1, xc, w, h0, h1) {
  let L = z1 - z0;
  let H = h1 - h0;
  let slope = Math.hypot(L, H);
  let m = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.35, slope),
    makeMat(texs.stone, w / 3, slope / 3)
  );
  m.rotation.x = Math.atan2(h0 - h1, z1 - z0);
  m.position.set(xc, (h0 + h1) / 2 - 0.17, (z0 + z1) / 2);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(xc - w / 2, xc + w / 2, z0, z1, 0, Math.max(h0, h1), { ax: 'z', a0: z0, a1: z1, h0: h0, h1: h1 });
}

let capMat = new THREE.MeshStandardMaterial({ color: 0x6a655b, roughness: 1 });

function addCap(x0, z0, x1, z1, topY) {
  let m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 0.6, 0.5, z1 - z0 + 0.6), capMat);
  m.position.set((x0 + x1) / 2, topY + 0.2, (z0 + z1) / 2);
  m.castShadow = true;
  scene.add(m);
}

function addArch(x0, z0, x1, z1, h) {
  let w = x1 - x0;
  let d = z1 - z0;
  let hh = h - 3.3;
  let m = new THREE.Mesh(
    new THREE.BoxGeometry(w, hh, d),
    makeMat(texs.sandstone, Math.max(w, d) / 3, hh / 3)
  );
  m.position.set((x0 + x1) / 2, 3.3 + hh / 2, (z0 + z1) / 2);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(x0, x1, z0, z1, 3.3, h);
}

function wallLetter(L, x, y, z, ry) {
  let m = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshBasicMaterial({ map: letterTex(L), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })
  );
  m.position.set(x, y, z);
  m.rotation.y = ry;
  scene.add(m);
}

function floorSite(L, x, z, y) {
  let m = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 6.5),
    new THREE.MeshBasicMaterial({ map: siteBoxTex(L), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })
  );
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = Math.random() * 0.4 - 0.2;
  m.position.set(x, y + 0.02, z);
  scene.add(m);
}

let markMat = new THREE.MeshBasicMaterial({ color: 0x2b2115, transparent: true, opacity: 0.14, depthWrite: false });

function floorMark(x, z, r, y) {
  if (y === undefined) y = 0.02;
  let m = new THREE.Mesh(new THREE.PlaneGeometry(r, r), markMat);
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = Math.random() * 6.28;
  m.position.set(x, y, z);
  scene.add(m);
}


//the time in hacktime is mostly finding values
function buildMap() {
  let ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), makeMat(texs.sand, 30, 30));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  addWall(-46, -46, 46, -44, 7, 0, 'stone');
  addWall(-46, 44, 46, 46, 7, 0, 'stone');
  addWall(-46, -46, -44, 46, 7, 0, 'stone');
  addWall(44, -46, 46, 46, 7, 0, 'stone');
  addCap(-46, -46, 46, -44, 7);
  addCap(-46, 44, 46, 46, 7);
  addCap(-46, -46, -44, 46, 7);
  addCap(44, -46, 46, 46, 7);

  addWall(-9, -28, -7, -12, 5, 0, 'sandstone');
  addCap(-9, -28, -7, -12, 5);
  addWall(7, -28, 9, -21, 5, 0, 'sandstone');
  addWall(7, -17, 9, -14, 5, 0, 'sandstone');
  
  addWall(-7, -2, -2, 0, 4.5, 0, 'wood');
  addWall(2, -2, 7, 0, 4.5, 0, 'wood');
  
  
  addArch(-2, -2, 2, 0, 4.5);
  addCrate(0, -22, 2.6, 1.3);
  addCrate(4.5, 12, 1.9);
  addCrate(-4.5, -14, 1.9);
  addCrate(2, -8, 1.3, 1.3);

  addWall(7, -14, 32, 30, 5, 0, 'plaster');
  addCap(7, -14, 32, 30, 5);
  wallLetter('A', 20, 2.3, -14.1, Math.PI);

  addWall(10, -24, 24, -17, 1.1, 0, 'stone');
  
  addWall(10, -17, 24, -16.2, 1.5, 1.1, 'sandstone');
  addRampX(7, 10, -19, 4, 0, 1.1);
  addRampX(24, 29, -20.5, 7, 1.1, 0);

  addWall(29, -40, 43, -14, 1.1, 0, 'stone');
  addRampZ(-14, -2, 38.5, 9, 1.1, 0);
  addRampX(26, 29, -27, 6, 0, 1.1);
  addCrate(33, -32, 2.4, 1.2, 1.1);
  
  addCrate(33, -32, 1.8, 0.9, 2.3);
  
  addCrate(39, -34, 2.4, 1.2, 1.1);
  
  addCrate(31, -20, 2.2, 1.1, 1.1);
  
  addCrate(16, -18.8, 2.4, 1.1, 1.1);
  addCrate(24, -34, 2.4, 1.2);
  addCrate(24, -34, 1.6, 0.8, 1.2);
  addCrate(14, -40, 2.2);
  addCrate(36, -20, 1.3, 1.3, 1.1);
  addCrate(36.15, -20.1, 1.3, 1.3, 2.4);
  addCrate(12, -34, 1.3, 1.3);
  floorSite('A', 36, -27, 1.1);

  addWall(32, -14, 34, 30, 5, 0, 'plaster');
  addCap(32, -14, 34, 30, 5);
  addWall(34, 14, 38.5, 18, 4.5, 0, 'wood');
  addWall(41.5, 14, 43, 18, 4.5, 0, 'wood');
  addArch(38.5, 14, 41.5, 18, 4.5);
  addCrate(36, 26, 2.2);
  addCrate(42, 8, 2.2);
  addCrate(40, 24, 1.3, 1.3);
  addCrate(40.1, 24.1, 1.3, 1.3, 1.3);

  addWall(-16, -44, -14, -36, 5, 0, 'sandstone');
  addWall(-16, -30, -14, -12, 5, 0, 'sandstone');
  addArch(-16, -36, -14, -30, 5);
  addWall(-14, -12, -7, 30, 5, 0, 'sandstone');
  addCap(-14, -12, -7, 30, 5);
  wallLetter('B', -14.1, 2.3, -20, -Math.PI / 2);
  addWall(-33, -12, -14, -10, 5, 0, 'sandstone');
  addWall(-36, -38, -22, -22, 0.9, 0, 'stone');
  addRampX(-22, -18, -30, 4, 0.9, 0);
  addCrate(-33, -33, 2.4, 1.2, 0.9);
  addCrate(-33, -33, 1.6, 0.8, 2.1);
  addCrate(-27, -27, 2.4, 1.2, 0.9);
  addCrate(-40, -16, 2.2);
  addCrate(-18, -16, 2.2);
  addCrate(-25, -35, 1.3, 1.3, 0.9);
  floorSite('B', -29, -30, 0.9);

  addWall(-34, -12, -32, 30, 5, 0, 'stone');
  addCap(-34, -12, -32, 30, 5);
  addWall(-44, 4, -40, 8, 4.5, 0, 'wood');
  addWall(-37, 4, -34, 8, 4.5, 0, 'wood');
  addArch(-40, 4, -37, 8, 4.5);

  addCrate(0, -36, 2.4);
  addCrate(-7, -32, 2.0);
  addCrate(8, -33, 2.0);
  addCrate(-12, 38, 2.4);
  addCrate(2, 40, 2.4);
  addCrate(14, 37, 2.0);
  addCrate(-30, 36, 2.2);
  addCrate(-2, 34, 1.3, 1.3);

 //market and stall changed 
  addStall(-20, 42.5);
  addStall(-12.5, 42.5);
  addStall(-5, 42.5);
  addStall(2.5, 42.5);
  addStall(10, 42.5);
  addStall(17.5, 42.5);
  
  addWall(-6, 32, 2, 33.2, 1.1, 0, 'stone');
  addWall(-26, 32, -20, 33.2, 1.1, 0, 'stone');
  addWall(20, 32, 26, 33.2, 1.1, 0, 'stone');
  addBarrel(-24.5, 41);
  addBarrel(30.5, 41.5);
  addBarrel(31.6, 40.4);
  addBarrel(2, -42);
  addBarrel(3.1, -40.8);
  addBarrel(-12.5, -41);
  addBarrel(-11.3, -39.8);
  addBarrel(20, -42);
  addBarrel(-41, 16);
  addBarrel(-39.8, 17.2);
  addBarrel(-41, -30);
  addBarrel(-39.8, -28.8);
  addBarrel(42.5, 28);
  addBarrel(41.3, 29.3);
  addBarrel(40, -36, 1.1);
  addBarrel(31, -38, 1.1);
  addBarrel(-33, -24, 0.9);
  addCrate(-42, -38, 2.2);
  addCrate(-41, 24, 2.0);

  //ok done! still same tho
  addCar(38, 4, false);
  addCar(-3, 18, false);
  addBarrel(41, 2);
  addBarrel(0.2, 17);
  addBarrel(33, -25, 1.1);
  addCrate(-28, -18, 2.2);
  addCrate(-28, -18, 1.5, 0.75, 1.1);

  let peb = new THREE.MeshStandardMaterial({ color: 0x8d887c, roughness: 1 });
  let pebGeo = new THREE.BoxGeometry(0.25, 0.14, 0.25);
  for (let i = 0; i < 55; i++) {
    let x = (Math.random() - 0.5) * 84;
    let z = (Math.random() - 0.5) * 84;
    if (floorAt(x, z, 10) !== 0 || hitsWall(x, z, 0, 0.2)) continue;
    let p = new THREE.Mesh(pebGeo, peb);
    p.position.set(x, 0.05, z);
    p.rotation.y = Math.random() * 3;
    p.castShadow = true;
    scene.add(p);}

  for (let i = 0; i < 13; i++) {
    let x = (Math.random() - 0.5) * 80;
    let z = (Math.random() - 0.5) * 80;
    if (floorAt(x, z, 10) !== 0 || hitsWall(x, z, 0, 0.2)) continue;
    floorMark(x, z, 3 + Math.random() * 4);
  }
  floorMark(-30, -31, 5, 0.92);
  floorMark(34, -33, 4, 1.12);



}

try {
  buildMap();
} catch (mapErr) {
  console.log('map failed to build, uh oh: ' + mapErr);
}

let ironMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.7, metalness: 0.5 });
let bulbMat = new THREE.MeshBasicMaterial({ color: 0xffc98a });

function addLamp(x, y, z, i, d, gy) {
  if (gy === undefined) gy = 0;
  let poleH = y - gy;
  let pole = new THREE.Mesh(new THREE.BoxGeometry(0.11, poleH, 0.11), ironMat);
  pole.position.set(x, gy + poleH / 2, z);
  pole.castShadow = true;
  scene.add(pole);
  let arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.55), ironMat);
  arm.position.set(x, y + 0.22, z + 0.24);
  scene.add(arm);
  let hood = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.34), ironMat);
  hood.position.set(x, y + 0.14, z + 0.45);
  hood.castShadow = true;
  scene.add(hood);
  let bulb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.2), bulbMat);
  bulb.position.set(x, y + 0.04, z + 0.45);
  scene.add(bulb);
  let l = new THREE.PointLight(0xffb066, i, d, 2);
  l.position.set(x, y, z + 0.45);
  scene.add(l);
}
addLamp(-39, 3.2, 12, 6, 16);
addLamp(-39, 3.2, -4, 6, 16);
addLamp(-29, 3.6, -30, 5, 20, 0.9);
addLamp(36, 3.6, -27, 4, 20, 1.1);
addLamp(0, 3.4, 40, 5, 18);
addLamp(39, 3.2, 24, 5, 16);
addLamp(0, 3.4, -34, 4, 16);
buildWallGrid();

let cloudMat = new THREE.MeshBasicMaterial({ color: 0xf6f4ee, transparent: true, opacity: 0.85, fog: false, depthWrite: false });
let clouds = [];
for (let i = 0; i < 9; i++) {
  let g = new THREE.Group();
  let n = 3 + (Math.random() * 3 | 0);
  for (let j = 0; j < n; j++) {
    let s = 5 + Math.random() * 9;
    let b = new THREE.Mesh(new THREE.SphereGeometry(s, 7, 5), cloudMat);
    b.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 8);
    b.scale.y = 0.45;
    g.add(b);
  }
  g.position.set((Math.random() - 0.5) * 300, 62 + Math.random() * 26, (Math.random() - 0.5) * 300);
  scene.add(g);
  clouds.push({ g: g, v: 0.55 + Math.random() * 0.8 });
}

function stepClouds(dt) {
  for (let i = 0; i < clouds.length; i++) {
    let c = clouds[i];
    c.g.position.x += c.v * dt;
    if (c.g.position.x > 190) c.g.position.x = -190;
  }
}

let birdMat = new THREE.MeshBasicMaterial({ color: 0x3a3226, transparent: true, opacity: 0.8, fog: false, side: THREE.DoubleSide });
let birds = [];
for (let i = 0; i < 7; i++) {
  let b = new THREE.Group();
  let wL = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.32), birdMat);
  wL.position.x = -0.5;
  b.add(wL);
  let wR = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.32), birdMat);
  wR.position.x = 0.5;
  b.add(wR);
  b.userData = { wL: wL, wR: wR, a: Math.random() * 6.28, r: 40 + Math.random() * 50, sp: 0.4 + Math.random() * 0.3, h: 34 + Math.random() * 18 };
  scene.add(b);
  birds.push(b);
}

function stepBirds(dt, t) {
  for (let i = 0; i < birds.length; i++) {
    let b = birds[i];
    let u = b.userData;
    u.a += u.sp * dt;
    b.position.set(Math.cos(u.a) * u.r, u.h + Math.sin(t * 0.7 + i) * 1.6, Math.sin(u.a) * u.r);
    b.rotation.y = -u.a + Math.PI / 2;
    let fl = Math.sin(t * 9 + i * 2);
    u.wL.rotation.z = fl * 0.55;
    u.wR.rotation.z = -fl * 0.55;
  }
}


let sfx = (function () {
  let ctx = null;
  let master = null;
  let noise = null;

  function boot() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = 0.4;
        master.connect(ctx.destination);
        let n = ctx.sampleRate * 0.4;
        noise = ctx.createBuffer(1, n, ctx.sampleRate);
        let d = noise.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (err) {
      console.log('audio is broken: ' + err);
    }
  }

  //sounds ok to me -- ok will update next
  function hiss(freq, vol, dur) {
    if (!ctx) return;
    let t = ctx.currentTime;
    let s = ctx.createBufferSource();
    s.buffer = noise;
    s.playbackRate.value = 0.8 + Math.random() * 0.4;
    let f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = freq;
    let g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f);
    f.connect(g);
    g.connect(master);
    s.start(t);
    s.stop(t + dur + 0.05);
  }

  return {
    boot: boot,
    step: function () { hiss(300 + Math.random() * 150, 0.09, 0.07); },
    land: function () { hiss(240, 0.2, 0.1); },
    slide: function () { hiss(150, 0.22, 0.6); },
    jump: function () { hiss(520, 0.1, 0.12); },
    thump: function () { hiss(110, 0.3, 0.16); },
    skid: function () { hiss(420, 0.12, 0.45); }
  };
})();


let puffTex = makeTex(64, (g, s) => {
  let gr = g.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
  gr.addColorStop(0, 'rgba(214,196,160,0.85)');
  gr.addColorStop(0.6, 'rgba(204,186,150,0.45)');
  gr.addColorStop(1, 'rgba(204,186,150,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, s, s);
});

let dustPool = [];
for (let i = 0; i < 40; i++) {
  let m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, opacity: 0, depthWrite: false }));
  m.visible = false;
  scene.add(m);
  dustPool.push({ m: m, life: 0, max: 1, vx: 0, vy: 0, vz: 0, s: 1, rot: 0, spin: 0 });
}

function puffDust(x, y, z, howMany, burst) {
  for (let i = 0; i < howMany; i++) {
    let d = null;
    for (let q = 0; q < dustPool.length; q++) {
      if (dustPool[q].life <= 0) { d = dustPool[q]; break; }
    }
    if (!d) return;
    d.life = burst ? 0.9 + Math.random() * 0.5 : 0.6 + Math.random() * 0.4;
    d.max = d.life;
    d.m.visible = true;
    d.m.position.set(x + (Math.random() - 0.5) * 0.5, y + 0.05 + Math.random() * 0.3, z + (Math.random() - 0.5) * 0.5);
    d.vx = (Math.random() - 0.5) * (burst ? 2.6 : 1.2);
    d.vy = Math.random() * (burst ? 1.6 : 0.7);
    d.vz = (Math.random() - 0.5) * (burst ? 2.6 : 1.2);
    d.s = 0.45 + Math.random() * (burst ? 0.8 : 0.5);
    d.rot = Math.random() * 6.28;
    d.spin = (Math.random() - 0.5) * 3;
  }
}

function stepDust(dt) {
  camera.getWorldQuaternion(tmpQuat);
  for (let i = 0; i < dustPool.length; i++) {
    let d = dustPool[i];
    if (d.life <= 0) continue;
    d.life -= dt;
    if (d.life <= 0) {
      d.m.visible = false;
      continue;
    }
    d.m.position.x += d.vx * dt;
    d.m.position.y += d.vy * dt;
    d.m.position.z += d.vz * dt;
    d.vy *= 0.94;
    d.vx *= 0.985;
    d.vz *= 0.985;
    d.s += dt * 1.1;
    d.rot += d.spin * dt;
    d.m.scale.set(d.s, d.s, 1);
    d.m.material.opacity = (d.life / d.max) * 0.75;
    d.m.quaternion.copy(tmpQuat);
    d.m.rotateZ(d.rot);
  }
}

let skidPool = [];
let skidMat = new THREE.MeshBasicMaterial({ color: 0x3a2f1e, transparent: true, opacity: 0, depthWrite: false });
let skidGeo = new THREE.PlaneGeometry(0.55, 1.5);
for (let i = 0; i < 10; i++) {
  let sm = new THREE.Mesh(skidGeo, skidMat.clone());
  sm.visible = false;
  scene.add(sm);
  skidPool.push({ m: sm, life: 0 });
}

function dropSkid(x, y, z, heading) {
  for (let i = 0; i < skidPool.length; i++) {
    let s = skidPool[i];
    if (s.life > 0) continue;
    s.life = 2.4;
    s.m.visible = true;
    s.m.position.set(x, y + 0.03, z);
    s.m.rotation.set(-Math.PI / 2, 0, 0);
    s.m.rotateZ(heading);
    s.m.material.opacity = 0.28;
    return;
  }
}

function stepSkids(dt) {
  for (let i = 0; i < skidPool.length; i++) {
    let s = skidPool[i];
    if (s.life <= 0) continue;
    s.life -= dt;
    if (s.life <= 0) {
      s.m.visible = false;
      continue;
    }
    s.m.material.opacity = Math.min(0.28, s.life * 0.16);
  }
}

let dustFx = document.createElement('div');
dustFx.style.cssText = 'position:fixed;inset:0;pointer-events:none;opacity:0;z-index:5;background:' +
  'radial-gradient(circle at 18% 26%, rgba(208,188,152,0.95) 0 7%, transparent 15%),' +
  'radial-gradient(circle at 80% 32%, rgba(198,178,142,0.9) 0 6%, transparent 13%),' +
  'radial-gradient(circle at 54% 58%, rgba(212,192,158,0.8) 0 8%, transparent 17%),' +
  'radial-gradient(circle at 28% 76%, rgba(202,182,146,0.85) 0 7%, transparent 15%),' +
  'radial-gradient(circle at 66% 10%, rgba(192,172,138,0.75) 0 5%, transparent 11%),' +
  'radial-gradient(circle at 40% 48%, rgba(215,200,170,0.5) 0 9%, transparent 19%),' +
  'radial-gradient(ellipse at 50% 50%, rgba(222,208,178,0.42) 0 60%, transparent 80%)';
document.body.appendChild(dustFx);

let filmFx = document.createElement('div');
filmFx.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:4;' +
  'background:radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(18,10,4,0.28) 100%);';
document.body.appendChild(filmFx);
let grainFx = document.createElement('div');
grainFx.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:4;opacity:0.05;' +
  "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\");";
document.body.appendChild(grainFx);

let speedFx = document.createElement('div');
speedFx.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:4;opacity:0;' +
  'background:linear-gradient(90deg, rgba(230,218,188,0.65) 0%, rgba(230,218,188,0) 17%, rgba(230,218,188,0) 83%, rgba(230,218,188,0.65) 100%);' +
  '-webkit-mask:linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.12) 30%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.85));' +
  'mask:linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.12) 30%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.85));';
document.body.appendChild(speedFx);

let wipeArm = (function () {
  let g = new THREE.Group();
  let sleeveMat = new THREE.MeshStandardMaterial({ color: 0x3d4450, roughness: 0.9, side: THREE.DoubleSide });
  let forearm = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.17), sleeveMat);
  forearm.position.x = 0.45;
  g.add(forearm);
  let handMat = new THREE.MeshStandardMaterial({ color: 0xb08d64, roughness: 0.85 });
  let hand = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.06, 0.2), handMat);
  hand.position.set(1.0, 0, 0.02);
  g.add(hand);
  g.visible = false;
  camera.add(g);
  return g;
})();


let me = {
  pos: new THREE.Vector3(0, 0, -40),
  vel: new THREE.Vector3(),
  vy: 0,
  onFloor: true,
  crouch: false,
  eyeY: 1.62,
  bob: 0,
  walkAcc: 0,
  sliding: false,
  slideT: 0,
  slideCd: 0,
  coyote: 0,
  jumpBuf: 0,
  squash: 1
};

let keysDown = {};

let isPaused  = false;
let started   = false;

let tilt = 0;

let landDip = 0;
let slideLean = 0;
let slideKick = 0;
let dustAmt = 0;
let wipeT = -1;
let wipeDelay = 0;
let wipeSway = 0;
let dustSpawnT = 0;
let skidSpawnT = 0;
let worldT = 0;

let myLegs = (function () {
  let g = new THREE.Group();

  function plainMat(c) {
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 });
  }

  let pants = plainMat(0x2f3540);
  let boots = plainMat(0x1b1e22);

  function makeLeg(sideX) {
    let piv = new THREE.Group();
    piv.position.set(sideX, 0.86, 0);

    let leg = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.84, 0.25), pants);
    leg.position.y = -0.42;
    leg.castShadow = true;
    piv.add(leg);

    let boot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.3), boots);
    boot.position.set(0, -0.78, 0.03);
    boot.castShadow = true;
    piv.add(boot);

    g.add(piv);
    
    return piv;
   
  }

  let leftLeg  = makeLeg(-0.13);
     let rightLeg = makeLeg(0.13);

  
    let hips = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.22, 0.28), pants);
  hips.position.y = 0.92;
  hips.castShadow = true;
  g.add(hips);

  camRig.add(g);

  return { g: g, leftLeg: leftLeg, rightLeg: rightLeg };
})();

let myArms = (function () {
  let g = new THREE.Group();

  let sleeveMat = new THREE.MeshStandardMaterial({ color: 0x3d4450, roughness: 0.9 });
  let handMat = new THREE.MeshStandardMaterial({ color: 0xb08d64, roughness: 0.85 });

  function makeArm(sideX) {
    let piv = new THREE.Group();
    piv.position.set(sideX, 1.32, 0.02);
    let arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.5), sleeveMat);
    arm.position.z = 0.22;
    arm.castShadow = true;
    piv.add(arm);
    let hand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), handMat);
    hand.position.set(0, -0.015, 0.5);
    piv.add(hand);
    g.add(piv);
    return piv;
  }

  let armL = makeArm(-0.27);
  let armR = makeArm(0.27);

  camRig.add(g);

  return { g: g, armL: armL, armR: armR };
})();

function updateDustFx(dt) {
  if (!me.sliding) dustAmt = Math.max(0, dustAmt - dt * 0.5);
  dustFx.style.opacity = (dustAmt * 0.85).toFixed(3);
  if (wipeDelay > 0) {
    wipeDelay -= dt;
    if (wipeDelay <= 0) {
      wipeT = 0.45;
      wipeArm.visible = true;
    }
  }
  if (wipeT >= 0) {
    wipeT -= dt;
    let u = 1 - Math.max(0, wipeT) / 0.45;
    wipeArm.position.set(0.62 - u * 1.3, -0.52 + Math.sin(u * Math.PI) * 0.22, -0.55);
    wipeArm.rotation.set(-0.25, -0.15, 0.5 - u * 1.3);
    wipeSway = Math.sin(u * Math.PI) * 0.045;
    if (wipeT <= 0) {
      wipeT = -1;
      wipeSway = 0;
      wipeArm.visible = false;
      dustAmt *= 0.12;
    }
  }
}


function movePlayer(dt) {
  let ix = 0;
  let iz = 0;
  if (keysDown.KeyW) iz += 1;
  if (keysDown.KeyS) iz -= 1;
  if (keysDown.KeyA) ix -= 1;
  if (keysDown.KeyD) ix += 1;

  let sprintHeld = keysDown.ShiftLeft || keysDown.ShiftRight;
  me.crouch = keysDown.KeyC ? true : false;

  let spd = 5.4;
  if (sprintHeld && iz > 0) {
    spd = 7.9;
  }
  if (me.crouch) {
    spd = spd * 0.34;
  }

  camera.getWorldQuaternion(tmpQuat);
  fwd.set(0, 0, -1).applyQuaternion(tmpQuat);
  fwd.y = 0;
  if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
  fwd.normalize();
  right.set(1, 0, 0).applyQuaternion(tmpQuat);
  right.y = 0;
  right.normalize();

  wish.set(0, 0, 0);
  wish.addScaledVector(fwd, iz);
  wish.addScaledVector(right, ix);
  if (wish.lengthSq() > 0) wish.normalize();
  wish.multiplyScalar(spd);

  me.slideCd -= dt;
  if (me.slideCd < 0) me.slideCd = 0;

  let hspdNow = Math.hypot(me.vel.x, me.vel.z);
  if (me.crouch && sprintHeld && iz > 0 && me.onFloor && !me.sliding && me.slideCd <= 0 && hspdNow > 6.8) {
    me.sliding = true;
    me.slideT = 0.85;
    me.slideCd = 1.4;
    me.vel.x *= 1.18;
    me.vel.z *= 1.18;
    slideKick = 0.085;
    sfx.slide();
    puffDust(me.pos.x, me.pos.y, me.pos.z, 10, true);
    wipeT = -1;
    wipeDelay = 0;
    wipeArm.visible = false;
  }

  //needs 3rd hand fixing
  if (me.sliding) {
    me.slideT -= dt;
    let keep = Math.exp(-1.4 * dt);
    me.vel.x *= keep;
    me.vel.z *= keep;
    me.vel.x += right.x * ix * 1.6 * dt;
    me.vel.z += right.z * ix * 1.6 * dt;
    let hs = Math.hypot(me.vel.x, me.vel.z);
    if (me.slideT <= 0 || !me.crouch || hs < 3.2 || !me.onFloor) {
      me.sliding = false;
      if (me.onFloor) landDip = -0.05;
      if (dustAmt > 0.25) wipeDelay = 0.4;
    } else {
      dustAmt = Math.min(1, dustAmt + dt * 2.4);
      dustSpawnT += dt;
      if (dustSpawnT > 0.04) {
        dustSpawnT = 0;
        puffDust(me.pos.x - me.vel.x * 0.14, me.pos.y, me.pos.z - me.vel.z * 0.14, 2, false);
      }
      skidSpawnT += dt;
      if (skidSpawnT > 0.12) {
        skidSpawnT = 0;
        dropSkid(me.pos.x, me.pos.y, me.pos.z, Math.atan2(-me.vel.x, -me.vel.z));
      }
    }
  } else {
    let push = me.onFloor ? 12 : 2.5;
    let k = 1 - Math.exp(-push * dt);
    me.vel.x += (wish.x - me.vel.x) * k;
    me.vel.z += (wish.z - me.vel.z) * k;
  }

  if (me.onFloor) me.coyote = 0.1; else me.coyote -= dt;
  if (keysDown.Space) me.jumpBuf = 0.13; else me.jumpBuf -= dt;
  if (me.jumpBuf > 0 && me.coyote > 0) {
    me.vy = 5.9;
    me.onFloor = false;
    me.coyote = 0;
    me.jumpBuf = 0;
    sfx.jump();
    puffDust(me.pos.x, me.pos.y, me.pos.z, 3, false);
  }
  me.vy -= 15 * dt;

  let feetY = me.pos.y;

  let nx = me.pos.x + me.vel.x * dt;
  if (!hitsWall(nx, me.pos.z, feetY, 1.8)) {
    me.pos.x = nx;
  } else {
    me.vel.x = 0;
  }

  let nz = me.pos.z + me.vel.z * dt;
  if (!hitsWall(me.pos.x, nz, feetY, 1.8)) {
    me.pos.z = nz;
  } else {
    me.vel.z = 0;
  }

  let gnd = floorAt(me.pos.x, me.pos.z, me.pos.y);
  me.pos.y += me.vy * dt;
  if (me.pos.y <= gnd) {
    if (!me.onFloor && me.vy < -4) {
      sfx.land();
      sfx.thump();
      landDip = Math.min(0.24, 0.08 + (-me.vy - 6) * 0.022);
      puffDust(me.pos.x, gnd, me.pos.z, 7, true);
    }
    me.pos.y = gnd;
    me.vy = 0;
    me.onFloor = true;
  } else if (me.onFloor && me.pos.y - gnd > 0.05) {
    me.onFloor = false;
  }

  camRig.position.copy(me.pos);

  let eyeWant = me.sliding ? 0.8 : (me.crouch ? 1.15 : 1.62);
  me.eyeY += (eyeWant - me.eyeY) * (1 - Math.exp(-(me.sliding ? 16 : 10) * dt));

  let squashWant = me.sliding ? 0.55 : (me.crouch ? 0.8 : 1);
  me.squash += (squashWant - me.squash) * (1 - Math.exp(-10 * dt));
  myLegs.g.scale.y = me.squash;

  let hspd = Math.hypot(me.vel.x, me.vel.z);
  let runF = Math.min(1, hspd / 7.9);
  let fovWant = 74 + clamp((hspd - 5.4) * 1.1, 0, 5) + (me.sliding ? clamp((hspd - 6) * 1.8, 3, 9) : 0) - (wipeT >= 0 ? 1.2 : 0);
  camera.fov += (fovWant - camera.fov) * (1 - Math.exp(-7 * dt));
  camera.updateProjectionMatrix();

  let bobOff = 0;
  if (me.onFloor && hspd > 0.5) {
    me.bob += dt * hspd * 1.75;
    bobOff = Math.sin(me.bob * 2) * 0.02 * Math.min(1, hspd / 5.4);
  }
  landDip = landDip * Math.exp(-8 * dt);
  let shk = me.sliding ? Math.min(1, hspd / 9) : 0;
  camera.position.y = me.eyeY + bobOff - landDip + Math.sin(worldT * 43) * 0.006 * shk;
  camera.position.x = Math.sin(me.bob) * 0.014 * runF + Math.cos(worldT * 31) * 0.004 * shk;

  tilt = lerp(tilt, -ix * 0.012, 1 - Math.exp(-8 * dt));
  let leanTgt = 0;
  if (me.sliding) {
    let su = 1 - me.slideT / 0.85;
    leanTgt = 0.21 * Math.min(1, su * 4.5) * Math.min(1, me.slideT / 0.26);
  }
  slideLean = lerp(slideLean, leanTgt, 1 - Math.exp(-14 * dt));
  slideKick = slideKick * Math.exp(-5 * dt);
  camRig.rotation.set(slideKick, Math.PI, tilt + slideLean + Math.sin(me.bob) * 0.007 * runF + Math.sin(worldT * 37) * 0.016 * shk + wipeSway);
  speedFx.style.opacity = clamp((hspd - 7.6) / 4.2, 0, 0.45).toFixed(3);

  me.walkAcc += hspd * dt;
  if (me.walkAcc > 2.6 && me.onFloor) {
    me.walkAcc = 0;
    if (!me.crouch && !me.sliding) {
      sfx.step();
      if (hspd > 7) puffDust(me.pos.x, me.pos.y, me.pos.z, 1, false);
    }
  }
  //done!
  camera.getWorldDirection(tmpVec);
  let bodyYaw = Math.atan2(tmpVec.x, tmpVec.z) - camRig.rotation.y;
  myLegs.g.rotation.set(0, bodyYaw, 0);
  myArms.g.rotation.set(0, bodyYaw, 0);
  let ph = me.bob * 2;
  let swing = Math.min(1, hspd / 5.4);
  if (me.sliding) {
    let su = 1 - me.slideT / 0.85;
    let vib = Math.sin(worldT * 40) * 0.03 * shk;
    myLegs.leftLeg.rotation.x = -1.02 + 0.1 * su + vib;
    myLegs.rightLeg.rotation.x = -0.8 - 0.12 * su - vib;
    myLegs.leftLeg.rotation.z = 0.12;
    myLegs.rightLeg.rotation.z = -0.12;
    myArms.armL.rotation.x = 0.5 + 0.15 * su + vib * 0.6;
    myArms.armR.rotation.x = -0.4 - 0.12 * su - vib * 0.6;
  } else if (!me.onFloor) {
    let goingUp = me.vy > 0;
    myLegs.leftLeg.rotation.x = goingUp ? -0.55 : -0.2;
    myLegs.rightLeg.rotation.x = goingUp ? -0.15 : 0.15;
    myLegs.leftLeg.rotation.z = 0;
    myLegs.rightLeg.rotation.z = 0;
    myArms.armL.rotation.x = goingUp ? -0.5 : 0.35;
    myArms.armR.rotation.x = goingUp ? -0.5 : 0.35;
  } else {
    let l = Math.sin(ph);
    myLegs.leftLeg.rotation.x = l * 0.6 * swing;
    myLegs.rightLeg.rotation.x = -l * 0.6 * swing;
    myLegs.leftLeg.rotation.z = 0;
    myLegs.rightLeg.rotation.z = 0;
    myArms.armL.rotation.x = -l * 0.45 * swing;
    myArms.armR.rotation.x = l * 0.45 * swing;
  }
}


addEventListener('keydown', function (e) {
  if (e.code === 'Space') e.preventDefault();
  keysDown[e.code] = true;
  if (e.code === 'KeyR' && wipeT < 0 && wipeDelay <= 0) {
    wipeDelay = 0.12;
  }
  if (e.code === 'Enter' && !controls.isLocked) {
    sfx.boot();
    controls.lock();
  }
});

addEventListener('keyup', function (e) {
  keysDown[e.code] = false;
});

addEventListener('blur', function () {
  keysDown = {};
});

addEventListener('resize', function () {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

getById('startBtn').addEventListener('click', function () {
  sfx.boot();
  controls.lock();
});

getById('resumeBtn').addEventListener('click', function () {
  sfx.boot();
  controls.lock();
});

controls.addEventListener('lock', function () {
  getById('menuScreen').classList.add('hidden');
  getById('pauseMenu').classList.add('hidden');
  isPaused = false;
  keysDown = {};
  if (!started) {
    started = true;
    getById('tipText').classList.add('show');
    setTimeout(function () {
      getById('tipText').classList.remove('show');
    }, 5000);
  }
});

controls.addEventListener('unlock', function () {
  if (!started) return;
  isPaused = true;
  keysDown = {};
  getById('pauseMenu').classList.remove('hidden');
});

let gameClock = new THREE.Clock();

function gameLoop() {
  requestAnimationFrame(gameLoop);
  let dt = Math.min(gameClock.getDelta(), 0.05);
  worldT += dt;
  if (controls.isLocked && !isPaused) {
    movePlayer(dt);
  }
  stepDust(dt);
  stepSkids(dt);
  updateDustFx(dt);
  stepClouds(dt);
  stepBirds(dt, worldT);
  let shx = Math.round(me.pos.x / 2) * 2;
  let shz = Math.round(me.pos.z / 2) * 2;
  shadowTarget.position.set(shx, 0, shz);
  sun.position.set(shx + 55, 85, shz - 25);
  renderer.render(scene, camera);
}

gameLoop();

window.dl = {
  renderer: renderer, scene: scene, camera: camera, camRig: camRig, me: me,
  controls: controls, wallList: wallList, floorAt: floorAt, hitsWall: hitsWall,
  sun: sun, shadowTarget: shadowTarget, wipeArm: wipeArm,
  dustAmt: function () { return dustAmt; },
  key: function (c, d) { keysDown[c] = d; },
  wipeNow: function () { if (wipeT < 0 && wipeDelay <= 0) wipeDelay = 0.1; },
  tick: function (dt) { movePlayer(dt); stepDust(dt); stepSkids(dt); updateDustFx(dt); },
  isOn: function () { return controls.isLocked && !isPaused; }
};
