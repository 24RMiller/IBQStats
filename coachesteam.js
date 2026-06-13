const START_ROWT = 72;
const END_ROWT = 86;

const SHEET_URLT =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URLT);
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
      return row.slice(11, 26);
    })
    .filter(row => Array.isArray(row) && row.length > 0 && row[0]);

  render(data);
}

function render(data) {
  document.getElementById("team-stats").innerHTML = `
    <table>
      ${data.map(row => `
        <tr>
          ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
        </tr>
      `).join("")}
    </table>
  `;
}

// initial load
loadStats();

// auto-refresh every 60 seconds
setInterval(loadStats, 60000);
