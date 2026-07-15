const START_ROW = 3;
const END_ROW = 70;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv";

async function loadStats() {
  const cacheBuster = Date.now() + Math.random();
  const url = SHEET_URL + `&cachebust=${cacheBuster}`;
  
  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  // ✅ THIS correctly limits sheet rows 73–86
  const data = rows.slice(START_ROW - 1, END_ROW)
    .map(row => ({
      name: row[11],              // Column L
      points: Number(row[12]),    // Column M
      quizzes: Number(row[52])    // Column N
    }))
    .filter(r => r.name); // remove blanks

  // sort highest points first
  data.sort((a, b) => b.points - a.points);

  render(data);
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table>
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Points</th>
        <th>Quizzes</th>
      </tr>

      ${data.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
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
