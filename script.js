const START_ROW = 3;
const END_ROW = 16;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split(","));

  const BB = 53;
  const BC = 54;
  const BD = 55;

  const data = rows
    .slice(START_ROW - 1, END_ROW) // rows 3–16 correctly
    .map(row => ({
      col1: row[BB],
      col2: row[BC],
      col3: Number(row[BD])
    }))
    .filter(r => r.col1); // remove blanks

  data.sort((a, b) => b.col3 - a.col3);

  render(data);
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table>
      <tr>
        <th>Column BB</th>
        <th>Column BC</th>
        <th>Column BD</th>
      </tr>

      ${data.map(r => `
        <tr>
          <td>${r.col1}</td>
          <td>${r.col2}</td>
          <td>${r.col3}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

loadStats();
setInterval(loadStats, 60000);
