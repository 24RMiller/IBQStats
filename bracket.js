const START_ROW = 1;
const END_ROW = 68;

const SHEET_URL =
 "https://docs.google.com/spreadsheets/d/e/2PACX-1vQf6QLcX92BjbDr7K1sGW_VEEuMie_-9x8Vjn3Z42Q3FMohwsgBMFXzTWPsKIiQibjDdgB5W2XBCv_S/pub?output=csv";

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

  const data = rows.slice(START_ROW - 1, END_ROW)
    .map(row => ({
      time: row[0],
      team1: row[2],
      tteam1: row[3],
      score1: row[4],
      team2: row[6],
      tteam2: row[7],
      score2: row[8],
      team3: row[10],
      tteam3: row[11],
      score3: row[12],
      
  
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
          <td>${r.tteam1}</td>
          <td>${r.score1}</td>
          <td>${r.team2}</td>
          <td>${r.tteam2}</td>
          <td>${r.score2}</td>
            <td>${r.team3}</td>
            <td>${r.tteam3}</td>
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
