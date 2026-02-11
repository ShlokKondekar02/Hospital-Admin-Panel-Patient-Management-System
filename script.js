const form = document.getElementById("patientForm");
const tableBody = document.getElementById("tableBody");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const countText = document.getElementById("count");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const departmentInput = document.getElementById("department");

let patients = JSON.parse(localStorage.getItem("patients")) || [];
let imageData = "";
let editingIndex = null;

/* Capitalize name */
nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/\b\w/g, c => c.toUpperCase());
});

/* Image Preview */
photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        imageData = reader.result;
        preview.src = imageData;
        preview.style.display = "block";
    };
    reader.readAsDataURL(file);
});

/* Render Table */
function renderTable() {
    tableBody.innerHTML = "";

    patients.forEach((patient, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td><img src="${patient.image}"></td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.department}</td>
            <td>
                <button class="action-btn edit" data-index="${index}">Edit</button>
                <button class="action-btn delete" data-index="${index}">Delete</button>
            </td>
        `;
    });

    countText.innerText = `Total Patients: ${patients.length}`;
    localStorage.setItem("patients", JSON.stringify(patients));
}

/* Save Patient */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (ageInput.value <= 0 || ageInput.value > 120) {
        alert("Please enter a valid age");
        return;
    }

    const patient = {
        name: nameInput.value,
        age: ageInput.value,
        department: departmentInput.value,
        image: imageData || "https://via.placeholder.com/150"
    };

    if (editingIndex !== null) {
        patients[editingIndex] = patient;
        editingIndex = null;
    } else {
        patients.push(patient);
    }

    form.reset();
    preview.style.display = "none";
    imageData = "";

    renderTable();
});

/* Edit & Delete */
tableBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("delete")) {
        if (confirm("Are you sure you want to delete this patient record?")) {
            patients.splice(index, 1);
            renderTable();
        }
    }

    if (e.target.classList.contains("edit")) {
        const patient = patients[index];

        nameInput.value = patient.name;
        ageInput.value = patient.age;
        departmentInput.value = patient.department;

        imageData = patient.image;
        preview.src = imageData;
        preview.style.display = "block";

        editingIndex = index;
    }
});

/* Initial Load */
renderTable();
