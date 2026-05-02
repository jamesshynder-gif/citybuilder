import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';
export class EmergencySystem {
  constructor(scene, grid, traffic) { this.scene = scene; this.grid = grid; this.traffic = traffic; this.group = new THREE.Group(); this.events = []; this.enabled = true; }
  update(dt) {
    if (!this.enabled) return;
    if (Math.random() < 0.01 && this.grid.buildings.length) {
      const target = this.grid.buildings[Math.floor(Math.random() * this.grid.buildings.length)];
      this.events.push({ target, kind: ['crime','fire','medical'][Math.floor(Math.random()*3)], resolved: false });
      this.dispatch(this.events[this.events.length-1]);
    }
    this.events = this.events.filter((e) => !e.resolved);
    this.group.children.forEach((v) => {
      const to = v.userData.target.position.clone().sub(v.position); const dist = to.length();
      if (dist < 0.5) v.userData.event.resolved = true;
      v.position.addScaledVector(to.normalize(), dt * 6);
    });
  }
  dispatch(event) {
    const color = event.kind === 'fire' ? 0xff0000 : event.kind === 'crime' ? 0x0000ff : 0xffffff;
    const v = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2), new THREE.MeshStandardMaterial({ color }));
    const station = this.grid.buildings.find((b) => (event.kind === 'fire' && b.type === 'fire') || (event.kind === 'crime' && b.type === 'police') || (event.kind === 'medical' && b.type === 'ems'));
    v.position.copy(station ? station.mesh.position : new THREE.Vector3(0, 1, 0));
    v.userData = { target: event.target.mesh, event };
    this.group.add(v);
  }
}
