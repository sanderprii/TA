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
    } else {
        console.warn('Profile edit elements not found.');
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
                    recordContent = `<strong>${record.name}</strong> - Score: ${record.score}`;
                } else if (currentRecordType === 'Weightlifting') {
                    recordContent = `<strong>${record.name}</strong> - Weight: ${record.weight} kg`;
                } else if (currentRecordType === 'Cardio') {
                    recordContent = `<strong>${record.name}</strong> - Time: ${record.time}`;
                }

                recordItem.innerHTML = recordContent;

                // Add click event to open modal with record details
                recordItem.addEventListener('click', () => {
                    showRecordModal(record);
                });

                recordsContainer.appendChild(recordItem);
            });
        }

        // Function to show record details in a modal
// Function to show record details in a modal
        async function showRecordModal(record) {
            const type = currentRecordType;
            const name = record.name;

            try {
                const response = await fetch(`/api/records/${encodeURIComponent(name)}?type=${type}`);
                const records = await response.json();

                // Build modal content
                let modalContent = `<h5>${name}</h5>`;

                records.forEach((rec, index) => {
                    modalContent += '<hr>';
                    modalContent += `<p><strong>Record ${index + 1}</strong></p>`;
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
                });

                // Create modal if it doesn't exist
                let modal = document.getElementById('recordModal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'recordModal';
                    modal.className = 'modal fade';
                    modal.tabIndex = -1;
                    modal.role = 'dialog';
                    modal.innerHTML = `
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Record Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="record-modal-body"></div>
                        <div class="modal-footer">
                            <!-- Edit button can be added here if needed -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
                    document.body.appendChild(modal);
                }

                // Set modal content
                document.getElementById('record-modal-body').innerHTML = modalContent;

                // Show modal
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();

            } catch (error) {
                console.error('Error fetching records:', error);
                alert('An error occurred while fetching records.');
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
        async function loadUserRecords() {
            try {
                const response = await fetch(`/api/user-records/${userId}?type=${currentRecordType}`);
                const records = await response.json();
                renderUserRecords(records);
            } catch (error) {
                console.error('Error loading user records:', error);
            }
        }

        // Function to render user records
        function renderUserRecords(records) {
            recordsContainer.innerHTML = ''; // Clear existing records

            if (records.length === 0) {
                recordsContainer.innerHTML = '<p>No records found.</p>';
                return;
            }

            records.forEach((record) => {
                const recordItem = document.createElement('div');
                recordItem.className = 'record-item';
                recordItem.style.cursor = 'pointer';

                let recordContent = '';
                if (currentRecordType === 'WOD') {
                    recordContent = `<strong>${record.name}</strong> - Score: ${record.score}`;
                } else if (currentRecordType === 'Weightlifting') {
                    recordContent = `<strong>${record.name}</strong> - Weight: ${record.weight} kg`;
                } else if (currentRecordType === 'Cardio') {
                    recordContent = `<strong>${record.name}</strong> - Time: ${record.time}`;
                }

                // Add date
                recordContent += `<br><small>${new Date(record.date).toLocaleDateString()}</small>`;

                recordItem.innerHTML = recordContent;

                // Add click event to open modal with record details
                recordItem.addEventListener('click', () => {
                    showUserRecordModal(record);
                });

                recordsContainer.appendChild(recordItem);
            });
        }

        // Function to show record details in a modal
        function showUserRecordModal(record) {
            // Build modal content
            let modalContent = `<h5>${record.name}</h5>`;

            modalContent += `
                <p>Type: ${record.type}</p>
                <p>Date: ${new Date(record.date).toLocaleDateString()}</p>
            `;

            if (currentRecordType === 'WOD') {
                modalContent += `<p>Score: ${record.score}</p>`;
            } else if (currentRecordType === 'Weightlifting') {
                modalContent += `<p>Weight: ${record.weight} kg</p>`;
            } else if (currentRecordType === 'Cardio') {
                modalContent += `<p>Time: ${record.time}</p>`;
            }

            // Create modal if it doesn't exist
            let modal = document.getElementById('userRecordModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'userRecordModal';
                modal.className = 'modal fade';
                modal.tabIndex = -1;
                modal.role = 'dialog';
                modal.innerHTML = `
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Record Details</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="user-record-modal-body"></div>
                            <div class="modal-footer">
                                <!-- No Add to Records button here -->
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            // Set modal content
            document.getElementById('user-record-modal-body').innerHTML = modalContent;

            // Show modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }

        // Event listeners for record type buttons
        recordTypeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                recordTypeButtons.forEach((b) => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                currentRecordType = btn.dataset.type;
                loadUserRecords();
            });
        });

        // Initial load
        loadUserRecords();
    }

});


