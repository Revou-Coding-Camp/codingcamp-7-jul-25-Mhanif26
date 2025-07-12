document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterStatus = document.getElementById('filter-status');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const renderTodos = () => {
        todoList.innerHTML = '';
        const filter = filterStatus.value;

        const filteredTodos = todos.filter(todo => {
            if (filter === 'all') {
                return true;
            } else if (filter === 'completed') {
                return todo.completed;
            } else {
                return !todo.completed;
            }
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-id', todo.id);
            if (todo.completed) {
                li.classList.add('completed');
            }

            const todoTextSpan = document.createElement('span');
            todoTextSpan.classList.add('todo-text');
            if (todo.completed) {
                todoTextSpan.classList.add('completed');
            }
            todoTextSpan.innerHTML = `${todo.text} <br><small>Tenggat: ${todo.date}</small>`;


            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const toggleButton = document.createElement('button');
            toggleButton.classList.add('toggle-button');
            
            toggleButton.textContent = todo.completed ? 'Batalkan' : 'Selesai';
            toggleButton.addEventListener('click', () => toggleTodo(todo.id));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Hapus'; 
            deleteButton.addEventListener('click', () => deleteTodo(todo.id));

            actionsDiv.appendChild(toggleButton);
            actionsDiv.appendChild(deleteButton);

            li.appendChild(todoTextSpan);
            li.appendChild(actionsDiv);
            todoList.appendChild(li);
        });
    };


    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = todoInput.value.trim();
        const date = dateInput.value;

        if (!text || !date) {
            alert('To-Do dan tanggal tidak boleh kosong!');
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert('Due date cannot be in the past!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            date: date,
            completed: false
        };
        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        dateInput.value = '';
        renderTodos();
    });

    const toggleTodo = (id) => {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    filterStatus.addEventListener('change', renderTodos);

    renderTodos();
});