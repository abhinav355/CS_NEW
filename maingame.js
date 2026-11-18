import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

console.log('dustline loading... (map update)');

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
scene.fog = new THREE.Fog(0xd8cfb4, 60, 210);

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

scene.add(new THREE.HemisphereLight(0xbfd6ea, 0x9a8a68, 0.9));

let sun = new THREE.DirectionalLight(0xffeecf, 2.3);
sun.position.set(55, 85, -25);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -85;
sun.shadow.camera.right = 85;
sun.shadow.camera.top = 85;
sun.shadow.camera.bottom = -85;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 260;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun);

let tmpVec = new THREE.Vector3();
let fwd = new THREE.Vector3();
let right = new THREE.Vector3();
let wish = new THREE.Vector3();
let tmpQuat = new THREE.Quaternion();

let wallList = [];

function rampHeight(w, x, z) {
  let p = w.ramp.ax === 'x' ? x : z;
  let t = clamp((p - w.ramp.a0) / (w.ramp.a1 - w.ramp.a0), 0, 1);
  return w.ramp.h0 + (w.ramp.h1 - w.ramp.h0) * t;
}

function hitsWall(x, z, feetY, h) {
  let R = 0.4;
  for (let i = 0; i < wallList.length; i++) {
    let w = wallList[i];
    if (x + R > w.x0 && x - R < w.x1 && z + R > w.z0 && z - R < w.z1) {
      let top = w.ramp ? rampHeight(w, x, z) : w.y1;
      if (top > feetY + 0.55 && w.y0 < feetY + h) return true;
    }
  }
  return false;
}

function floorAt(x, z, feetY) {
  let g = 0;
  for (let i = 0; i < wallList.length; i++) {
    let w = wallList[i];
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
    crateGeos[k] = new THREE.BoxGeometry(sz, h, sz);
  }
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
  let hh = h - 2.6;
  let m = new THREE.Mesh(
    new THREE.BoxGeometry(w, hh, d),
    makeMat(texs.sandstone, Math.max(w, d) / 3, hh / 3)
  );
  m.position.set((x0 + x1) / 2, 2.6 + hh / 2, (z0 + z1) / 2);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  pushWall(x0, x1, z0, z1, 2.6, h);
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

  addWall(-9, -28, -7, 30, 5, 0, 'sandstone');
  addCap(-9, -28, -7, 30, 5);
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
  addWall(-34, -12, -14, -10, 5, 0, 'sandstone');
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

  //nov 18 update market row down 
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
  addBarrel(31.3, 40.7);
  addBarrel(2, -42);
  addBarrel(2.7, -41.2);
  addBarrel(-12.5, -41);
  addBarrel(-11.7, -40.2);
  addBarrel(20, -42);
  addBarrel(-41, 16);
  addBarrel(-40.2, 16.8);
  addBarrel(-41, -30);
  addBarrel(-40.2, -29.2);
  addBarrel(42.5, 28);
  addBarrel(41.8, 28.8);
  addBarrel(40, -36, 1.1);
  addBarrel(31, -38, 1.1);
  addBarrel(-33, -24, 0.9);
  addCrate(-42, -38, 2.2);
  addCrate(-41, 24, 2.0);

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

function addLamp(x, y, z, i, d) {
  let l = new THREE.PointLight(0xffb066, i, d, 2);
  l.position.set(x, y, z);
  scene.add(l);
}
addLamp(-39, 3.2, 12, 6, 16);
addLamp(-39, 3.2, -4, 6, 16);
addLamp(-29, 3.6, -30, 5, 20);
addLamp(36, 3.6, -27, 4, 20);
addLamp(0, 3.4, 40, 5, 18);


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

  //sounds ok to me  --tome --(Rs check your notebook)
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
    land: function () { hiss(240, 0.2, 0.1); }
  };
})();


let me = {
  pos: new THREE.Vector3(0, 0, -40),
  vel: new THREE.Vector3(),
  vy: 0,
  onFloor: true,
  crouch: false,
  eyeY: 1.62,
  bob: 0,
  walkAcc: 0
};

let keysDown = {};

let isPaused  = false;
let started   = false;

let tilt = 0;

let landDip = 0;

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


function movePlayer(dt) {
  let ix = 0;
  let iz = 0;
  if (keysDown.KeyW) iz += 1;
  if (keysDown.KeyS) iz -= 1;
  if (keysDown.KeyA) ix -= 1;
  if (keysDown.KeyD) ix += 1;

  let sneaking = keysDown.ShiftLeft || keysDown.ShiftRight;
  me.crouch = keysDown.KeyC ? true : false;

  let spd = 5.4;
  if (me.crouch) {
    spd = spd * 0.34;
  } else if (sneaking) {
    spd = spd * 0.45;
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

  let push = me.onFloor ? 12 : 2.5;
  let k = 1 - Math.exp(-push * dt);
  me.vel.x += (wish.x - me.vel.x) * k;
  me.vel.z += (wish.z - me.vel.z) * k;

  if (keysDown.Space && me.onFloor) {
    me.vy = 5.9;
    me.onFloor = false;
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
      landDip = 0.1;
    }
    me.pos.y = gnd;
    me.vy = 0;
    me.onFloor = true;
  } else if (me.onFloor && me.pos.y - gnd > 0.05) {
    me.onFloor = false;
  }

  camRig.position.copy(me.pos);

  let eyeWant = me.crouch ? 1.15 : 1.62;
  me.eyeY += (eyeWant - me.eyeY) * (1 - Math.exp(-10 * dt));

  let hspd = Math.hypot(me.vel.x, me.vel.z);
  let bobOff = 0;
  if (me.onFloor && hspd > 0.5) {
    me.bob += dt * hspd * 1.75;
    bobOff = Math.sin(me.bob * 2) * 0.02 * Math.min(1, hspd / 5.4);
  }
  landDip = landDip * Math.exp(-8 * dt);
  camera.position.y = me.eyeY + bobOff - landDip;

  tilt = lerp(tilt, -ix * 0.012, 1 - Math.exp(-8 * dt));
  camRig.rotation.set(0, Math.PI, tilt);

  me.walkAcc += hspd * dt;
  if (me.walkAcc > 2.6 && me.onFloor) {
    me.walkAcc = 0;
    if (!sneaking && !me.crouch) sfx.step();
  }

  //legs turn with the camera this took me way too long to figre out
  camera.getWorldDirection(tmpVec);
  myLegs.g.rotation.set(0, Math.atan2(tmpVec.x, tmpVec.z) - camRig.rotation.y, 0);
  let swing = Math.min(1, hspd / 5.4);
  myLegs.leftLeg.rotation.x = Math.sin(me.bob * 2) * 0.6 * swing;
  myLegs.rightLeg.rotation.x = -Math.sin(me.bob * 2) * 0.6 * swing;
}


addEventListener('keydown', function (e) {
  if (e.code === 'Space') e.preventDefault();
  keysDown[e.code] = true;
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
  if (controls.isLocked && !isPaused) {
    movePlayer(dt);
  }
  renderer.render(scene, camera);
}

gameLoop();
