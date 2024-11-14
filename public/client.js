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
        const addLineBtn = document.getElementById('add-line-btn');

        // Ensure all elements exist before proceeding
        if (
            trainingOptionsDiv &&
            wodOptions &&
            weightliftingOptions &&
            cardioOptions &&
            trainingList
        ) {
            // Training Type Change Event
            // Training Type Change Event
            trainingTypeSelect.addEventListener('change', () => {
                const type = trainingTypeSelect.value;

                // Hide all options initially
                wodOptions.style.display = 'none';
                weightliftingOptions.style.display = 'none';
                cardioOptions.style.display = 'none';
                trainingOptionsDiv.style.display = 'none';

                // Show the date input field
                const trainingDateDiv = document.getElementById('training-date-div');
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

            // Add Line Functionality for WOD section
            if (addLineBtn) {
                addLineBtn.addEventListener('click', () => {
                    const exerciseLinesDiv = document.getElementById('exercise-lines');
                    const newExercise = document.createElement('div');
                    newExercise.classList.add('exercise-line');

                    newExercise.innerHTML = `
                        <div class="form-row align-items-center mt-2">
                            <div class="col">
                                <input type="text" name="exercise-name" class="form-control" placeholder="Exercise Name">
                            </div>
                            <div class="col">
                                <input type="text" name="wod-input" class="form-control" placeholder="Enter Time or Count">
                            </div>
                        </div>
                    `;
                    exerciseLinesDiv.appendChild(newExercise);

                    // Move the "Add Line" button after the new exercise line
                    exerciseLinesDiv.appendChild(addLineBtn);
                });
            }

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

// Function to show the training details in a modal
            function showTrainingModal(training) {
                // Clear previous modal content
                trainingModalBody.innerHTML = '';

                // Build modal content
                const detailsDiv = document.createElement('div');

                const detailsList = document.createElement('ul');
                detailsList.className = 'list-group';

                if (training.type === 'WOD') {
                    // Add specific details based on wodType
                    if (training.wodType === 'For Time') {
                        if (training.sets && training.sets > 1) {
                            const detailItem = document.createElement('li');
                            detailItem.className = 'list-group-item font-weight-bold';
                            detailItem.textContent = `${training.sets} sets`;
                            detailsList.appendChild(detailItem);
                        }
                    } else if (training.wodType === 'EMOM') {
                        const detailItem = document.createElement('li');
                        detailItem.className = 'list-group-item font-weight-bold';
                        detailItem.textContent = `Every ${training.every} minute(s) for ${training.forTime} minutes`;
                        detailsList.appendChild(detailItem);

                        const setsItem = document.createElement('li');
                        setsItem.className = 'list-group-item font-weight-bold';
                        setsItem.textContent = `${training.sets} round(s)`;
                        detailsList.appendChild(setsItem);
                    } else if (training.wodType === 'AMRAP') {
                        const detailItem = document.createElement('li');
                        detailItem.className = 'list-group-item font-weight-bold';
                        detailItem.textContent = `AMRAP ${training.minutes} minute(s)`;
                        detailsList.appendChild(detailItem);
                    } else if (training.wodType === 'Tabata') {
                        const detailItem = document.createElement('li');
                        detailItem.className = 'list-group-item font-weight-bold';
                        detailItem.textContent = `Rounds: ${training.rounds}, Work: ${training.work} sec, Rest: ${training.rest} sec`;
                        detailsList.appendChild(detailItem);
                    }

                    // Add exercises
                    training.exercises.forEach((exercise) => {
                        const detailItem = document.createElement('li');
                        detailItem.className = 'list-group-item';
                        detailItem.textContent = `${exercise.exerciseName}: ${exercise.inputValue}`;
                        detailsList.appendChild(detailItem);
                    });
                } else {
                    // Handle other training types if needed
                    // For example, Weightlifting, Cardio, etc.
                    training.exercises.forEach((exercise) => {
                        const detailItem = document.createElement('li');
                        detailItem.className = 'list-group-item';

                        if (training.type === 'Weightlifting') {
                            detailItem.textContent = `${exercise.exerciseName} - Count: ${exercise.count}, Rounds: ${exercise.rounds}`;
                        } else if (training.type === 'Cardio') {
                            detailItem.textContent = `${exercise.exerciseName} - Time: ${exercise.time}`;
                        }

                        detailsList.appendChild(detailItem);
                    });
                }

                detailsDiv.appendChild(detailsList);
                trainingModalBody.appendChild(detailsDiv);

                // Show the modal
                const modalElement = document.getElementById('training-modal');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
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

            loadTrainings(); // Load trainings on initial page load

            // Training Form Submission
            trainingForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const type = trainingTypeSelect.value;
                const date = document.getElementById('training-date').value; // Get the date

                let exercises = [];

                if (type === 'WOD') {
                    const wodName = document.getElementById('wod-name').value;

                    // Get selected WOD type
                    const wodTypeRadio = document.querySelector('input[name="wod-type"]:checked');
                    const wodType = wodTypeRadio ? wodTypeRadio.value : null;

                    // Collect additional inputs based on WOD type
                    let sets, every, forTime, minutes, rounds, work, rest;

                    if (wodType === 'For Time') {
                        sets = document.getElementById('sets').value || '1';
                    } else if (wodType === 'EMOM') {
                        every = document.getElementById('every').value;
                        forTime = document.getElementById('forTime').value;
                        sets = document.getElementById('sets').value || '1';
                    } else if (wodType === 'AMRAP') {
                        minutes = document.getElementById('minutes').value;
                    } else if (wodType === 'Tabata') {
                        rounds = document.getElementById('rounds').value;
                        work = document.getElementById('work').value;
                        rest = document.getElementById('rest').value;
                    }

                    const exerciseLines = document.querySelectorAll('#exercise-lines .exercise-line');
                    exerciseLines.forEach((line) => {
                        const exerciseName = line.querySelector('input[name="exercise-name"]').value;
                        const inputValue = line.querySelector('input[name="wod-input"]').value;

                        exercises.push({
                            exerciseName,
                            inputValue,
                        });
                    });

                    // Prepare the training data
                    var trainingData = {
                        type,
                        date,
                        wodName,
                        wodType,
                        sets,
                        every,
                        forTime,
                        minutes,
                        rounds,
                        work,
                        rest,
                        exercises,
                    };
                }

                // ... existing code for other training types ...

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
                        wodTypeOptionsDiv.innerHTML = ''; // Clear WOD type options
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });


        } else {
            console.warn('Training options elements not found.');
        }
// WOD Type Selection
        const wodTypeRadios = document.getElementsByName('wod-type');
        const wodTypeOptionsDiv = document.getElementById('wod-type-options');

        wodTypeRadios.forEach((radio) => {
            radio.addEventListener('change', () => {
                const selectedWodType = radio.value;
                wodTypeOptionsDiv.innerHTML = ''; // Clear previous inputs

                if (selectedWodType === 'For Time') {
                    wodTypeOptionsDiv.innerHTML = `
          <div class="form-group">
            <label for="sets">Sets</label>
            <input type="number" id="sets" class="form-control" min="1" value="1">
          </div>
        `;
                } else if (selectedWodType === 'EMOM') {
                    wodTypeOptionsDiv.innerHTML = `
          <div class="form-group">
            <label for="every">Every (minutes)</label>
            <input type="number" id="every" class="form-control" min="1">
          </div>
          <div class="form-group">
            <label for="forTime">For (minutes)</label>
            <input type="number" id="forTime" class="form-control" min="1">
          </div>
          <div class="form-group">
            <label for="sets">Sets</label>
            <input type="number" id="sets" class="form-control" min="1" value="1">
          </div>
        `;
                } else if (selectedWodType === 'AMRAP') {
                    wodTypeOptionsDiv.innerHTML = `
          <div class="form-group">
            <label for="minutes">Minutes</label>
            <input type="number" id="minutes" class="form-control" min="1">
          </div>
        `;
                } else if (selectedWodType === 'Tabata') {
                    wodTypeOptionsDiv.innerHTML = `
          <div class="form-group">
            <label for="rounds">Rounds</label>
            <input type="number" id="rounds" class="form-control" min="1">
          </div>
          <div class="form-group">
            <label for="work">Work (seconds)</label>
            <input type="number" id="work" class="form-control" min="1">
          </div>
          <div class="form-group">
            <label for="rest">Rest (seconds)</label>
            <input type="number" id="rest" class="form-control" min="0">
          </div>
        `;
                }
            });
        });

    }

    // **Profile Page Scripts**
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

    // **Records Page Scripts**
    const recordEditButtons = document.querySelectorAll('.edit-btn');

    if (recordEditButtons.length > 0) {
        recordEditButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = this.closest('.record-row');
                const input = row.querySelector('.record-input');
                const value = row.querySelector('.record-value');
                const editBtn = row.querySelector('.edit-btn');
                const saveBtn = row.querySelector('.save-btn');

                // Show input and Save button, hide value and Edit button
                input.classList.remove('d-none');
                value.classList.add('d-none');
                editBtn.classList.add('d-none');
                saveBtn.classList.remove('d-none');
            });
        });

        const saveButtons = document.querySelectorAll('.save-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', async function () {
                const row = this.closest('.record-row');
                const input = row.querySelector('.record-input');
                const value = row.querySelector('.record-value');
                const editBtn = row.querySelector('.edit-btn');
                const saveBtn = row.querySelector('.save-btn');
                const label = row.getAttribute('data-label');

                try {
                    const recordValue = input.value;
                    const response = await fetch('/records', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ [label]: recordValue })
                    });

                    if (response.ok) {
                        value.textContent = recordValue || 'Insert record';
                        alert('Record updated successfully!');
                    } else {
                        const result = await response.json();
                        alert('Failed to update record: ' + result.error);
                    }
                } catch (error) {
                    console.error('Error updating record:', error);
                    alert('An error occurred.');
                }

                // Show value and Edit button, hide input and Save button
                input.classList.add('d-none');
                value.classList.remove('d-none');
                editBtn.classList.remove('d-none');
                saveBtn.classList.add('d-none');
            });
        });
    } else {
        console.warn('No record edit buttons found.');
    }

    // Sessions Page Code
    if (document.getElementById('calendar') &&
        typeof trainingsData !== 'undefined' &&
        typeof FullCalendar !== 'undefined') {
        // The sessions page is loaded, and trainingsData is available
        initializeCalendar();
    } else if (document.getElementById('calendar') && typeof FullCalendar === 'undefined') {
        console.error('FullCalendar is not loaded.');
    } else {
        console.error('Conditions not met to initialize the calendar.');
        console.log('document.getElementById(\'calendar\'):', document.getElementById('calendar'));
        console.log('typeof trainingsData:', typeof trainingsData);
        console.log('typeof FullCalendar:', typeof FullCalendar);
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

// Function to show the training details in a modal
function showTrainingModal(training) {
    // Build modal content
    let modalContent = `
    <h5>${training.type}</h5>
    <p>Date: ${new Date(training.date).toLocaleDateString()}</p>
  `;

    if (training.type === 'WOD') {
        modalContent += training.wodName ? `<p>WOD Name: ${training.wodName}</p>` : '';
        modalContent += training.wodType ? `<p>WOD Type: ${training.wodType}</p>` : '';
        // Add WOD-specific details
    }

    modalContent += '<ul>';
    training.exercises.forEach((exercise) => {
        modalContent += `<li>${exercise.exerciseName}: ${exercise.inputValue || exercise.count || exercise.time}</li>`;
    });
    modalContent += '</ul>';

    // Create a modal element if it doesn't exist
    let modal = document.getElementById('trainingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trainingModal';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.role = 'dialog';
        modal.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Training Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="training-modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(modal);
    }

    // Set the modal content
    document.getElementById('training-modal-body').innerHTML = modalContent;

    // Show the modal using Bootstrap 5
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

}); // End of document.addEventListener('DOMContentLoaded', ...)
