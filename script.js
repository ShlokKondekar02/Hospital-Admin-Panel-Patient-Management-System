const form = document.getElementById("patientForm");
const patientList = document.getElementById("patientList");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const countText = document.getElementById("count");
const notifySound = document.getElementById("notifySound");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const departmentInput = document.getElementById("department");

let patients = JSON.parse(localStorage.getItem("patients")) || [];
let imageData = "";
let editingIndex = null;

/* Capitalize Name */
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

/* Render Patients Dynamically */
function renderPatients() {
    patientList.innerHTML = "";
    patients.forEach((p, i) => {
        const article = document.createElement("article");

        article.innerHTML = `
            <figure>
                <img src="${p.image}" alt="Patient Photo">
                <figcaption>${p.name}</figcaption>
            </figure>
            <div class="info">
                <p>Age: ${p.age}</p>
                <p>Department: ${p.department}</p>
            </div>
            <div class="actions">
                <button class="edit" data-index="${i}">Edit</button>
                <button class="delete" data-index="${i}">Delete</button>
            </div>
        `;
        patientList.appendChild(article);
    });

    countText.innerText = `Total Patients: ${patients.length}`;
    localStorage.setItem("patients", JSON.stringify(patients));
}

/* Add/Edit Patient */
form.addEventListener("submit", e => {
    e.preventDefault();

    if (ageInput.value <= 0 || ageInput.value > 120) {
        alert("Please enter a valid age");
        return;
    }

    const patient = {
        name: nameInput.value,
        age: ageInput.value,
        department: departmentInput.value,
        image: imageData || `https://picsum.photos/seed/${Date.now()}/150`
    };

    if (editingIndex !== null) {
        patients[editingIndex] = patient;
        editingIndex = null;
    } else {
        patients.push(patient);
    }

    notifySound.play();
    form.reset();
    preview.style.display = "none";
    imageData = "";

    renderPatients();
});

/* Edit/Delete Buttons */
patientList.addEventListener("click", e => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("delete")) {
        if (confirm("Delete this patient?")) {
            patients.splice(index, 1);
            renderPatients();
        }
    }
    if (e.target.classList.contains("edit")) {
        const p = patients[index];
        nameInput.value = p.name;
        ageInput.value = p.age;
        departmentInput.value = p.department;
        imageData = p.image;
        preview.src = imageData;
        preview.style.display = "block";
        editingIndex = index;
    }
});

/* Initial Load */
renderPatients();

