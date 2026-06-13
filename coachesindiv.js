const START_ROW = 1;
const END_ROW = 70;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  // L → BA (11 → 53)
  const header = rows[0].slice(11, 53);

  const data = rows
    .slice(START_ROW, END_ROW)
    .map(row => row.slice(11, 53))
    .filter(row => row.some(cell => cell));

  render(header, data);
}

function render(header, data) {
  const headerHTML = `
    <tr>
      ${header.map(h => `<th>${h}</th>`).join("")}
    </tr>
  `;

  const body = data.map(row => `
    <tr>
      ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
    </tr>
  `).join("");

  document.getElementById("individual-stats").innerHTML = `
    <table>
      <thead>${headerHTML}</thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

loadStats();
setInterval(loadStats, 60000);
