const START_ROW = 17;
const END_ROW = 84;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa5Yhm_IQfR71GK8ILUTaNPk_YcDA1LEA75bdhkBTKQmrF_1vDcUVQ-XrwOkgP94ieJGzAN7bxglVE/pub?output=csv";

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
  const header = rows[16].slice(0, 18);

  const data = rows
    .slice(START_ROW, END_ROW)
    .map(row => {
      if (!Array.isArray(row)) return [];
      return row.slice(0, 18);
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
setInterval(loadIndivStats, 60000);
