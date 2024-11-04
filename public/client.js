// client.js

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
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password}),
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
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
                const response = await fetch('/api/logout', {method: 'POST'});
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

    if (trainingForm && trainingTypeSelect) {
        const trainingOptionsDiv = document.getElementById('training-options');
        const wodOptions = document.getElementById('wod-options');
        const weightliftingOptions = document.getElementById('weightlifting-options');
        const cardioOptions = document.getElementById('cardio-options');
        const trainingList = document.getElementById('training-list');

        let exerciseIndex = 0; // Index for unique names

        // Function to add event listeners to WOD type radios
        function addWodTypeListeners(container, index) {
            const timeInput = container.querySelector('.time-input');
            const countInput = container.querySelector('.count-input');
            const wodTypeRadios = container.querySelectorAll(`input[name="wod-type-${index}"]`);

            wodTypeRadios.forEach((radio) => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        if (radio.value === 'time') {
                            timeInput.style.display = 'block';
                            countInput.style.display = 'none';
                        } else if (radio.value === 'count') {
                            countInput.style.display = 'block';
                            timeInput.style.display = 'none';
                        }
                    }
                });
            });
        }

        // Training Type Change Event
        trainingTypeSelect.addEventListener('change', () => {
            const type = trainingTypeSelect.value;

            // Hide all options initially
            wodOptions.style.display = 'none';
            weightliftingOptions.style.display = 'none';
            cardioOptions.style.display = 'none';
            trainingOptionsDiv.style.display = 'none';

            if (type) {
                // Show the container
                trainingOptionsDiv.style.display = 'block';

                // Show options based on selected type
                if (type === 'WOD') {
                    wodOptions.style.display = 'block';
                    // Add event listeners to the initial WOD line
                    addWodTypeListeners(wodOptions.querySelector('.exercise-line'), 0);
                } else if (type === 'Weightlifting') {
                    weightliftingOptions.style.display = 'block';
                } else if (type === 'Cardio') {
                    cardioOptions.style.display = 'block';
                }
            }
        });

        // Trigger change event on page load to set initial state
        trainingTypeSelect.dispatchEvent(new Event('change'));

        // Add Line Functionality for WOD section
        const addLineBtn = document.getElementById('add-line-btn');
        if (addLineBtn) {
            addLineBtn.addEventListener('click', () => {
                exerciseIndex++; // Increment index
                const newExercise = document.createElement('div');
                newExercise.classList.add('exercise-line');

                newExercise.innerHTML = `
                    <div class="form-group">
                        <label>Exercise Name:</label>
                        <input type="text" name="exercise-name-${exerciseIndex}" class="form-control" placeholder="Enter exercise name">
                    </div>

                    <label>Type:</label>
                    <div class="form-check">
                        <input type="radio" name="wod-type-${exerciseIndex}" value="time" class="form-check-input">
                        <label class="form-check-label">Time</label>
                    </div>
                    <div class="form-check">
                        <input type="radio" name="wod-type-${exerciseIndex}" value="count" class="form-check-input">
                        <label class="form-check-label">Count</label>
                    </div>

                    <div class="time-input conditional-input" style="display: none;">
                        <div class="form-group">
                            <label>Enter time (min:sec):</label>
                            <div class="form-inline">
                                <input type="number" name="minutes-${exerciseIndex}" class="form-control mr-2" placeholder="Minutes">
                                <span>:</span>
                                <input type="number" name="seconds-${exerciseIndex}" class="form-control ml-2" placeholder="Seconds">
                            </div>
                        </div>
                    </div>

                    <div class="count-input conditional-input" style="display: none;">
                        <div class="form-group">
                            <label>Enter count:</label>
                            <input type="number" name="count-${exerciseIndex}" class="form-control" placeholder="Count">
                        </div>
                    </div>
                `;
                wodOptions.appendChild(newExercise);

                // Add event listeners to the new line
                addWodTypeListeners(newExercise, exerciseIndex);
            });
        }

        // Function to render trainings in the list
        function renderTrainings(trainings) {
            trainingList.innerHTML = ''; // empty the list
            trainings.forEach(training => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';

                const trainingInfo = document.createElement('div');
                const exercisesText = training.exercises.map(exercise => {
                    return `${exercise.exerciseName} ${exercise.time ? `(Time: ${exercise.time})` : ''} ${exercise.count ? `(Count: ${exercise.count})` : ''}`;
                }).join(', ');
                trainingInfo.textContent = `${training.type}: ${exercisesText}`;

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

                li.appendChild(trainingInfo);
                li.appendChild(deleteBtn);
                trainingList.appendChild(li);
            });
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

            let exercises = [];

            if (type === 'WOD') {
                const exerciseLines = document.querySelectorAll('#wod-options .exercise-line');
                exerciseLines.forEach((line, index) => {
                    const exerciseName = line.querySelector(`input[name="exercise-name-${index}"]`).value;
                    const wodType = line.querySelector(`input[name="wod-type-${index}"]:checked`)?.value;

                    let time = null;
                    let count = null;

                    if (wodType === 'time') {
                        const minutes = line.querySelector(`input[name="minutes-${index}"]`).value;
                        const seconds = line.querySelector(`input[name="seconds-${index}"]`).value;
                        time = `${minutes}:${seconds}`;
                    } else if (wodType === 'count') {
                        count = line.querySelector(`input[name="count-${index}"]`).value;
                    }

                    exercises.push({
                        exerciseName,
                        wodType,
                        time,
                        count,
                    });
                });
            } else if (type === 'Weightlifting') {
                const exerciseName = document.getElementById('weight-exercise-name').value;
                const count = document.getElementById('weight-count').value;
                const rounds = document.getElementById('rounds').value;

                exercises.push({
                    exerciseName,
                    count,
                    rounds,
                });
            } else if (type === 'Cardio') {
                const exerciseName = document.getElementById('cardio-exercise-name').value;
                const minutes = document.getElementById('cardio-minutes').value;
                const seconds = document.getElementById('cardio-seconds').value;
                const time = `${minutes}:${seconds}`;

                exercises.push({
                    exerciseName,
                    time,
                });
            }

            // Send data to the server
            try {
                const response = await fetch('/api/training', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, exercises })
                });

                const result = await response.json();
                if (response.ok) {
                    renderTrainings(result.trainings);
                    trainingForm.reset();
                    trainingOptionsDiv.style.display = 'none';
                    exerciseIndex = 0;
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});

// profile

document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const profileView = document.getElementById('profile-view');
    const profileEdit = document.getElementById('profile-edit');

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
});
