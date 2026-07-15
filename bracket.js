const START_ROW = 1;
const END_ROW = 68;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzt9WZGlDY5oVAlEqGQ5V2Ovw5XAEz3GyfaueVvXA7kbxOYKtPu5xNYhS5xYNa98xW60g/exec";

async function loadStats() {
  const cacheBuster = Date.now() + Math.random();
  
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    render(data);
  } catch (error) {
    console.error('Error loading stats:', error);
    document.getElementById("table").innerHTML = '<p>Error loading data</p>';
  }
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table id="scoreboard">
      ${data.map((r, i) => `
        <tr>
          <td>${r.time}</td>
          <td>${r.team1}</td>
          <td>${r.tteam1}</td>
          <td>${r.score1}</td>
          <td>${r.team2}</td>
          <td>${r.tteam2}</td>
          <td>${r.score2}</td>
          <td>${r.team3}</td>
          <td>${r.tteam3}</td>
          <td>${r.score3}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// initial load
loadStats();

// auto-refresh every 180 seconds
setInterval(loadStats, 180000);
