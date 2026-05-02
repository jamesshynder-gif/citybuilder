export class ResourceSystem {
  constructor() {
    this.money = 50000;
    this.population = 0;
    this.power = 100;
    this.water = 100;
    this.listeners = [];
  }
  spend(amount) { if (this.money < amount) return false; this.money -= amount; this.emit(); return true; }
  addPopulation(n) { this.population += n; this.emit(); }
  applyServiceLoad(power, water) { this.power -= power; this.water -= water; this.emit(); }
  tick() { this.money += Math.max(1, Math.floor(this.population / 200)); this.power = Math.max(this.power, 0); this.water = Math.max(this.water, 0); }
  onChange(cb) { this.listeners.push(cb); cb(this); }
  emit() { this.listeners.forEach((cb) => cb(this)); }
}
