import * as THREE from 'https://esm.sh/three@0.164.1';
import { OrbitControls } from 'https://esm.sh/three@0.164.1/examples/jsm/controls/OrbitControls.js';
import { buildUI } from './ui/ui.js';
import { ResourceSystem } from './systems/resources.js';
import { CityGrid } from './systems/city-grid.js';
import { TrafficSystem } from './systems/traffic.js';
import { EmergencySystem } from './systems/emergency.js';
import { DayNightCycle } from './systems/day-night.js';


window.addEventListener('error', (err) => {
  const ui = document.getElementById('ui');
  ui.innerHTML = `<div class='panel'><h3>Startup Error</h3><p>${err.message}</p></div>`;
});

const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b7ff);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const ambient = new THREE.AmbientLight(0xffffff, 0.3); scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.castShadow = true;
sun.position.set(30, 50, 20); scene.add(sun);

const terrainGeo = new THREE.PlaneGeometry(200, 200, 64, 64);
terrainGeo.rotateX(-Math.PI / 2);
for (let i = 0; i < terrainGeo.attributes.position.count; i++) {
  const x = terrainGeo.attributes.position.getX(i);
  const z = terrainGeo.attributes.position.getZ(i);
  terrainGeo.attributes.position.setY(i, Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5);
}
terrainGeo.computeVertexNormals();
const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ color: 0x4f8d46 }));
terrain.receiveShadow = true; scene.add(terrain);

const water = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x2f6fff, transparent: true, opacity: 0.45 }));
water.rotation.x = -Math.PI / 2; water.position.y = 0.5; scene.add(water);

const resources = new ResourceSystem();
const grid = new CityGrid(scene, resources);
const traffic = new TrafficSystem(scene, grid);
const emergency = new EmergencySystem(scene, grid, traffic);
const dayNight = new DayNightCycle(scene, sun, ambient);

buildUI({ resources, grid, emergency });

scene.add(grid.roadsGroup, grid.buildingsGroup, traffic.group, emergency.group);

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
});

renderer.domElement.addEventListener('click', (e) => grid.handlePlacement(e, camera, renderer));

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.016;
  water.material.opacity = 0.35 + Math.sin(t * 2) * 0.1;
  water.position.y = 0.55 + Math.sin(t * 1.5) * 0.05;
  resources.tick();
  traffic.update(0.016);
  emergency.update(0.016);
  dayNight.update(0.016);
  renderer.render(scene, camera);
}
animate();
