// public/gym.js

document.addEventListener('DOMContentLoaded', function() {
    const scheduleElement = document.getElementById('schedule');
    const currentWeekElement = document.getElementById('current-week');
    const addTrainingBtn = document.getElementById('add-training-btn');
    const trainingModalElement = document.getElementById('trainingModal');
    const trainingModal = new bootstrap.Modal(trainingModalElement);
    const trainingForm = document.getElementById('training-form');
    const deleteTrainingBtn = document.getElementById('delete-training-btn');

    let currentDate = new Date(); // Start with the current date
    let classesData = [];

    // Load the schedule for the current week
    loadSchedule();

    // Event Listeners
    document.getElementById('prev-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        loadSchedule();
    });

    document.getElementById('next-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        loadSchedule();
    });

    addTrainingBtn.addEventListener('click', () => {
        openTrainingModal();
    });

    trainingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const trainingId = document.getElementById('trainingId').value;
        const trainingData = {
            trainingName: document.getElementById('trainingName').value,
            date: document.getElementById('trainingDate').value,
            time: document.getElementById('trainingTime').value,
            trainer: document.getElementById('trainer').value,
            memberCapacity: document.getElementById('memberCapacity').value,
            location: document.getElementById('location').value,
            repeatWeekly: document.querySelector('input[name="repeatWeekly"]:checked').value === 'true'
        };

        try {
            if (trainingId) {
                // Update existing training
                await fetch(`/api/classes/${trainingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainingData)
                });
            } else {
                // Create new training
                await fetch('/api/classes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainingData)
                });
            }

            trainingModal.hide();
            loadSchedule();
        } catch (error) {
            console.error('Error saving training:', error);
        }
    });

    deleteTrainingBtn.addEventListener('click', async function() {
        const trainingId = document.getElementById('trainingId').value;
        if (trainingId) {
            if (confirm('Are you sure you want to delete this training?')) {
                try {
                    await fetch(`/api/classes/${trainingId}`, {
                        method: 'DELETE'
                    });
                    trainingModal.hide();
                    loadSchedule();
                } catch (error) {
                    console.error('Error deleting training:', error);
                }
            }
        }
    });

    // Functions
    async function loadSchedule() {
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        currentWeekElement.textContent = `Week of ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

        try {
            const response = await fetch(`/api/classes?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`);
            classesData = await response.json();
            renderSchedule(startOfWeek);
        } catch (error) {
            console.error('Error loading schedule:', error);
        }
    }

    function renderSchedule(startOfWeek) {
        scheduleElement.innerHTML = '';

        // Create a table for the schedule
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'table-sm');

        // Table header with days of the week
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            th.classList.add('text-center');
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body with time slots
        const tbody = document.createElement('tbody');

        // Define time slots (e.g., from 6 AM to 22 PM)
        for (let hour = 6; hour <= 22; hour++) {
            const row = document.createElement('tr');

            // Time label
            const timeCell = document.createElement('td');
            timeCell.textContent = `${hour}:00`;
            timeCell.classList.add('text-center', 'fw-bold');
            row.appendChild(timeCell);

            // Cells for each day
            for (let i = 0; i < 7; i++) {
                const cell = document.createElement('td');
                cell.classList.add('align-top');

                const cellDate = new Date(startOfWeek);
                cellDate.setDate(cellDate.getDate() + i);
                cellDate.setHours(hour, 0, 0, 0);

                // Find classes for this time slot
                const classesAtTime = classesData.filter(c => {
                    const classDate = new Date(c.time);
                    return classDate.getTime() === cellDate.getTime();
                });

                classesAtTime.forEach(c => {
                    const classDiv = document.createElement('div');
                    classDiv.textContent = c.trainingName;
                    classDiv.classList.add('class-entry', 'mb-1', 'p-1', 'bg-primary', 'text-white', 'rounded');
                    classDiv.style.cursor = 'pointer';
                    classDiv.addEventListener('click', () => {
                        openTrainingModal(c);
                    });
                    cell.appendChild(classDiv);
                });

                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        scheduleElement.appendChild(table);
    }

    function formatDateInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTimeInput(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function openTrainingModal(training = null) {
        if (training) {



            document.getElementById('trainingModalLabel').textContent = 'Edit Training';
            document.getElementById('trainingName').value = training.trainingName;

            const trainingDateTime = new Date(training.time);

            document.getElementById('trainingDate').value = formatDateInput(trainingDateTime);
            document.getElementById('trainingTime').value = formatTimeInput(trainingDateTime);
            document.getElementById('trainer').value = training.trainer || '';
            document.getElementById('memberCapacity').value = training.memberCapacity || '';
            document.getElementById('location').value = training.location || '';
            document.querySelector(`input[name="repeatWeekly"][value="${training.repeatWeekly}"]`).checked = true;
            document.getElementById('trainingId').value = training.id;
            deleteTrainingBtn.style.display = 'inline-block';
        } else {
            document.getElementById('trainingModalLabel').textContent = 'Add Training';
            trainingForm.reset();
            document.getElementById('trainingId').value = '';
            deleteTrainingBtn.style.display = 'none';
            // Set default date to current date
            document.getElementById('trainingDate').value = formatDateInput(currentDate);
        }
        trainingModal.show();
    }

    // Helper functions
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 (Sunday) - 6 (Saturday)
        const diff = (day === 0 ? -6 : 1) - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0,0,0,0);
        return d;
    }

    function formatDate(date) {
        return date.toLocaleDateString();
    }

    function formatDateInput(date) {
        return date.toISOString().split('T')[0];
    }
});
