const START_ROW = 3;
const END_ROW = 70;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  const data = rows
    .slice(START_ROW - 1, END_ROW)
    .map(row => row.slice(11, 53)); // L through BA

  render(data);
}

function render(data) {
  const numCols = 42; // L through BA

  const headers = Array.from(
    { length: numCols },
    (_, i) => `<th>Col${i + 1}</th>`
  ).join("");

  const body = data.map(row => `
    <tr>
      ${row.map(cell => `<td>${cell}</td>`).join("")}
    </tr>
  `).join("");

  document.getElementById("individual-stats").innerHTML = `
    <table>
      <thead>
        <tr>${headers}</tr>
      </thead>
      <tbody>
        ${body}
      </tbody>
    </table>
  `;
}

loadStats();
setInterval(loadStats, 60000);
