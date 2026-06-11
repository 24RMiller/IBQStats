const START_ROW = 73;
const END_ROW = 86;

async function loadStats() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pubhtml");
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  // Convert spreadsheet rows into usable data
  let data = [];

  for (let i = START_ROW - 1; i <= END_ROW - 1; i++) {
    const row = rows[i];
    if (!row) continue;

    data.push({
      name: row[11],        // L column (0-based index: A=0 ... L=11)
      points: row[12],         // M column
      quizzes: Number(row[13]) // N column
    });
  }

  // sort by points descending
  data.sort((a, b) => b.points - a.points);

  render(data);
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table>
      <tr><th>Name</th><th>Points</th><th>Quizzes</th></tr>
      ${data.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.points}</td>
          <td>${r.quizzes}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

loadStats();
setInterval(loadStats, 60000);
