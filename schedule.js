const START_ROW = 1;
const END_ROW = 126;

const SHEET_URL =
 "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0Bkhub7sC2K9gDyoFG8uJ4NWL-K4B0UZGyXle5z9BUk7O6tUJtxSBS0Rnez2L095Pc_TRFJntRBXu/pub?output=csv";

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
      time: row[0],
      team1: row[2],
      score1: row[3],
      team2: row[5],
      score2: row[6],
      team3: row[8],
      score3: row[9],
      
  
    }))


  render(data);
}

function render(data) {
  document.getElementById("table").innerHTML = `
    <table id="scoreboard">

      ${data.map((r, i) => `
        <tr>
          <td>${r.time}</td>
          <td>${r.team1}</td>
          <td>${r.score1}</td>
          <td>${r.team2}</td>
          <td>${r.score2}</td>
            <td>${r.team3}</td>
          <td>${r.score3}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// initial load
loadStats();

// auto-refresh every 60 seconds
setInterval(loadStats, 180000);
