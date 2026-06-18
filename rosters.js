const DOC_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?gid=1204008329&single=true&output=csv";

const ROS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxrVRVkdMhenEIf_MA6dfUbDmMh_RIV5sLtaELe4dJHqvfDFO_FX-sSDEniujhf2tsD3y731Y4KDdt/pub?gid=2087095678&single=true&output=csv";

const eventDates = [
  "July 13",
  "July 14",
  "July 15",
  "July 16",
  "July 17",
  "July 18"
];

/* -----------------------------
   SAFE CSV PARSER
----------------------------- */
function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(r => r.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
}

/* -----------------------------
   SCHEDULE
----------------------------- */
async function loadSchedule() {
  const res = await fetch(DOC_URL);
  const text = await res.text();

  const rows = parseCSV(text);

  const body = rows
    .slice(0, 59)
    .map(row => {
      const firstCell = row[0] ?? "";

      const isEventDate = eventDates.some(date =>
        firstCell.includes(date)
      );

      const style = isEventDate
        ? 'style="font-weight:bold; text-align:center;"'
        : "";

      return `<tr><td ${style}>${firstCell}</td></tr>`;
    })
    .join("");

  document.getElementById("schedule").innerHTML = `
    <table>
      <tbody>${body}</tbody>
    </table>
  `;
}

/* -----------------------------
   ROSTERS
----------------------------- */
const ROS_START_ROW = 1;
const ROS_END_ROW = 15;

async function loadRoster() {
  const res = await fetch(ROS_SHEET_URL);
  const text = await res.text();

  const rows = parseCSV(text).filter(r => r.length > 1);

  const cleanRow = row =>
    row.slice(0, 9).filter((_, i) => i !== 1); // remove 2nd column

  const header = cleanRow(rows[0] || []);

  const data = rows
    .slice(ROS_START_ROW, ROS_END_ROW)
    .map(cleanRow)
    .filter(row => row.some(cell => cell && cell !== ""));

  renderRoster(header, data);
}

function renderRoster(header, data) {
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

/* -----------------------------
   INIT
----------------------------- */
loadSchedule();
loadRoster();

setInterval(() => {
  loadSchedule();
  loadRoster();
}, 60000);
