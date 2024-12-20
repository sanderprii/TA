// public/gym.js

document.addEventListener('DOMContentLoaded', function() {
    const scheduleElement = document.getElementById('schedule');
    const currentWeekElement = document.getElementById('current-week');
    const addTrainingBtn = document.getElementById('add-training-btn');
    const trainingModalElement = document.getElementById('trainingModal');
    const trainingModal = new bootstrap.Modal(trainingModalElement);
    const trainingForm = document.getElementById('training-form');
    const deleteTrainingBtn = document.getElementById('delete-training-btn');
    const dayButtonsContainer = document.getElementById('day-buttons');


    let currentDate = new Date(); // Start with the current date
    let classesData = [];

    let isSmallScreen = window.innerWidth < 1143; // Kontrollime, kas ekraan on väike
    let selectedDayIndex = 0; // Väiksel ekraanil valitud päeva indeks (0-6, 0 = esmaspäev)


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

    // Kui on väike ekraan, vaikimisi tänane päev
    if (isSmallScreen) {
        selectedDayIndex = getTodayDayIndex(new Date());
    }

    // Mon -> 0, Tue -> 1, jne. (Meie alguspunkt on esmaspäev, mitte pühapäev)
    function getTodayDayIndex(date) {
        const day = date.getDay(); // 0 (Sun) - 6 (Sat)
        return day === 0 ? 6 : day - 1; // Mon = 0, ..., Sun = 6
    }

    addTrainingBtn.addEventListener('click', () => {
        openTrainingModal();
    });

    trainingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const trainingId = document.getElementById('trainingId').value;
        const repeatWeeklyValue = document.querySelector('input[name="repeatWeekly"]:checked').value;
        const trainingData = {
            trainingName: document.getElementById('trainingName').value,
            date: document.getElementById('trainingDate').value,
            time: document.getElementById('trainingTime').value,
            trainer: document.getElementById('trainer').value,
            memberCapacity: document.getElementById('memberCapacity').value,
            location: document.getElementById('location').value,
            repeatWeekly: (repeatWeeklyValue === 'true') // boolean parse
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
        endOfWeek.setHours(23,59,59,999);
        currentWeekElement.textContent = `Week of ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

        try {
            const response = await fetch(`/api/classes?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`);
            classesData = await response.json();
            renderSchedule(startOfWeek);
        } catch (error) {
            console.error('Error loading schedule:', error);
        }
    }

    // Uuendame renderSchedule funktsiooni
    function renderSchedule(startOfWeek) {
        scheduleElement.innerHTML = ''; // Puhastame ajakava

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // Konteiner päevade jaoks
        const scheduleContainer = document.createElement('div');
        scheduleContainer.classList.add('schedule-container');

        if (isSmallScreen) {
            renderDayButtons(startOfWeek); // Kuvame päevanupud väikese ekraani jaoks
        }

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + i);

            if (isSmallScreen && selectedDayIndex !== i) {
                // Väikese ekraani jaoks kuvame ainult valitud päeva
                continue;
            }

            // Päeva tulp
            const dayColumn = document.createElement('div');
            dayColumn.classList.add('day-column');

            // Päeva pealkiri
            const dayHeader = document.createElement('div');
            dayHeader.textContent = `${days[i]} (${dayDate.toLocaleDateString()})`;
            dayHeader.classList.add('day-header');
            dayColumn.appendChild(dayHeader);

            // Filtreerime treeningud selle päeva jaoks ja sorteerime aja järgi
            const classesForDay = classesData
                .filter(c => {
                    const classDate = new Date(c.time);
                    return (
                        classDate.getFullYear() === dayDate.getFullYear() &&
                        classDate.getMonth() === dayDate.getMonth() &&
                        classDate.getDate() === dayDate.getDate()
                    );
                })
                .sort((a, b) => new Date(a.time) - new Date(b.time)); // Sortime aja järgi

            if (classesForDay.length === 0) {
                // Kui pole treeninguid, näitame sõnumit
                const noClassesMessage = document.createElement('p');
                noClassesMessage.textContent = 'No trainings scheduled.';
                noClassesMessage.classList.add('text-muted', 'fst-italic');
                dayColumn.appendChild(noClassesMessage);
            } else {
                // Lisame treeningud päeva tulpadesse
                classesForDay.forEach(classData => {
                    const classDiv = createClassDiv(classData);
                    dayColumn.appendChild(classDiv);
                });
            }

            scheduleContainer.appendChild(dayColumn);
        }

        scheduleElement.appendChild(scheduleContainer);
    }

// Event listener ekraani suuruse muutmiseks
    window.addEventListener('resize', () => {
        const wasSmallScreen = isSmallScreen;
        isSmallScreen = window.innerWidth < 769;

        if (wasSmallScreen !== isSmallScreen) {
            renderSchedule(getStartOfWeek(currentDate));
        }
    });





    // Funktsioon päevade nuppude loomiseks
    function renderDayButtons(startOfWeek) {
        dayButtonsContainer.innerHTML = '';
        const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 7; i++) {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'day-btn');
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + i);
            const dayNumber = dayDate.getDate();
            btn.textContent = `${dayNamesShort[i]} ${dayNumber}`;

            if (i === selectedDayIndex) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary');
            }

            btn.addEventListener('click', () => {
                selectedDayIndex = i;
                // uuenda nuppude stiili
                document.querySelectorAll('.day-btn').forEach((b, idx) => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline-primary');
                    if (idx === i) {
                        b.classList.add('btn-primary');
                        b.classList.remove('btn-outline-primary');
                    }
                });
                renderSchedule(startOfWeek);
            });

            dayButtonsContainer.appendChild(btn);
        }


    }


    window.addEventListener('resize', () => {
        const wasSmallScreen = isSmallScreen;
        isSmallScreen = window.innerWidth < 769;

        if (wasSmallScreen !== isSmallScreen) {
            // Renderda vaate muutus (päeva või nädala vaade)
            renderSchedule(getStartOfWeek(currentDate));
        }
    });



    function createClassDiv(classData) {
        const classDiv = document.createElement('div');
        classDiv.textContent = classData.trainingName;
        classDiv.classList.add('class-entry');
        classDiv.style.cursor = 'pointer';

        // Lisa sündmuse kuulaja, mis avab modaalakna klassi detailidega
        classDiv.addEventListener('click', () => {
            openTrainingModal(classData);
        });

        return classDiv;
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

            // Convert boolean to string to match the radio buttons value="true"/"false"
            const repeatValue = training.repeatWeekly ? 'true' : 'false';
            document.querySelector(`input[name="repeatWeekly"][value="${repeatValue}"]`).checked = true;

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

    function formatTimeInput(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
});
