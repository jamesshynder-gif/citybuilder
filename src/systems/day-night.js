import * as THREE from 'https://esm.sh/three@0.164.1';
export class DayNightCycle {
  constructor(scene, sun, ambient) { this.scene = scene; this.sun = sun; this.ambient = ambient; this.time = 0; }
  update(dt) {
    this.time += dt * 0.03;
    const angle = this.time * Math.PI * 2;
    this.sun.position.set(Math.cos(angle) * 70, Math.sin(angle) * 70, 30);
    const k = Math.max(0.15, Math.sin(angle) * 0.7 + 0.3);
    this.sun.intensity = k * 1.4; this.ambient.intensity = k * 0.5;
    this.scene.background = new THREE.Color().setHSL(0.58, 0.6, 0.15 + k * 0.5);
  }
}
