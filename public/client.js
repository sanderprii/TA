document.addEventListener('DOMContentLoaded', () => {
    // Register Form Submission



    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/login';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {

        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/'; // Redirect to home page
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Logout Button Click
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function () {
            try {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                    alert('Logged out successfully');
                    window.location.href = '/login'; // Redirect to login page
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }



    // Function to show the training details in a modal with Edit functionality
    function showTrainingModal(training) {
        const trainingModal = document.getElementById('training-modal');
        const trainingModalBody = document.getElementById('training-modal-body');

        // Clear previous modal content
        trainingModalBody.innerHTML = '';

        // Build modal content
        const detailsDiv = document.createElement('div');

        // Include training type and date
        const typeHeading = document.createElement('h5');
        typeHeading.textContent = training.type;
        detailsDiv.appendChild(typeHeading);

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'form-control mb-2';
        dateInput.value = training.date.split('T')[0];
        dateInput.disabled = true;
        detailsDiv.appendChild(dateInput);

        // Include WOD-specific fields
        let scoreInput, wodNameInput, wodTypeInput;
        if (training.type === 'WOD') {

            if (training.wodName) {
                wodNameInput = document.createElement('input');
                wodNameInput.type = 'text';
                wodNameInput.className = 'form-control mb-2';
                wodNameInput.value = training.wodName;
                wodNameInput.disabled = true;
                wodNameInput.placeholder = 'WOD Name';
                detailsDiv.appendChild(wodNameInput);
            }
            if (training.wodType) {
                wodTypeInput = document.createElement('input');
                wodTypeInput.type = 'text';
                wodTypeInput.className = 'form-control mb-2';
                wodTypeInput.value = training.wodType;
                wodTypeInput.disabled = true;
                wodTypeInput.placeholder = 'WOD Type';
                detailsDiv.appendChild(wodTypeInput);
            }

        }

        // Create a container for exercises
        const exercisesDiv = document.createElement('div');
        exercisesDiv.id = 'modal-exercises';

        training.exercises.forEach((exercise, index) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'mb-2';

            // Create a textarea for exerciseData
            const exerciseDataTextarea = document.createElement('textarea');
            exerciseDataTextarea.className = 'form-control mb-1 ';
            exerciseDataTextarea.value = exercise.exerciseData;
            exerciseDataTextarea.disabled = true;
            exerciseDataTextarea.style.overflow = 'hidden';
            exerciseDataTextarea.style.resize = 'none';
            exerciseDiv.appendChild(exerciseDataTextarea);


            exerciseDataTextarea.value = exercise.exerciseData;

            exercisesDiv.appendChild(exerciseDiv);
        });

        detailsDiv.appendChild(exercisesDiv);

        if (training.score) {
            scoreInput = document.createElement('input');
            scoreInput.type = 'text';
            scoreInput.className = 'form-control mb-2';
            scoreInput.value =training.score;
            scoreInput.disabled = true;
            scoreInput.placeholder = 'Score';
            detailsDiv.appendChild(scoreInput);
        }

        trainingModalBody.appendChild(detailsDiv);

        // Get modal footer and buttons
        const modalFooter = trainingModal.querySelector('.modal-footer');
        let editButton = trainingModal.querySelector('#edit-training-btn');
        let saveButton = trainingModal.querySelector('#save-training-btn');

        // Create Edit and Save buttons if they don't exist
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.id = 'edit-training-btn';
            editButton.className = 'btn btn-primary';
            editButton.textContent = 'Edit';
            modalFooter.insertBefore(editButton, modalFooter.firstChild);
        }

        if (!saveButton) {
            saveButton = document.createElement('button');
            saveButton.id = 'save-training-btn';
            saveButton.className = 'btn btn-success';
            saveButton.textContent = 'Save';
            saveButton.style.display = 'none';
            modalFooter.insertBefore(saveButton, modalFooter.firstChild);
        }

        // Add "Add to Records" button if WOD name exists
        let addToRecordsBtn = modalFooter.querySelector('.add-to-records-btn');
        if (addToRecordsBtn) {
            addToRecordsBtn.remove();
        }

        if (training.type === 'WOD' && training.wodName) {
            addToRecordsBtn = document.createElement('button');
            addToRecordsBtn.className = 'btn btn-secondary add-to-records-btn';
            addToRecordsBtn.textContent = 'Add to Records';
            modalFooter.insertBefore(addToRecordsBtn, modalFooter.firstChild);

            // Add click event to save to records
            addToRecordsBtn.addEventListener('click', async () => {
                try {
                    const recordData = {
                        type: 'WOD',
                        name: training.wodName,
                        date: training.date,
                        score: training.score,
                    };
                    const response = await fetch('/api/records', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(recordData),
                    });
                    if (response.ok) {
                        alert('Record added successfully!');
                    } else {
                        const result = await response.json();
                        alert('Error: ' + result.error);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });
        }

        // Edit button functionality
        editButton.onclick = () => {
            trainingModalBody.querySelectorAll('input, textarea').forEach((input) => (input.disabled = false));
            editButton.style.display = 'none';
            saveButton.style.display = 'block';
        };

        // Save button functionality
        saveButton.onclick = async () => {
            // Collect updated data
            const updatedTraining = {
                id: training.id,
                type: training.type,
                date: dateInput.value,
                exercises: [],
            };

            if (training.type === 'WOD') {
                updatedTraining.wodName = wodNameInput?.value || null;
                updatedTraining.wodType = wodTypeInput?.value || null;
                updatedTraining.score = scoreInput?.value || null;
            }

            const exerciseDataValues = exercisesDiv.querySelectorAll('textarea');
            exerciseDataValues.forEach((textarea) => {
                updatedTraining.exercises.push({
                    exerciseData: textarea.value,
                });
            });

            try {
                const response = await fetch(`/api/training/${training.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTraining),
                });

                if (response.ok) {
                    alert('Training updated successfully!');
                    loadTrainings(); // Reload trainings
                    const modalInstance = bootstrap.Modal.getInstance(trainingModal);
                    modalInstance.hide();
                } else {
                    const result = await response.json();
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error updating training:', error);
                alert('An error occurred while saving the training.');
            }
        };

        // Reset buttons visibility
        editButton.style.display = 'block';
        saveButton.style.display = 'none';

        // Show the modal
        const modalInstance = new bootstrap.Modal(trainingModal);
        modalInstance.show();

        // Pärast modal'i avamist
        trainingModal.addEventListener('shown.bs.modal', () => {
            // Nüüd on modal nähtav, kohandame kõrguse
            trainingModalBody.querySelectorAll('textarea').forEach((textarea) => {
                adjustTextareaHeight(textarea);
            });
        });

// Funktsioon kõrguse kohandamiseks
        function adjustTextareaHeight(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }





    // Load existing trainings on page load
    async function loadTrainings() {
        try {
            const response = await fetch('/api/trainings');
            const trainings = await response.json();
            renderTrainings(trainings);
        } catch (error) {
            console.error('Error loading trainings:', error);
        }
    }

    // Training Page Scripts
    const trainingForm = document.getElementById('training-form');
    const trainingTypeSelect = document.getElementById('training-type');
    const trainingDateDiv = document.getElementById('training-date-div');

    if (trainingForm && trainingTypeSelect) {
        const trainingOptionsDiv = document.getElementById('training-options');
        const wodOptions = document.getElementById('wod-options');
        const weightliftingOptions = document.getElementById('weightlifting-options');
        const cardioOptions = document.getElementById('cardio-options');
        const trainingList = document.getElementById('training-list');

        // WOD Search and Modal logic starts here
        const wodSearchInput = document.getElementById('wod-search');
        const wodSearchResults = document.getElementById('wod-search-results');
        const trainingTypeSelected = document.getElementById('training-type');

        // Modal-related variables
        const trainingModal = new bootstrap.Modal(document.getElementById('training-modal'));
        const trainingModalBody = document.getElementById('training-modal-body');
        const addTrainingBtn = document.getElementById('save-training-btn');
        const editTrainingBtn = document.getElementById('edit-training-btn');

        // Show search bar only for WOD type
        trainingTypeSelected.addEventListener('change', () => {
            const selectedType = trainingTypeSelected.value;
            const wodOptions = document.getElementById('wod-options');
            if (selectedType === 'WOD') {
                wodOptions.style.display = 'block';
            } else {
                wodOptions.style.display = 'none';
                wodSearchResults.style.display = 'none';
            }
        });

        // Fetch Default WODs based on search query
        async function searchWODs(query) {
            try {
                const response = await fetch(`/api/search-default-wods?q=${encodeURIComponent(query.toUpperCase())}`);
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error fetching WODs:', error);
            }
            return [];
        }

        // Handle WOD search input
        wodSearchInput.addEventListener('input', async () => {
            const query = wodSearchInput.value.trim();
            if (query.length === 0) {
                wodSearchResults.style.display = 'none';
                wodSearchResults.innerHTML = '';
                return;
            }

            const results = await searchWODs(query);
            wodSearchResults.innerHTML = '';

            if (results.length > 0) {
                results.slice(0, 10).forEach(wod => {
                    const li = document.createElement('li');
                    li.textContent = wod.name;
                    li.className = 'list-group-item';
                    li.style.cursor = 'pointer';

                    // Click handler to show modal
                    li.addEventListener('click', () => {
                        showWODModal(wod);
                    });

                    wodSearchResults.appendChild(li);
                });
                wodSearchResults.style.display = 'block';
            } else {
                wodSearchResults.style.display = 'none';
            }
        });

        // Format description to add new lines after ":" and ","
        function formatModalDescription(description) {
            return description
                .replace(/:/g, ':<br>') // Add a line break after ":"
                .replace(/,/g, '<br>'); // Add a line break after ","
        }

        function formatDescription(description) {
            return description
                .replace(/:/g, ':\n')  // Lisa rea vahetus pärast ":"
                .replace(/,/g, '\n');  // Asenda "," rea vahetusega
        }

        // Show WOD details in modal
        function showWODModal(wod) {
            trainingModalBody.innerHTML = `
            <h5>${wod.name}</h5>
            <p>${wod.type}</p>
            <p>${formatModalDescription(wod.description)}</p>
        `;

            addTrainingBtn.style.display = 'block';
            addTrainingBtn.textContent = 'Add Training';

            editTrainingBtn.style.display = 'none';

            // Add click event to Add Training button
            addTrainingBtn.onclick = () => {
                document.getElementById('wod-name').value = wod.name;
                document.querySelector(`input[name="wod-type"][value="${wod.type}"]`).checked = true;
                document.getElementById('wod-description').value = formatDescription(wod.description);

                wodSearchResults.style.display = 'none';
                trainingModal.hide();
            };

            trainingModal.show();
        }

        // Ensure all elements exist before proceeding
        if (
            trainingOptionsDiv &&
            wodOptions &&
            weightliftingOptions &&
            cardioOptions &&
            trainingList
        ) {
            // Training Type Change Event
            trainingTypeSelect.addEventListener('change', () => {
                const type = trainingTypeSelect.value;

                // Hide all options initially
                wodOptions.style.display = 'none';
                weightliftingOptions.style.display = 'none';
                cardioOptions.style.display = 'none';
                trainingOptionsDiv.style.display = 'none';

                // Show the date input field
                if (type) {
                    // Show the container
                    trainingOptionsDiv.style.display = 'block';
                    trainingDateDiv.style.display = 'block';

                    // Show options based on selected type
                    if (type === 'WOD') {
                        wodOptions.style.display = 'block';
                    } else if (type === 'Weightlifting') {
                        weightliftingOptions.style.display = 'block';
                    } else if (type === 'Cardio') {
                        cardioOptions.style.display = 'block';
                    }
                } else {
                    // Hide the date input field if no type is selected
                    trainingDateDiv.style.display = 'none';
                }
            });

            // Trigger change event on page load to set initial state
            trainingTypeSelect.dispatchEvent(new Event('change'));

            // Reference to the modal and its content container
            const trainingModal = document.getElementById('training-modal');
            const trainingModalBody = document.getElementById('training-modal-body');

            // Function to render trainings in the list
            function renderTrainings(trainings) {
                trainingList.innerHTML = ''; // Clear the list before rendering

                trainings.forEach((training) => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';

                    const trainingHeader = document.createElement('div');
                    trainingHeader.className = 'training-header d-flex justify-content-between align-items-center';

                    // Format the date
                    const dateObj = new Date(training.date);
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    const formattedDate = `${day}.${month}.${year}`;

                    // Construct header text
                    let headerText = `${formattedDate} - ${training.type}`;

                    if (training.type === 'WOD') {
                        headerText += ` - ${training.wodType || ''}`;
                        headerText += training.wodName ? ` - ${training.wodName}` : '';
                    }

                    const trainingInfo = document.createElement('span');
                    trainingInfo.textContent = headerText.trim();
                    trainingInfo.style.cursor = 'pointer';

                    // Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn-danger btn-sm';
                    deleteBtn.textContent = 'Delete';

                    // Delete button click event
                    deleteBtn.addEventListener('click', async () => {
                        const confirmed = confirm('Are you sure you want to delete this training?');
                        if (!confirmed) return;
                        try {
                            const response = await fetch(`/api/training/${training.id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                            });

                            if (response.ok) {
                                // Remove the list item from the UI
                                li.remove();
                            } else {
                                const result = await response.json();
                                alert(`Error: ${result.error}`);
                            }
                        } catch (error) {
                            alert('Error: ' + error.message);
                        }
                    });

                    trainingHeader.appendChild(trainingInfo);
                    trainingHeader.appendChild(deleteBtn);

                    li.appendChild(trainingHeader);
                    trainingList.appendChild(li);

                    // Event listener for trainingInfo click
                    trainingInfo.addEventListener('click', () => {
                        showTrainingModal(training);
                    });
                });
            }

            loadTrainings(); // Load trainings on initial page load


            // Training Form Submission
            trainingForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const type = trainingTypeSelect.value;
                const date = document.getElementById('training-date').value; // Get the date
                let score = null; // Initialize score to null

                let trainingData = {
                    type,
                    date,
                };

                if (type === 'WOD') {
                    const wodName = document.getElementById('wod-name').value;

                    // Get selected WOD type
                    const wodTypeRadio = document.querySelector('input[name="wod-type"]:checked');
                    const wodType = wodTypeRadio ? wodTypeRadio.value : null;

                    // Get the exerciseData from the textarea
                    const exerciseData = document.querySelector('#wod-options textarea[name="exercise-name"]').value;

                    // Get the score specific to WOD
                    score = document.getElementById('wod-score').value;

                    // Prepare the training data
                    trainingData = {
                        ...trainingData,
                        score,
                        wodName,
                        wodType,
                        exercises: [
                            {
                                exerciseData,
                            },
                        ],
                    };
                } else if (type === 'Weightlifting') {
                    const exerciseData = document.querySelector('#weightlifting-options textarea[name="exercise-name"]').value;

                    trainingData = {
                        ...trainingData,
                        exercises: [
                            {
                                exerciseData,
                            },
                        ],
                    };
                } else if (type === 'Cardio') {
                    const exerciseData = document.querySelector('#cardio-options textarea[name="exercise-name"]').value;

                    trainingData = {
                        ...trainingData,
                        exercises: [
                            {
                                exerciseData,
                            },
                        ],
                    };
                } else {
                    alert('Please select a valid training type.');
                    return;
                }

                // Send data to the server
                try {
                    const response = await fetch('/api/training', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(trainingData),
                    });

                    const result = await response.json();
                    if (response.ok) {
                        console.log('Server response:', result);
                        renderTrainings(result.trainings);
                        trainingForm.reset();
                        trainingOptionsDiv.style.display = 'none';
                        trainingDateDiv.style.display = 'none';
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });

            // Since the specific inputs for wodType are removed, we can remove the WOD Type Selection code if not needed
        }
    }

    // Profile Page Scripts
    const editBtn = document.getElementById('edit-btn');
    const profileView = document.getElementById('profile-view');
    const profileEdit = document.getElementById('profile-edit');

    if (editBtn && profileView && profileEdit) {
        editBtn.addEventListener('click', () => {
            profileView.style.display = 'none';
            profileEdit.style.display = 'block';
        });

        profileEdit.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const sex = document.querySelector('input[name="sex"]:checked').value;

            try {
                const response = await fetch('/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, dateOfBirth, sex }),
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const result = await response.json();
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }


// Records Page Scripts
    const recordsPage = document.getElementById('records-page');

    if (recordsPage) {

        const recordsContainer = document.getElementById('records-container');
        const recordTypeButtons = document.querySelectorAll('.record-type-btn');
        const addRecordBtn = document.getElementById('add-record-btn');
        let currentRecordType = 'WOD'; // Default record type

        // Function to load records
        async function loadRecords() {
            try {
                const response = await fetch(`/api/records?type=${currentRecordType}`);
                const records = await response.json();
                renderRecords(records);
            } catch (error) {
                console.error('Error loading records:', error);
            }
        }

        // Function to render records
        function renderRecords(records) {
            recordsContainer.innerHTML = ''; // Clear existing records

            records.forEach((record) => {
                const recordItem = document.createElement('div');
                recordItem.className = 'record-item';
                recordItem.style.cursor = 'pointer';

                let recordContent = '';
                if (currentRecordType === 'WOD') {
                    recordContent = `
        <div>
            <strong>${record.name}</strong>
        </div>
        <div>
            Score: ${record.score}
        </div>
    `;
                } else if (currentRecordType === 'Weightlifting') {
                    recordContent = `
        <div>
            <strong>${record.name}</strong>
        </div>
        <div>
            Weight: ${record.weight} kg
        </div>
    `;
                } else if (currentRecordType === 'Cardio') {
                    recordContent = `
        <div>
            <strong>${record.name}</strong>
        </div>
        <div>
            Time: ${record.time}
        </div>
    `;
                }

                recordItem.innerHTML = recordContent;

                // Add click event to open modal with record details
                recordItem.addEventListener('click', () => {
                    showRecordModal(record);
                });

                recordsContainer.appendChild(recordItem);
            });
        }

        // Globaalsed muutujad
        let recordModal; // Bootstrap modali instants
        let recordModalElement; // Modali DOM element
        let currentRecordName;

// Funktsioon modali kuvamiseks
        async function showRecordModal(record) {

            const type = currentRecordType;
            const name = record.name;
            currentRecordName = name;

            try {
                const response = await fetch(`/api/records/${encodeURIComponent(name)}?type=${type}`);
                const records = await response.json();
                const reversedRecords = records.slice().reverse();

                // Valmistame andmed graafiku jaoks
                const dates = [];
                const values = [];
                const recordIds = [];
                const timeStrings = [];
                const scoreStrings = [];
                let isTimeBased = false;

                reversedRecords.forEach(rec => {
                    // Lisame kuupäeva
                    dates.push(new Date(rec.date).toLocaleDateString());

                    if (type === 'WOD') {
                        // Kontrollime, kas `score` sisaldab koolonit, mis viitab ajale
                        if (rec.score.includes(':')) {
                            // Käsitleme `score` väärtust ajana
                            const timeParts = rec.score.split(':').map(Number);
                            let decimalMinutes = 0;

                            if (timeParts.length === 3) {
                                // hh:mm:ss
                                decimalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
                            } else if (timeParts.length === 2) {
                                // mm:ss
                                decimalMinutes = timeParts[0] + timeParts[1] / 60;
                            } else if (timeParts.length === 1) {
                                // ss
                                decimalMinutes = timeParts[0] / 60;
                            }
                            values.push(decimalMinutes);

                            // Salvestame originaalse ajastringi tööriistavihje jaoks
                            scoreStrings.push(rec.score);

                            // Märgime, et see rekord on ajaväärtusega
                            isTimeBased = true;
                        } else {
                            // Käsitleme `score` väärtust arvuna
                            values.push(parseFloat(rec.score));
                            scoreStrings.push(rec.score);
                        }
                    } else if (type === 'Weightlifting') {
                        values.push(rec.weight);
                    } else if (type === 'Cardio') {
                        // Konverteerime aja kümnendmurdudeks minutites
                        const timeParts = rec.time.split(':').map(Number);
                        let decimalMinutes = 0;

                        if (timeParts.length === 3) {
                            // hh:mm:ss
                            decimalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
                        } else if (timeParts.length === 2) {
                            // mm:ss
                            decimalMinutes = timeParts[0] + timeParts[1] / 60;
                        } else if (timeParts.length === 1) {
                            // ss
                            decimalMinutes = timeParts[0] / 60;
                        }
                        values.push(decimalMinutes);

                        // Salvestame originaalse ajastringi tööriistavihje jaoks
                        timeStrings.push(rec.time);
                    }
                    recordIds.push(rec.id);
                });

                // Koosta modali sisu
                let modalContent = `<h5>${name}</h5>`;

                if (records.length > 0) {
                    const rec = records[0]; // Võtame kõige hilisema rekordi
                    modalContent += '<hr>';
                    modalContent += `<div data-record-id="${rec.id}">`;

                    if (type === 'WOD') {
                        modalContent += `
                    <p>Score: ${rec.score}</p>
                    <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                `;
                    } else if (type === 'Weightlifting') {
                        modalContent += `
                    <p>Weight: ${rec.weight} kg</p>
                    <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                `;
                    } else if (type === 'Cardio') {
                        modalContent += `
                    <p>Time: ${rec.time}</p>
                    <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                `;
                    }


                    // Lisame graafiku konteineri
                    modalContent += `<canvas id="recordChart" width="400" height="200"></canvas>`;
                    modalContent += `<p style="text-align: center; font-style: italic;">Click on record for delete</p>`;
                    modalContent += `</div>`;



                } else {
                    modalContent += '<p>No records found.</p>';
                }

                // Kui modali elementi pole veel loodud, loo see
                if (!recordModalElement) {
                    recordModalElement = document.createElement('div');
                    recordModalElement.id = 'recordModal';
                    recordModalElement.className = 'modal fade';
                    recordModalElement.tabIndex = -1;
                    recordModalElement.setAttribute('aria-labelledby', 'recordModalLabel');
                    recordModalElement.setAttribute('aria-hidden', 'true');
                    recordModalElement.innerHTML = `
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="recordModalLabel">Record Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="record-modal-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
                    document.body.appendChild(recordModalElement);
                    recordModal = new bootstrap.Modal(recordModalElement);



                    // Lisa sündmuste kuulaja fookuse haldamiseks
                    recordModalElement.addEventListener('shown.bs.modal', () => {
                        recordModalElement.querySelector('.modal-title').focus();
                    });

                    // Lisa sündmuste kuulaja modali sulgemiseks
                    recordModalElement.addEventListener('hidden.bs.modal', () => {
                        document.getElementById('records-container').focus();
                    });

                    // Initsialiseerime graafiku instantsi
                    window.recordChartInstance = null;

                }

                // Määra modali sisu
                const modalBody = recordModalElement.querySelector('#record-modal-body');
                modalBody.innerHTML = modalContent;

                if (window.recordChartInstance) {
                    window.recordChartInstance.destroy();
                    window.recordChartInstance = null;
                }

                // Näita modali
                recordModal.show();

                // Loome graafiku pärast modali näitamist
                createRecordChart(dates, values, type, recordIds, timeStrings, isTimeBased);

            } catch (error) {
                console.error('Error fetching records:', error);
                alert('An error occurred while fetching records.');
            }
        }

        function createRecordChart(dates, values, type, recordIds, timeStrings, isTimeBased) {
            const ctx = document.getElementById('recordChart').getContext('2d');

            // Hävitame olemasoleva graafiku, kui see eksisteerib
            if (window.recordChartInstance) {
                window.recordChartInstance.destroy();
            }

            // Määrame sildi
            let label = '';
            if (type === 'WOD') {
                label = isTimeBased ? 'Time (minutes)' : 'Score';
            } else if (type === 'Weightlifting') {
                label = 'Weight (kg)';
            } else if (type === 'Cardio') {
                label = 'Time (minutes)';
            }

            // Graafiku konfiguratsioon
            const config = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: label,
                        data: values,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        pointBackgroundColor: 'rgb(75, 192, 192)',
                        pointRadius: 5,
                    }]
                },
                options: {
                    onClick: chartClickHandler,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: label
                            },
                            beginAtZero: false,
                            ticks: {
                                precision: 0,
                                stepSize: 1,
                                callback: function(value) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex;
                                    if (type === 'WOD' && isTimeBased) {
                                        const scoreString = scoreStrings[index];
                                        return `${label}: ${scoreString}`;
                                    } else if (type === 'Cardio') {
                                        const timeString = scoreStrings[index];
                                        return `${label}: ${timeString}`;
                                    } else {
                                        return `${label}: ${context.parsed.y}`;
                                    }
                                }
                            }
                        }
                    }
                }}

                // Cardio puhul kohandame Y-telje silte ja tööriistavihjeid
                if (type === 'Cardio') {
                // Vormindame Y-telje sildid
                config.options.scales.y.ticks = {
                    callback: function(value, index, ticks) {
                        return value + ' min';
                    },
                    stepSize: 1,
                    precision: 0
                };

                // Vormindame tööriistavihjed
                config.options.plugins.tooltip.callbacks = {
                    label: function(context) {
                        const minutes = context.parsed.y;
                        return `${label}: ${minutes} min`;
                    }
                };
            }

            // Loome graafiku
            window.recordChartInstance = new Chart(ctx, config);

            window.recordChartInstance.recordIds = recordIds;
        }

        function chartClickHandler(event, elements) {
            if (elements.length > 0) {
                // Get the first clicked element
                const elementIndex = elements[0].index;

                // Get the record ID associated with this data point
                const recordId = window.recordChartInstance.recordIds[elementIndex];

                // Get the data value and label if needed
                const dataValue = window.recordChartInstance.data.datasets[0].data[elementIndex];
                const dataLabel = window.recordChartInstance.data.labels[elementIndex];

                // Show a confirmation dialog or a modal
                const confirmed = confirm(`Do you want to delete the record on ${dataLabel}?`);
                if (confirmed) {
                    // Call the function to delete the record
                    deleteRecordFromChart(recordId);
                }
            }
        }

        async function deleteRecordFromChart(recordId) {
            try {
                const response = await fetch(`/api/records/${recordId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    alert('Record deleted successfully!');
                    // Refresh the modal content
                    showRecordModal({ name: currentRecordName });
                    // Refresh the main records list
                    loadRecords();
                } else {
                    const result = await response.json();
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }





        // Function to open modal for adding a record
        function openAddRecordModal() {
            // Create modal if it doesn't exist
            let modal = document.getElementById('editRecordModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'editRecordModal';
                modal.className = 'modal fade';
                modal.tabIndex = -1;
                modal.role = 'dialog';
                modal.innerHTML = `
                    <div class="modal-dialog" role="document">
                        <form id="edit-record-form">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Add Record</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body" id="edit-record-modal-body">
                                    <!-- Form fields will be injected here -->
                                </div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-primary">Save Record</button>
                                </div>
                            </div>
                        </form>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            const form = modal.querySelector('#edit-record-form');
            const modalBody = modal.querySelector('#edit-record-modal-body');

            // Build form fields based on currentRecordType
            let formFields = `
                <div class="form-group">
                    <label for="record-name">Name</label>
                    <input type="text" id="record-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="record-date">Date</label>
                    <input type="date" id="record-date" class="form-control" required>
                </div>
            `;

            if (currentRecordType === 'WOD') {
                formFields += `
                    <div class="form-group">
                        <label for="record-score">Score</label>
                        <input type="text" id="record-score" class="form-control" required>
                    </div>
                `;
            } else if (currentRecordType === 'Weightlifting') {
                formFields += `
                    <div class="form-group">
                        <label for="record-weight">Weight (kg)</label>
                        <input type="number" id="record-weight" class="form-control" required>
                    </div>
                `;
            } else if (currentRecordType === 'Cardio') {
                formFields += `
                    <div class="form-group">
                        <label for="record-time">Time (mm:ss)</label>
                        <input type="text" id="record-time" class="form-control" required>
                    </div>
                `;
            }

            modalBody.innerHTML = formFields;

            // Form submission
            form.onsubmit = async function (e) {
                e.preventDefault();

                const name = modal.querySelector('#record-name').value;
                const date = modal.querySelector('#record-date').value;
                let recordData = {
                    type: currentRecordType,
                    name,
                    date,
                };

                if (currentRecordType === 'WOD') {
                    recordData.score = modal.querySelector('#record-score').value;
                } else if (currentRecordType === 'Weightlifting') {
                    recordData.weight = modal.querySelector('#record-weight').value;
                } else if (currentRecordType === 'Cardio') {
                    recordData.time = modal.querySelector('#record-time').value;
                }

                try {
                    const response = await fetch('/api/records', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(recordData),
                    });
                    if (response.ok) {
                        alert('Record saved successfully!');
                        loadRecords();
                        const bootstrapModal = bootstrap.Modal.getInstance(modal);
                        bootstrapModal.hide();
                    } else {
                        const result = await response.json();
                        alert('Error: ' + result.error);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            };

            // Show modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }

        // Event listeners
        recordTypeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                recordTypeButtons.forEach((b) => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                currentRecordType = btn.dataset.type;
                loadRecords();
            });
        });

        addRecordBtn.addEventListener('click', () => {
            openAddRecordModal();
        });

        // Initial load
        loadRecords();
    }

    // Sessions Page Code
    if (document.getElementById('calendar') &&
        typeof trainingsData !== 'undefined' &&
        typeof FullCalendar !== 'undefined') {

        // The sessions page is loaded, and trainingsData is available
        initializeCalendar();
    }

    function initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        
        // Parse the trainings data
        const trainings = trainingsData; // Ensure trainingsData is available

        // Map trainings to events
        const events = [];

        trainings.forEach((training) => {
            // Determine the color based on training type
            let backgroundColor = '';
            if (training.type === 'WOD') {
                backgroundColor = 'blue';
            } else if (training.type === 'Weightlifting') {
                backgroundColor = 'green';
            } else if (training.type === 'Cardio') {
                backgroundColor = 'yellow';
            }

            // Create event
            events.push({
                id: training.id,
                title: '', // Leave empty to show only color
                start: training.date,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                training: training, // Attach the training data
            });
        });

        // Initialize the calendar
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: events,
            eventContent: function (arg) {
                // Custom rendering to show multiple colors
                return {
                    html: `<div style="width:100%;height:10px;background-color:${arg.event.backgroundColor};margin-bottom:2px;"></div>`,
                };
            },
            eventClick: function (info) {
                // Show modal with training details
                showTrainingModal(info.event.extendedProps.training);
            },
        });

        calendar.render();


    }

    // Find Users Page Scripts
    const findUsersPage = document.getElementById('find-users-page') || document.querySelector('.find-users-container');
    if (findUsersPage) {
        const searchInput = document.getElementById('search-input');
        const resultsList = document.getElementById('search-results');

        let debounceTimeout = null;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();

            clearTimeout(debounceTimeout);

            // Delay the request to avoid too many requests
            debounceTimeout = setTimeout(async () => {
                if (query.length === 0) {
                    resultsList.style.display = 'none';
                    resultsList.innerHTML = '';
                    return;
                }

                try {
                    const response = await fetch(`/api/search-users?q=${encodeURIComponent(query)}`);
                    if (response.ok) {
                        const users = await response.json();
                        resultsList.innerHTML = '';

                        if (users.length > 0) {
                            users.forEach(user => {
                                const li = document.createElement('li');
                                li.classList.add('list-group-item');
                                li.textContent = `${user.username} - ${user.fullName || ''}`;
                                li.style.cursor = 'pointer';
                                li.addEventListener('click', () => {
                                    window.location.href = `/user-records/${user.id}`;
                                });
                                resultsList.appendChild(li);
                            });
                            resultsList.style.display = 'block';
                        } else {
                            const li = document.createElement('li');
                            li.classList.add('list-group-item');
                            li.textContent = 'No users found.';
                            resultsList.appendChild(li);
                            resultsList.style.display = 'block';
                        }
                    } else {
                        console.error('Failed to fetch users');
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }, 300); // Waits 300ms after typing stops
        });
    }

    // User Records Page Scripts
    const userRecordsPage = document.getElementById('user-records-page');
    if (userRecordsPage) {
        const recordsContainer = document.getElementById('records-container');
        const recordTypeButtons = userRecordsPage.querySelectorAll('.record-type-btn');
        let currentRecordType = 'WOD'; // Default record type
        const userId = userRecordsPage.dataset.userId;
        const username = userRecordsPage.dataset.username;

        // Function to load records
        async function loadRecords() {
            try {
                const response = await fetch(`/api/user-records/${userId}?type=${currentRecordType}`);
                const records = await response.json();
                renderRecords(records);
            } catch (error) {
                console.error('Error loading records:', error);
            }
        }

        // Function to render records
        function renderRecords(records) {
            recordsContainer.innerHTML = ''; // Clear existing records

            records.forEach((record) => {
                const recordItem = document.createElement('div');
                recordItem.className = 'record-item';
                recordItem.style.cursor = 'pointer';

                let recordContent = '';
                if (currentRecordType === 'WOD') {
                    recordContent = `
                    <div>
                        <strong>${record.name}</strong>
                    </div>
                    <div>
                        Score: ${record.score}
                    </div>
                `;
                } else if (currentRecordType === 'Weightlifting') {
                    recordContent = `
                    <div>
                        <strong>${record.name}</strong>
                    </div>
                    <div>
                        Weight: ${record.weight} kg
                    </div>
                `;
                } else if (currentRecordType === 'Cardio') {
                    recordContent = `
                    <div>
                        <strong>${record.name}</strong>
                    </div>
                    <div>
                        Time: ${record.time}
                    </div>
                `;
                }

                recordItem.innerHTML = recordContent;

                // Add click event to open modal with record details
                recordItem.addEventListener('click', () => {
                    showRecordModal(record);
                });

                recordsContainer.appendChild(recordItem);
            });
        }

        // Global variables
        let recordModal; // Bootstrap modal instance
        let recordModalElement; // Modal DOM element
        let currentRecordName;

        // Function to show the record modal
        async function showRecordModal(record) {
            const type = currentRecordType;
            const name = record.name;
            currentRecordName = name;

            try {
                const response = await fetch(`/api/user-records/${userId}/exercise/${encodeURIComponent(name)}?type=${type}`);

                const records = await response.json();
                const reversedRecords = records.slice().reverse();

                // Prepare data for the chart
                const dates = [];
                const values = [];
                const recordIds = []; // We can omit this since we won't delete records
                const scoreStrings = [];
                let isTimeBased = false;

                reversedRecords.forEach(rec => {
                    // Add date
                    dates.push(new Date(rec.date).toLocaleDateString());

                    if (type === 'WOD') {
                        // Check if score is time-based
                        if (rec.score.includes(':')) {
                            // Handle as time
                            const timeParts = rec.score.split(':').map(Number);
                            let decimalMinutes = 0;

                            if (timeParts.length === 3) {
                                decimalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
                            } else if (timeParts.length === 2) {
                                decimalMinutes = timeParts[0] + timeParts[1] / 60;
                            } else if (timeParts.length === 1) {
                                decimalMinutes = timeParts[0] / 60;
                            }
                            values.push(decimalMinutes);

                            scoreStrings.push(rec.score);
                            isTimeBased = true;
                        } else {
                            // Numeric score
                            values.push(parseFloat(rec.score));
                            scoreStrings.push(rec.score);
                        }
                    } else if (type === 'Weightlifting') {
                        values.push(rec.weight);
                        scoreStrings.push(rec.weight.toString());
                    } else if (type === 'Cardio') {
                        // Convert time to decimal minutes
                        const timeParts = rec.time.split(':').map(Number);
                        let decimalMinutes = 0;

                        if (timeParts.length === 3) {
                            decimalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
                        } else if (timeParts.length === 2) {
                            decimalMinutes = timeParts[0] + timeParts[1] / 60;
                        } else if (timeParts.length === 1) {
                            decimalMinutes = timeParts[0] / 60;
                        }
                        values.push(decimalMinutes);

                        scoreStrings.push(rec.time);
                        isTimeBased = true;
                    }
                });

                // Build modal content
                let modalContent = `<h5>${name}</h5>`;

                if (records.length > 0) {
                    const rec = records[0]; // Most recent record
                    modalContent += '<hr>';
                    modalContent += `<div>`;

                    if (type === 'WOD') {
                        modalContent += `
                        <p>Score: ${rec.score}</p>
                        <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                    `;
                    } else if (type === 'Weightlifting') {
                        modalContent += `
                        <p>Weight: ${rec.weight} kg</p>
                        <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                    `;
                    } else if (type === 'Cardio') {
                        modalContent += `
                        <p>Time: ${rec.time}</p>
                        <p>Date: ${new Date(rec.date).toLocaleDateString()}</p>
                    `;
                    }

                    // Add chart container
                    modalContent += `<canvas id="recordChart" width="400" height="200"></canvas>`;
                    modalContent += `</div>`;
                } else {
                    modalContent += '<p>No records found.</p>';
                }

                // Create modal if it doesn't exist
                if (!recordModalElement) {
                    recordModalElement = document.createElement('div');
                    recordModalElement.id = 'recordModal';
                    recordModalElement.className = 'modal fade';
                    recordModalElement.tabIndex = -1;
                    recordModalElement.setAttribute('aria-labelledby', 'recordModalLabel');
                    recordModalElement.setAttribute('aria-hidden', 'true');
                    recordModalElement.innerHTML = `
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="recordModalLabel">Record Details</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="record-modal-body"></div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                    document.body.appendChild(recordModalElement);
                    recordModal = new bootstrap.Modal(recordModalElement);
                }

                // Set modal content
                const modalBody = recordModalElement.querySelector('#record-modal-body');
                modalBody.innerHTML = modalContent;

                // Destroy existing chart if any
                if (window.recordChartInstance) {
                    window.recordChartInstance.destroy();
                    window.recordChartInstance = null;
                }

                // Show modal
                recordModal.show();

                // Create chart
                createRecordChart(dates, values, type, scoreStrings, isTimeBased);

            } catch (error) {
                console.error('Error fetching records:', error);
                alert('An error occurred while fetching records.');
            }
        }

        function createRecordChart(dates, values, type, scoreStrings, isTimeBased) {
            const ctx = document.getElementById('recordChart').getContext('2d');

            // Destroy existing chart if it exists
            if (window.recordChartInstance) {
                window.recordChartInstance.destroy();
            }

            // Set label
            let label = '';
            if (type === 'WOD') {
                label = isTimeBased ? 'Time (minutes)' : 'Score';
            } else if (type === 'Weightlifting') {
                label = 'Weight (kg)';
            } else if (type === 'Cardio') {
                label = 'Time (minutes)';
            }

            // Chart configuration
            const config = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: label,
                        data: values,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        pointBackgroundColor: 'rgb(75, 192, 192)',
                        pointRadius: 5,
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: label
                            },
                            beginAtZero: false,
                            ticks: {
                                precision: 0,
                                stepSize: 1,
                                callback: function(value) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex;
                                    if ((type === 'WOD' && isTimeBased) || type === 'Cardio') {
                                        const scoreString = scoreStrings[index];
                                        return `${label}: ${scoreString}`;
                                    } else {
                                        return `${label}: ${context.parsed.y}`;
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // Adjust Y-axis ticks for time-based records
            if ((type === 'WOD' && isTimeBased) || type === 'Cardio') {
                config.options.scales.y.ticks = {
                    precision: 0,
                    stepSize: 1,
                    callback: function(value) {
                        return value;
                    }
                };
            }

            // Create the chart
            window.recordChartInstance = new Chart(ctx, config);
        }

        // Event listeners for record type buttons
        recordTypeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                recordTypeButtons.forEach((b) => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                currentRecordType = btn.dataset.type;
                loadRecords();
            });
        });

        // Initial load
        loadRecords();
    }






});


