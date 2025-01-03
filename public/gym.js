// public/gym.js

document.addEventListener('DOMContentLoaded', function () {
    const scheduleElement = document.getElementById('schedule');
    const currentWeekElement = document.getElementById('current-week');
    const addTrainingBtn = document.getElementById('add-training-btn');
    const trainingModalElement = document.getElementById('trainingModal');
    const trainingModal = new bootstrap.Modal(trainingModalElement);
    const trainingForm = document.getElementById('training-form');
    const deleteTrainingBtn = document.getElementById('delete-training-btn');
    const dayButtonsContainer = document.getElementById('day-buttons');

    const wodSearchInput = document.getElementById('wod-search');
    const wodSearchResults = document.getElementById('wod-search-results');
    const trainingTypeSelected = document.getElementById('training-type');

    const trainingModalSearch = new bootstrap.Modal(document.getElementById('training-modal'));
    const trainingModalBody = document.getElementById('training-modal-body');

    const editClassBtn = document.getElementById('edit-class-btn');

    const classModalElement = document.getElementById('classModal');
    const classModal = new bootstrap.Modal(classModalElement);
    const classAttendance = document.getElementById('classAttendance');

    const modalTrainingName = document.getElementById('modalTrainingName');
    const modalTime = document.getElementById('modalTime');
    const modalTrainer = document.getElementById('modalTrainer');
    const modalLocation = document.getElementById('modalLocation');
    const modalClassId = document.getElementById('modalClassId');
    const wodName = document.getElementById('wodName');
    const wodType = document.getElementById('wodType');
    const modalDescription = document.getElementById('modalDescription');

    const addTrainingBtnSave = document.getElementById('save-training-btn');
    const editTrainingBtn = document.getElementById('edit-training-btn');


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


    selectedDayIndex = getTodayDayIndex(new Date());


    // Mon -> 0, Tue -> 1, jne. (Meie alguspunkt on esmaspäev, mitte pühapäev)
    function getTodayDayIndex(date) {
        const day = date.getDay(); // 0 (Sun) - 6 (Sat)
        return day === 0 ? 6 : day - 1; // Mon = 0, ..., Sun = 6
    }

    addTrainingBtn.addEventListener('click', () => {

        openTrainingModal();
    });

    trainingForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const trainingId = document.getElementById('trainingId').value;
        const repeatWeeklyValue = document.querySelector('input[name="repeatWeekly"]:checked').value;
        const trainingData = {
                trainingName: document.getElementById('trainingName').value.toUpperCase(),
                date: document.getElementById('trainingDate').value,
                time: document.getElementById('trainingTime').value,
                duration: document.getElementById('duration').value,
                trainer: document.getElementById('trainer').value,
                memberCapacity: document.getElementById('memberCapacity').value,
                location: document.getElementById('location').value,
                repeatWeekly: (repeatWeeklyValue === 'true'),
                description: document.getElementById('trainingDescription').value,
                wodName: document.getElementById('wod-name').value.toUpperCase(),
                wodType: document.querySelector('input[name="wod-type"]:checked').value
            }
        ;


        try {
            if (trainingId) {
                // Update existing training
                await fetch(`/api/classes/${trainingId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(trainingData)
                });
            } else {

                // Create new training
                await fetch('/api/classes', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(trainingData)
                });
            }

            trainingModal.hide();
            loadSchedule();
        } catch (error) {
            console.error('Error saving training:', error);
        }
    });

    deleteTrainingBtn.addEventListener('click', async function () {
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
        endOfWeek.setHours(23, 59, 59, 999);
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
        scheduleContainer.classList.add('schedule-container', 'd-flex', 'w-100');


        renderDayButtons(startOfWeek); // Kuvame päevanupud väikese ekraani jaoks


        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + i);

            if (selectedDayIndex !== i) {
                // Väikese ekraani jaoks kuvame ainult valitud päeva
                continue;
            }

            // Päeva tulp
            const dayColumn = document.createElement('div');
            dayColumn.classList.add('day-column', 'flex-grow-1');

            // Päeva pealkiri
            const dayHeader = document.createElement('div');
            dayHeader.textContent = `${days[i]}`;
            dayHeader.classList.add('day-header');
            dayColumn.appendChild(dayHeader);

            // päeva kuupäev
            const dayNumber = document.createElement('div');
            dayNumber.textContent = `(${dayDate.toLocaleDateString()})`;
            dayNumber.classList.add('day-number');
            dayColumn.appendChild(dayNumber);

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
            btn.classList.add('rounded-pill', 'text-white', 'bg-dark', 'day-btn');

            btn.textContent = `${dayNamesShort[i]}`;

            if (i === selectedDayIndex) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary', 'bg-dark');
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
        classDiv.classList.add('border', 'border-dark', 'row', 'm-1', 'bg-light', 'rounded', 'text-center', 'py-2', 'px-3', 'text-black', 'class-entry', 'align-items-start');
        classDiv.style.cursor = 'pointer';

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('col-2', 'h-100', 'border-end', 'border-dark');


        const dataDiv = document.createElement('div');
        dataDiv.classList.add('col-9');


        const classInfoTime = document.createElement('div');
        const trainingDateTime = new Date(classData.time);
        classInfoTime.textContent = formatTimeInput(trainingDateTime);
        classInfoTime.classList.add('align-text-top', 'fw-bold');
        timeDiv.appendChild(classInfoTime);

        const trainingDuration = document.createElement('div');
        trainingDuration.textContent = classData.duration + ' min';
        trainingDuration.classList.add('text-muted', 'fst-italic', 'fs-6');
        timeDiv.appendChild(trainingDuration);

        const classInfoName = document.createElement('div');
        classInfoName.textContent = classData.trainingName;
        dataDiv.appendChild(classInfoName);
        classInfoName.classList.add('fw-bold', 'text-start');

        const classTrainer = document.createElement('div');
        classTrainer.textContent = classData.trainer;
        dataDiv.appendChild(classTrainer);
        classTrainer.classList.add('text-start');

        classDiv.appendChild(timeDiv);
        classDiv.appendChild(dataDiv);

        // Lisa sündmuse kuulaja, mis avab modaalakna klassi detailidega
        classDiv.addEventListener('click', () => {
            openClassModal(classData);
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
            document.getElementById('duration').value = training.duration || '';
            document.getElementById('trainer').value = training.trainer || '';
            document.getElementById('memberCapacity').value = training.memberCapacity || '';
            document.getElementById('location').value = training.location || '';

            // Convert boolean to string to match the radio buttons value="true"/"false"
            const repeatValue = training.repeatWeekly ? 'true' : 'false';
            document.querySelector(`input[name="repeatWeekly"][value="${repeatValue}"]`).checked = true;
            document.getElementById('wod-name').value = training.wodName || '';
            document.querySelector(`input[name="wod-type"][value="${training.wodType}"]`).checked = true;
            document.getElementById('trainingDescription').value = training.description || '';


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

    function showWODModal(wod) {
        trainingModalElement.style.display = 'none';
        classModalElement.style.display = 'none';
        trainingModalBody.innerHTML = `
            <h5>${wod.name}</h5>
            <p>${wod.type}</p>
            <p>${formatModalDescription(wod.description)}</p>
        `;

        addTrainingBtnSave.style.display = 'block';
        addTrainingBtnSave.textContent = 'Add Training';

        editTrainingBtn.style.display = 'none';

        // Add click event to Add Training button
        addTrainingBtnSave.onclick = () => {
            document.getElementById('wod-name').value = wod.name;
            document.querySelector(`input[name="wod-type"][value="${wod.type}"]`).checked = true;
            document.getElementById('trainingDescription').value = formatDescription(wod.description);

            wodSearchResults.style.display = 'none';
            trainingModalElement.style.display = 'block';
            classModalElement.style.display = 'block';
            trainingModalSearch.hide();
        };

        trainingModalSearch.show();
    }

    // load class attandance
    async function loadClassAttendance(classId) {
        try {
            const response = await fetch(`/api/class-attendees?classId=${classId}`);
            const data = await response.json();
            classAttendance.innerHTML = '';
            if (data.length > 0) {
                data.forEach(member => {
                    const memberDiv = document.createElement('div');


                    memberDiv.textContent = '👤 ' + member.user.fullName.toUpperCase();

                    classAttendance.appendChild(memberDiv);
                });
            } else {
                const noMembers = document.createElement('p');
                noMembers.textContent = 'No members enrolled.';
                noMembers.classList.add('text-muted', 'fst-italic');
                classAttendance.appendChild(noMembers);
            }
        } catch (err) {
            console.error('Error loading class attendance:', err);
        }
    }

    async function openClassModal(cls) {


        modalTrainingName.textContent = cls.trainingName;
        const classTime = new Date(cls.time);
        modalTime.textContent = classTime.toLocaleString();
        modalTrainer.textContent = cls.trainer || 'N/A';
        modalLocation.textContent = cls.location || 'N/A';
        modalClassId.value = cls.id;

        wodName.textContent = cls.wodName || 'N/A';
        wodType.textContent = cls.wodType || 'N/A';
        modalDescription.textContent = cls.description || 'N/A';
        if(!cls.wodName || cls.wodName.trim() === ''){
            wodInfo.style.display = 'none';
        } else {
            wodInfo.style.display = 'block';
        }
        await loadClassAttendance(cls.id);


        // Uus samm: lae class info (capacity, enrolled count)
        await loadClassInfo(cls.id);

        // Kontrolli, kas kasutaja on registreeritud

        const isEnrolled = await checkEnrollment(cls.id);

        // kui vajutab edit nuppu, siis avaneb training modal
        editClassBtn.addEventListener('click', () => {
            trainingModal.show();
            trainingModalBody.innerHTML = '';
            openTrainingModal(cls);
        })

        classModal.show();
    }

    async function loadClassInfo(classId) {
        try {
            const response = await fetch(`/api/class-info?classId=${classId}`);

            const data = await response.json();
            if (data.memberCapacity !== undefined && data.enrolledCount !== undefined) {
                const freeSpots = data.memberCapacity - data.enrolledCount;
                document.getElementById('freeSpots').textContent = freeSpots;
                document.getElementById('classCapacity').textContent = data.memberCapacity;
            } else {
                // Kui andmete lugemine ebaõnnestus, pane mingid vaikimisi väärtused
                document.getElementById('freeSpots').textContent = '?';
                document.getElementById('classCapacity').textContent = '?';
            }
        } catch (err) {
            console.error('Error loading class info:', err);
            document.getElementById('freeSpots').textContent = '?';
            document.getElementById('classCapacity').textContent = '?';
        }
    }

    async function checkEnrollment(classId) {
        try {
            const response = await fetch(`/api/is-enrolled?classId=${classId}`);
            const data = await response.json();

        } catch (err) {
            console.error('Error checking enrollment:', err);
        }
    }

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

    // Helper functions
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 (Sunday) - 6 (Saturday)
        const diff = (day === 0 ? -6 : 1) - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function formatDate(date) {
        return date.toLocaleDateString();
    }

    function formatDateInput(date) {
        return date.toISOString().split('T')[0];
    }

    function formatTimeInput(date) {
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
});
