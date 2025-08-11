const studentNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Anaya", "Diya", "Myra", "Saanvi", "Aadhya", "Avni", "Ira", "Anika", "Aarohi", "Kiara",
  "Neha", "Riya", "Pooja", "Shruti", "Nisha", "Simran", "Kavya", "Divya", "Meera", "Tanya",
  "Rahul", "Rohan", "Karan", "Manish", "Amit", "Siddharth", "Abhishek", "Ankit", "Nikhil", "Saurabh",
  "Sneha", "Priya", "Aarti", "Shreya", "Namrata", "Tanvi", "Bhavna", "Rupal", "Ritika", "Preeti",
  "Yash", "Laksh", "Kabir", "Arnav", "Dev", "Om", "Ranveer", "Darsh", "Mihir", "Aaryan"
];

const batch1 = studentNames.slice(0, 30);
const batch2 = studentNames.slice(30);

let currentBatch = 1;
const attendanceData = {};

const studentsContainer = document.getElementById("studentsContainer");
const themeToggleBtn = document.getElementById("themeToggle");
const batch1Btn = document.getElementById("batch1Btn");
const batch2Btn = document.getElementById("batch2Btn");

// Display date and time
function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = now.toLocaleDateString(undefined, options);
  const time = now.toLocaleTimeString(undefined, { hour12: false });
  document.getElementById("dateTime").textContent = `${date} — ${time}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Theme toggling
const themes = ["", "dark", "blue"];
function getCurrentThemeIndex() {
  return themes.indexOf(document.body.className);
}
function cycleTheme() {
  let index = getCurrentThemeIndex();
  index = (index + 1) % themes.length;
  document.body.className = themes[index];
  localStorage.setItem("theme", themes[index]);
  themeToggleBtn.textContent = `Theme: ${["Light", "Dark", "Blue"][index]}`;
}
themeToggleBtn.addEventListener("click", cycleTheme);
document.body.className = localStorage.getItem("theme") || "";
themeToggleBtn.textContent = `Theme: ${["Light", "Dark", "Blue"][themes.indexOf(document.body.className)]}`;

// Render batch students
function renderBatch(batchNum) {
  currentBatch = batchNum;
  studentsContainer.innerHTML = "";

  const activeBatch = batchNum === 1 ? batch1 : batch2;
  activeBatch.forEach(name => {
    const div = document.createElement("div");
    div.className = "student";
    div.innerHTML = `
      <label for="att-${name}">${name}</label>
      <select id="att-${name}" name="${name}">
        <option value="✅ Present">✅ Present</option>
        <option value="❌ Absent">❌ Absent</option>
      </select>
    `;
    studentsContainer.appendChild(div);

    // Restore selection if exists
    const select = div.querySelector("select");
    if (attendanceData[name]) {
      select.value = attendanceData[name];
    }

    select.addEventListener("change", () => {
      attendanceData[name] = select.value;
    });
  });

  // Update button styling
  batch1Btn.classList.toggle("active", batchNum === 1);
  batch2Btn.classList.toggle("active", batchNum === 2);
}

// Initial render
renderBatch(1);

// Switch batches
batch1Btn.addEventListener("click", () => renderBatch(1));
batch2Btn.addEventListener("click", () => renderBatch(2));

// WhatsApp Submission
document.getElementById("attendanceForm").addEventListener("submit", e => {
  e.preventDefault();

  document.querySelectorAll("select").forEach(sel => {
    attendanceData[sel.name] = sel.value;
  });

  const names = currentBatch === 1 ? batch1 : batch2;
  let msg = `📝 *Attendance - Batch ${currentBatch}*\n\n`;
  names.forEach(name => {
    const status = attendanceData[name] || "❌ Absent";
    msg += `• ${name}: ${status}\n`;
  });

  const encodedMsg = encodeURIComponent(msg);
  const phone = "919004130508";
  const waLink = `https://wa.me/${phone}?text=${encodedMsg}`;
  window.open(waLink, "_blank");
});

// PDF Download
document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const batch = currentBatch === 1 ? batch1 : batch2;

  doc.setFontSize(16);
  doc.text(`Attendance Report - Batch ${currentBatch}`, 105, 10, { align: "center" });

  let y = 25;
  batch.forEach(name => {
    const status = attendanceData[name] || "❌ Absent";
    doc.text(`${name}: ${status}`, 10, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`Batch${currentBatch}_Attendance.pdf`);
});
