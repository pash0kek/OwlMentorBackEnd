const uploadSection = document.querySelector('.upload__section');
const dragText = document.querySelector('.header');
const fileSectionAdded = document.querySelector('.added');
const fileSectionNotAdded = document.querySelector('.not__added');
const fileInput = document.getElementById('myFile');
const submit = document.querySelector('.file__button');
const uploadButton = document.getElementById('uploadbttn');
const usageButton = document.getElementById('usagebttn');
const tryButton = document.getElementById('trybttn');


let files = [];
let fileData = [];

// Function to display files that are not added yet (local files)
function displayFilesNotAdded() {
    fileSectionNotAdded.innerHTML = ""; 
    files.forEach(file => {
        let fileTag = `<div class="file__row"><p>${file.name}</p><img src="/static/trash.png" class="delete-btn" data-name="${file.name}"></div>`;
        fileSectionNotAdded.innerHTML += fileTag;
    });
    attachDeleteEvents();
}

// Function to display files that are already added (files in localStorage)
function displayFilesAdded() {
    fileSectionAdded.innerHTML = "";
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            let fileTag = `<div class="file__row"><p>${key}</p><img src="/static/trash.png" class="delete-btn" data-name="${key}"></div>`;
            fileSectionAdded.innerHTML += fileTag;
        }
    }
    attachDeleteEvents();
}

usageButton.addEventListener('click', (event) => {
    event.preventDefault();
    location.href = 'https://owlmentor.co/usage';
});

uploadButton.addEventListener('click', (event) => {
    event.preventDefault();
    location.href = 'https://owlmentor.co';
});

tryButton.addEventListener('click', (event) => {
    event.preventDefault();
    location.href = 'https://owlmentor.co/playground';
});

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
        fetch('https://owlmentor.co/upload', {
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
            store(); 
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

function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const fileName = event.target.getAttribute('data-name');
            
            if (localStorage.getItem(fileName)) {
                localStorage.removeItem(fileName);
            }
            
            files = files.filter(file => file.name !== fileName);
            
            fetch('https://owlmentor.co/delete', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ file_name: fileName }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // Update the display
                displayFilesNotAdded();
                displayFilesAdded();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    });
}

// Initial display update when the page loads
displayFilesNotAdded();
displayFilesAdded();
