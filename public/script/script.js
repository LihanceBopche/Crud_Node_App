
const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const payload = JSON.parse(atob(token.split(".")[1]));
userEmail.innerText = "Logged in as: " + payload.email;

const popup = document.getElementById("popup");
const courses = document.getElementById("courses");
const fees = document.getElementById("fees");
const rollno = document.getElementById("rollno");
const nameInp = document.getElementById("name");

// STUDENTS
fetch("/api/students/list", { headers: { Authorization: "Bearer " + token } })
    .then(r => r.json()).then(d => {
        studentTable.innerHTML = "";
        d.forEach(s => {
            studentTable.innerHTML += `
      <tr>
        <td>${s.student_id}</td>
        <td>${s.name}</td>
        <td>${s.rollno}</td>
        <td>${s.courses}</td>
        <td>₹${s.total_fees}</td>
        <td>
  <span class="action" onclick="editStudent(${s.student_id})">✏️</span>
  <span class="action" onclick="deleteStudent(${s.student_id})">❌</span>
  <span class="action" onclick="printInvoice(${s.student_id})">🖨️</span>

</td>

      </tr>`;
        });
    });

// POPUP
function openPopup() {
    popup.style.display = "block";
    loadCourses();
    loadRoll();
}
function closePopup() { popup.style.display = "none" }

// COURSES
function loadCourses() {
    fetch("/api/courses", { headers: { Authorization: "Bearer " + token } })
        .then(r => r.json()).then(d => {
            courses.innerHTML = "";
            d.forEach(c => {
                courses.innerHTML +=
                    `<option value="${c.course_id}" data-fee="${c.fees}">
        ${c.course_name} (₹${c.fees})
      </option>`;
            });
        });
}


// ROLL
function loadRoll() {
    fetch("/api/students/next-roll", { headers: { Authorization: "Bearer " + token } })
        .then(r => r.json()).then(d => rollno.value = d.rollno);
}

// FEES
courses.addEventListener("change", () => {
    let t = 0;
    [...courses.selectedOptions].forEach(o => t += +o.dataset.fee);
    fees.value = t;
});

// Add student
function saveStudent() {
    const ids = [...courses.selectedOptions].map(o => o.value);
    fetch("/api/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ name: nameInp.value, courseIds: ids })
    })
        .then(r => r.json())
        .then(d => { alert(d.message); location.reload(); });
}
let editStudentId = null;


// EDIT
function editStudent(id) {
    editStudentId = id;
    popup.style.display = "block";
    loadCourses();

    fetch(`/api/update-student/${id}`, {
        headers: { Authorization: "Bearer " + token }
    })
        .then(r => r.json())
        .then(data => {
            nameInp.value = data.name;
            rollno.value = data.rollno;

            setTimeout(() => {
                [...courses.options].forEach(opt => {
                    opt.selected = data.courseIds.includes(Number(opt.value));
                });
                courses.dispatchEvent(new Event("change"));
            }, 300);
        });
}

// SAVE (Add / Update)
function saveStudent() {
    const selected = [...courses.selectedOptions].map(o => o.value);

    const url = editStudentId
        ? `/api/update-student/${editStudentId}`
        : `/api/students/add`;

    const method = editStudentId ? "PUT" : "POST";

    fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({
            name: nameInp.value,
            courseIds: selected
        })
    })
        .then(r => r.json())
        .then(d => {
            alert(d.message);
            location.reload();
        });
}

// DELETE
function deleteStudent(id) {
    if (!confirm("Are you sure to delete this student?")) return;

    fetch(`/api/delete-student/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    })
        .then(r => r.json())
        .then(d => {
            alert(d.message);
            location.reload();
        });
}

function logout() { localStorage.removeItem("token"); location.href = "login.html"; }
