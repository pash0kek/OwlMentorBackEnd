const uploadSection = document.querySelector('.upload__section');
const dragText = document.querySelector('.header');
const fileSection = document.querySelector('.files');
const fileInput = document.getElementById('myFile');

let files = [];

uploadSection.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragText.textContent = "Release to Upload";
    uploadSection.classList.add('active');
});

uploadSection.addEventListener('dragleave', () => {
    dragText.textContent = "Drag & Drop";
    uploadSection.classList.remove('active');
});

uploadSection.addEventListener('drop', (event) => {
    event.preventDefault();

    let newFiles = event.dataTransfer.files;
    for (let i = 0; i < newFiles.length; i++) {
        files.push(newFiles[i]);
    }
    displayFiles();

    uploadSection.classList.remove('active');
});

fileInput.addEventListener('change', (event) => {
    let newFiles = event.target.files;
    for (let i = 0; i < newFiles.length; i++) {
        files.push(newFiles[i]);
    }
    displayFiles();
});

function displayFiles() {
    fileSection.innerHTML = ""; 
    files.forEach(file => {
        let fileTag = `<div class="file__row"><p>${file.name}</p></div>`;
        fileSection.innerHTML += fileTag;
    });
}