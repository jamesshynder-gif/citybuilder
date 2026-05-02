import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';
export class TrafficSystem {
  constructor(scene, grid) { this.scene = scene; this.grid = grid; this.group = new THREE.Group(); this.cars = []; }
  spawnCar() {
    const roads = [...this.grid.roads]; if (!roads.length) return;
    const [cx, cz] = roads[Math.floor(Math.random()*roads.length)].split(',').map(Number);
    const car = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 2), new THREE.MeshStandardMaterial({ color: 0x00ccff }));
    car.position.set(cx*4, 0.7, cz*4); this.group.add(car);
    this.cars.push({ mesh: car, dir: new THREE.Vector3(1,0,0), speed: 3 + Math.random() * 2 });
  }
  update(dt) {
    if (Math.random() < 0.02 && this.cars.length < 40) this.spawnCar();
    this.cars.forEach((c) => {
      c.mesh.position.addScaledVector(c.dir, c.speed * dt);
      if (Math.random() < 0.02) c.dir.applyAxisAngle(new THREE.Vector3(0,1,0), (Math.random() > 0.5 ? 1 : -1) * Math.PI/2);
    });
  }
}
