const uploadSection = document.querySelector('.upload__section');
const dragText = document.querySelector('.header');
const fileSection = document.querySelector('.files');
const fileInput = document.getElementById('myFile');
const submit = document.querySelector('.file__button');

let files = [];
let fileData = [];

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

function dataUrls(files, callback) {
    let count = 0;
    files.forEach(file => {
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            fileData.push({ name: file.name, dataURL: event.target.result });
            count++;
            if (count === files.length) {
                callback();
            }
        };
        fileReader.readAsDataURL(file);
    });
}

submit.addEventListener('click', (event) => {
    event.preventDefault();
    fileData = [];
    dataUrls(files, () => {
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ files: fileData }),  // Adjusted to match server-side expectation
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
