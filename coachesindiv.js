const START_ROW = 88;
const END_ROW = 156;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadIndivStats() {
  const cacheBuster = Date.now() + Math.random();
  const url = SHEET_URL + `&cachebust=${cacheBuster}`;
  
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  const text = await res.text();

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split(","))
    .filter(row => Array.isArray(row) && row.length > 1);

  // L → BA (11 → 53)
  const header = rows[87].slice(11, 28);

  const data = rows
    .slice(START_ROW, END_ROW)
    .map(row => {
      if (!Array.isArray(row)) return [];
      return row.slice(11, 28);
    })
    .filter(row => Array.isArray(row) && row.some(cell => cell && cell !== ""));

  renderIndiv(header, data);
}

function renderIndiv(header, data) {
  const headerRow = `
    <tr>
      ${header.map(cell => `<th>${cell ?? ""}</th>`).join("")}
    </tr>
  `;

  const body = data
    .map(row => `
      <tr>
        ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
      </tr>
    `)
    .join("");

  document.getElementById("individual-stats").innerHTML = `
    <table>
      <thead>${headerRow}</thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function toggleIndividualStats() {
  const section = document.querySelector(".individual-section");
  const table = document.getElementById("individual-stats");
  const btn = document.getElementById("toggle-individual-btn");
  
  if (table.style.display === "none") {
    table.style.display = "block";
    btn.textContent = "▼ Individual Stats";
  } else {
    table.style.display = "none";
    btn.textContent = "► Individual Stats";
  }
}

loadIndivStats();
setInterval(loadIndivStats, 600000);
