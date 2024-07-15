const uploadSection = document.querySelector('.upload__section');
const dragText = document.querySelector('.header');
const fileSectionAdded = document.querySelector('.added');
const fileSectionNotAdded = document.querySelector('.not__added');
const fileInput = document.getElementById('myFile');
const submit = document.querySelector('.file__button');

let files = [];
let fileData = [];

// Function to display files that are not added yet (local files)
function displayFilesNotAdded() {
    fileSectionNotAdded.innerHTML = ""; 
    files.forEach(file => {
        let fileTag = `<div class="file__row"><p>${file.name}</p></div>`;
        fileSectionNotAdded.innerHTML += fileTag;
    });
}

// Function to display files that are already added (files in localStorage)
function displayFilesAdded() {
    fileSectionAdded.innerHTML = "";
    for (let key in localStorage){
        if (localStorage.hasOwnProperty(key)) {
            let fileTag = `<div class="file__row"><p>${key}</p></div>`;
            fileSectionAdded.innerHTML += fileTag;
        }
    }
}

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
    displayFilesNotAdded();
    displayFilesAdded();

    uploadSection.classList.remove('active');
});

fileInput.addEventListener('change', (event) => {
    let newFiles = event.target.files;
    for (let i = 0; i < newFiles.length; i++) {
        files.push(newFiles[i]);
    }
    displayFilesNotAdded();
    displayFilesAdded();
});

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
            body: JSON.stringify({ files: fileData }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            store(); // Store files in localStorage after successful upload
            // Clear the files array and update the display
            files = [];
            displayFilesNotAdded();
            displayFilesAdded();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

function store() {
    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < fileData.length; j++) {
            if (files[i].name === fileData[j].name) {
                localStorage.setItem(files[i].name, JSON.stringify({ name: files[i].name, dataURL: fileData[j].dataURL }));
            }
        }
    }
    // Update display after storing files
    displayFilesNotAdded();
    displayFilesAdded();
}

// Initial display update when the page loads
displayFilesNotAdded();
displayFilesAdded();
