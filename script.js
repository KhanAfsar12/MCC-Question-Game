const names = JSON.parse(localStorage.getItem("names")) || [
  "Owais",
  "Anas Khan",
  "Shajeb",
  "Malik",
  "Uzair",
  "Ali",
  "Sameer",
  "Dawood",
  "Bipin",
  "Nagma",
  "Juned",
  "Shamsuddin",
];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin");
const resetButton = document.getElementById("reset");
const addNameButton = document.getElementById("add-name");
const nameInput = document.getElementById("name-input");
const selectedName = document.getElementById("selected-name");
const nameList = document.getElementById("name-list");

let startAngle = 0;
const arc = Math.PI / (names.length / 2);
let spinTimeout = null;
let isSpinning = false;

// Draw wheel
function drawWheel() {
  const wheelRadius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  names.forEach((name, i) => {
    const angle = startAngle + i * arc;
    ctx.fillStyle = i % 2 === 0 ? "#FF5733" : "#33C4FF";
    ctx.beginPath();
    ctx.moveTo(wheelRadius, wheelRadius);
    ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + arc, false);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(
      wheelRadius + Math.cos(angle + arc / 2) * wheelRadius / 1.5,
      wheelRadius + Math.sin(angle + arc / 2) * wheelRadius / 1.5
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(name, -ctx.measureText(name).width / 2, 0);
    ctx.restore();
  });
}

// Rotate wheel
function rotateWheel() {
  if (!isSpinning) return;
  startAngle += Math.PI / 40;
  drawWheel();
  spinTimeout = requestAnimationFrame(rotateWheel);
}

// Stop the wheel and pick a random name
function stopWheel() {
  isSpinning = false;
  cancelAnimationFrame(spinTimeout);
  const winningIndex = Math.floor(names.length - (startAngle % (2 * Math.PI)) / arc) % names.length;
  selectedName.textContent = `Selected: ${names[winningIndex]}`;
}

// Add new name
addNameButton.addEventListener("click", () => {
  const newName = nameInput.value.trim();
  if (newName && !names.includes(newName)) {
    names.push(newName);
    localStorage.setItem("names", JSON.stringify(names));
    nameInput.value = "";
    updateNameList();
    drawWheel();
  }
});

// Reset the wheel
resetButton.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

// Update name list
function updateNameList() {
  nameList.innerHTML = names.map((name, index) =>
    `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${name}
      <button class="btn btn-danger btn-sm" onclick="removeName(${index})">❌</button>
    </li>`
  ).join("");
}

// Remove a name
function removeName(index) {
  names.splice(index, 1);
  localStorage.setItem("names", JSON.stringify(names));
  updateNameList();
  drawWheel();
}

// Event listener for spinning
spinButton.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  rotateWheel();
  setTimeout(stopWheel, 3000);
});

// Initialize
updateNameList();
drawWheel();
