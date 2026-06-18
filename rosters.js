const ROS_START_ROW = 1;
const ROS_END_ROW = 15;

const ROS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?gid=2087095678&single=true&output=csv";

async function loadRoster() {
  const res = await fetch(ROS_SHEET_URL);
  const text = await res.text();

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split(","))
    .filter(row => Array.isArray(row) && row.length > 1);

  // L → BA (11 → 53)
const header = rows[0]
  .slice(0, 9)
  .filter((_, i) => i !== 1); // remove 2nd column

  const data = rows
    .slice(ROS_START_ROW, ROS_END_ROW)
    .map(row => {
      if (!Array.isArray(row)) return [];
  return row
  .slice(0, 9)
  .filter((_, i) => i !== 1); // remove 2nd column
    })
    .filter(row => Array.isArray(row) && row.some(cell => cell && cell !== ""));

  ROSrender(header, data);
}

function ROSrender(header, data) {
  const headerRow = `
    <tr>
      ${header.map(cell => `<th>${cell ?? ""}</th>`).join("")}
    </tr>
  `;

  const body = data
    .map(row => `
      <tr>
        ${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}
      </tr>
    `)
    .join("");

  document.getElementById("rosters").innerHTML = `
    <table>
      <thead>${headerRow}</thead>
      <tbody>${body}</tbody>
    </table>
  `;
}


loadRoster();
setInterval(loadRoster, 60000);
