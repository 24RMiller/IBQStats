const START_ROWT = 72;
const END_ROWT = 86;

const SHEET_URLT =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URLT + "&t=" + Date.now());
  const text = await res.text();

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split(","))
    .filter(row => Array.isArray(row) && row.length > 1);

  const data = rows
    .slice(START_ROWT - 1, END_ROWT)
    .map(row => {
      if (!Array.isArray(row)) return [];
      // Get columns 11-12 (indices 11-12) and 14-25 (indices 14-25), skipping column 13 (index 13)
      return [...row.slice(11, 13), ...row.slice(14, 26)];
    })
    .filter(row => Array.isArray(row) && row.length > 0 && row[0]);

  render(data);
}

function render(data) {
  document.getElementById("team-stats").innerHTML = `
    <table>
      ${data.map(row => {
        if (!Array.isArray(row)) return '';
        return `
        <tr>
          ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
        </tr>
      `;
      }).join("")}
    </table>
  `;
}

function toggleTeamStats() {
  const table = document.getElementById("team-stats");
  const btn = document.getElementById("toggle-team-btn");
  
  if (table.style.display === "none") {
    table.style.display = "block";
    btn.textContent = "▼ Team Stats";
  } else {
    table.style.display = "none";
    btn.textContent = "► Team Stats";
  }
}

// initial load
loadStats();

// auto-refresh every 60 seconds
setInterval(loadStats, 60000);
