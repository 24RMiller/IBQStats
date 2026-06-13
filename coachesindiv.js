const START_ROW = 88;
const END_ROW = 156;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split(","))
    .filter(row => Array.isArray(row) && row.length > 1);

  // L → BA (11 → 53)
  const header = rows[0].slice(11, 25);

  const data = rows
    .slice(START_ROW, END_ROW)
    .map(row => {
      if (!Array.isArray(row)) return [];
      return row.slice(11, 25);
    })
    .filter(row => Array.isArray(row) && row.some(cell => cell && cell !== ""));

  render(header, data);
}

function render(header, data) {

  const body = data
    .map(row => `
      <tr>
        ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
      </tr>
    `)
    .join("");

  document.getElementById("individual-stats").innerHTML = `
    <table>
      <tbody>${body}</tbody>
    </table>
  `;
}

loadStats();
setInterval(loadStats, 60000);
