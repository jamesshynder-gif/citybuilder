import * as THREE from 'https://esm.sh/three@0.164.1';
const costs = { road: 60, house: 500, shop: 850, power: 2500, police: 2000, fire: 2200, ems: 2100 };
export class CityGrid {
  constructor(scene, resources) {
    this.scene = scene; this.resources = resources; this.mode = 'road'; this.roads = new Set(); this.buildings = [];
    this.roadsGroup = new THREE.Group(); this.buildingsGroup = new THREE.Group();
    this.raycaster = new THREE.Raycaster(); this.pointer = new THREE.Vector2();
  }
  setMode(mode) { this.mode = mode; }
  toCell(p) { return `${Math.round(p.x / 4)},${Math.round(p.z / 4)}`; }
  handlePlacement(e, camera, renderer) {
    this.pointer.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, camera);
    const hit = this.raycaster.intersectObjects(this.scene.children, true).find((x) => x.object.geometry?.type.includes('Plane'));
    if (!hit) return;
    const cell = this.toCell(hit.point); const [cx, cz] = cell.split(',').map(Number); const pos = new THREE.Vector3(cx * 4, 0.1, cz * 4);
    if (!this.resources.spend(costs[this.mode] || 100)) return;
    if (this.mode === 'road') { if (this.roads.has(cell)) return; this.roads.add(cell); this.addRoad(pos); return; }
    this.addBuilding(pos, this.mode);
  }
  addRoad(pos) { const m = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 4), new THREE.MeshStandardMaterial({ color: 0x333333 })); m.position.copy(pos); this.roadsGroup.add(m); }
  addBuilding(pos, type) {
    const mats = { house: 0xa7c7e7, shop: 0xf2c572, power: 0xb0b0b0, police: 0x3366ff, fire: 0xff3f3f, ems: 0xffffff };
    const h = { house: 3, shop: 4, power: 5, police: 4, fire: 4, ems: 4 }[type] || 3;
    const m = new THREE.Mesh(new THREE.BoxGeometry(3, h, 3), new THREE.MeshStandardMaterial({ color: mats[type] || 0xffffff }));
    m.position.set(pos.x, h / 2, pos.z); m.castShadow = true; this.buildingsGroup.add(m);
    this.buildings.push({ type, mesh: m, cooldown: 0 });
    if (type === 'house') this.resources.addPopulation(20);
    if (type === 'power') this.resources.power += 40;
    if (type === 'house' || type === 'shop') this.resources.applyServiceLoad(2, 1);
  }
}
