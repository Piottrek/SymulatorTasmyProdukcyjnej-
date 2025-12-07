const API_URL = "http://localhost:8080/api";
let stompClient = null;

function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
}

// WebSocket
function connectWS() {
    const sock = new SockJS("/ws-produkcja");
    stompClient = Stomp.over(sock);
    stompClient.debug = null;

    stompClient.connect({}, () => {
        stompClient.subscribe("/temat/zmiany", msg => {
            const zad = JSON.parse(msg.body);
            refreshTask(zad);
        });
    });
}


async function loadTasks() {
    const res = await fetch(`${API_URL}/zadania`);
    const tasks = await res.json();

    ["NOWE", "W_TOKU", "ZAKONCZONE"].forEach(s => {
        document.getElementById(`list-${s}`).innerHTML = "";
    });

    tasks.forEach(renderTask);
}

async function addTask() {
    const nameInput = document.getElementById('taskName');
    const priorityInput = document.getElementById('taskPriority');

    const value = nameInput.value.trim();
    const isPriority = priorityInput.checked;

    if (!value) return;

    try {
        await fetch(
            `${API_URL}/zadania?nazwa=${encodeURIComponent(value)}&priorytet=${isPriority}`,
            { method: 'POST' }
        );
        nameInput.value = '';
        priorityInput.checked = false;

        await loadTasks();
        toast('Dodano nowe zadanie.');
    } catch (e) {
        console.error('Błąd dodawania zadania', e);
        toast('Nie udało się dodać zadania.');
    }
}

async function changeStatus(id, status) {
    try {
        await fetch(`${API_URL}/zadania/${id}/status?status=${status}`, { method: "POST" });
    } catch (e) {
        console.error('Błąd zmiany statusu', e);
        toast('Nie udało się zmienić statusu.');
    }
}

async function changeStrategy(s) {
    try {
        await fetch(`${API_URL}/strategia?strategia=${s}`, { method: "POST" });
        document.getElementById("btnStrategyFifo").classList.toggle("active", s === "FIFO");
        document.getElementById("btnStrategyPriorytet").classList.toggle("active", s === "PRIORYTET");
        await loadTasks();
        toast("Zmieniono strategię.");
    } catch (e) {
        console.error('Błąd zmiany strategii', e);
        toast('Nie udało się zmienić strategii.');
    }
}

async function undo() {
    try {
        await fetch(`${API_URL}/cofnij`, { method: "POST" });
        await loadTasks();
        toast("Cofnięto operację.");
    } catch (e) {
        console.error('Błąd cofania', e);
        toast('Nie udało się cofnąć.');
    }
}

function renderTask(task) {
    const container = document.getElementById(`list-${task.status}`);
    if (!container) return;

    const card = document.createElement('div');
    card.className = `task-card ${task.status}`;
    card.id = `task-${task.id}`;

    const priorityLabel = task.priorytet ? '🔥 [PRIORYTET] ' : '';

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${priorityLabel}#${task.id} ${task.nazwa}</div>
            <div class="badge-status ${task.status}">${formatStatus(task.status)}</div>
        </div>
        <div class="task-meta">
            <span>Utworzono: ${task.dataUtworzenia}</span>
        </div>
        <div class="task-actions">
            ${task.status === 'NOWE'
        ? `<button class="btn-small btn-status-start" data-action="start">Start ➜</button>`
        : ''}
            ${task.status === 'W_TOKU'
        ? `<button class="btn-small btn-status-end" data-action="finish">Zakończ ✅</button>`
        : ''}
        </div>
    `;

    const startBtn = card.querySelector('[data-action="start"]');
    const finishBtn = card.querySelector('[data-action="finish"]');

    if (startBtn) {
        startBtn.addEventListener('click', () => changeStatus(task.id, 'W_TOKU'));
    }
    if (finishBtn) {
        finishBtn.addEventListener('click', () => changeStatus(task.id, 'ZAKONCZONE'));
    }

    container.appendChild(card);
}

function refreshTask(task) {
    const old = document.getElementById(`task-${task.id}`);
    if (old) old.remove();
    renderTask(task);
}

function formatStatus(s) {
    return s === "NOWE" ? "Nowe" :
        s === "W_TOKU" ? "W toku" :
            "Zakończone";
}

document.getElementById("btnAddTask").addEventListener('click', addTask);
document.getElementById("taskName").addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});
document.getElementById("btnUndo").addEventListener('click', undo);
document.getElementById("btnStrategyFifo").addEventListener('click', () => changeStrategy("FIFO"));
document.getElementById("btnStrategyPriorytet").addEventListener('click', () => changeStrategy("PRIORYTET"));

connectWS();
loadTasks();
