async function loadStats() {
  const res = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?output=csv");
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  let data = rows
    .slice(1) // skip header row
    .map(row => ({
      name: row[11],
      points: Number(row[12]),
      quizzes: Number(row[13])
    }))
    .filter(r => r.name); // remove blanks

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
