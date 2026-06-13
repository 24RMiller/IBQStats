const START_ROW = 73;
const END_ROW = 86;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  const data = rows
    .slice(START_ROW - 1, END_ROW)
    .map(row => row.slice(11, 26)) // L through Z
    .filter(row => row[0]); // remove blank names

  render(data);
}

function render(data) {
  const headers = Array.from(
    { length: 15 },
    (_, i) => `<th>Stat ${i + 1}</th>`
  ).join("");

  document.getElementById("table").innerHTML = `
    <table>
      <tr>${headers}</tr>

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
