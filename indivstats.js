const START_ROW = 2;
const END_ROW = 68;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvAMMXea3QobsCRogjKwvEjQfqyZfeWStGqXQfOAvMCRMh54JhtgGJnWyloyCgXIxXc8A6W4eGPe8k/pub?output=csv";

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

  // ✅ THIS correctly limits sheet rows 2–68
  const data = rows.slice(START_ROW - 1, END_ROW)
    .map(row => ({
      position: row[0],
      name: row[1],              // Column B
      points: (row[2]),    // Column C
      quizzes: (row[3]),   // Column D
      accuracy: (row[6])   // Column G
    }))
    .filter(r => r.name); // remove blanks

  // sort highest points first

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
        <th>Accuracy</th>
      </tr>

      ${data.map((r, i) => `
        <tr>
          <td>${r.position}</td>
          <td>${r.name}</td>
          <td>${r.points}</td>
          <td>${r.quizzes}</td>
          <td>${r.accuracy}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

// initial load
loadStats();

// auto-refresh every 60 seconds
setInterval(loadStats, 60000000);
