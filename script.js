const START_ROW = 73;
const END_ROW = 86;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  let data = [];

  for (let i = 0; i < rows.length; i++) {
    const sheetRowNumber = i + 1; // CSV row 0 = sheet row 1

    if (sheetRowNumber < START_ROW || sheetRowNumber > END_ROW) continue;

    const row = rows[i];

    data.push({
      name: row[11],              // L
      points: Number(row[12]),    // M
      quizzes: Number(row[13])    // N
    });
  }

  // sort highest points first
  data.sort((a, b) => b.points - a.points);

  render(data);
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table>
      <tr>
        <th>Name</th>
        <th>Points</th>
        <th>Quizzes</th>
      </tr>

      ${data.map((r, i) => `
        <tr>
          <td>${r.name}</td>
          <td>${r.points}</td>
          <td>${r.quizzes}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// initial load
loadStats();

// auto-refresh every 60 seconds
setInterval(loadStats, 60000);
