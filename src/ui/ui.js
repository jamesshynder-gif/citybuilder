const tools = ['road','house','shop','power','police','fire','ems'];
export function buildUI({ resources, grid, emergency }) {
  const root = document.getElementById('ui');
  root.innerHTML = `<div class='panel'><h3>City Builder</h3><div id='stats'></div><div id='tools'></div><button id='toggle'>Emergency AI: ON</button></div>`;
  const toolsDiv = root.querySelector('#tools');
  tools.forEach((t) => { const b = document.createElement('button'); b.textContent = t; b.onclick = () => grid.setMode(t); toolsDiv.appendChild(b); });
  root.querySelector('#toggle').onclick = (e) => { emergency.enabled = !emergency.enabled; e.target.textContent = `Emergency AI: ${emergency.enabled ? 'ON' : 'OFF'}`; };
  resources.onChange((r) => {
    root.querySelector('#stats').textContent = `Money: $${r.money} | Pop: ${r.population} | Power: ${r.power} | Water: ${r.water}`;
  });
}
