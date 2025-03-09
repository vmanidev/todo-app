const todoActions = {
    add: ({ key, target: { value } }) => {
        if (key !== 'Enter') return;
        const addTodoInputEle = document.getElementById('add-todo-input');
        const todoItem = {
            value,
            isDone: false
        }
        todoListActions.updateTodoList('add', todoItem);
        todoListActions.renderTodoList();
        addTodoInputEle.value = '';
    },

    update: todoItem => {
        todoListActions.updateTodoList('update', todoItem);
    },

    delete: todoItem => {
        todoListActions.updateTodoList('delete', todoItem);
        todoListActions.renderTodoList();
    },

    markAsDone: ({ isDone }, todoText, todoCheckbox) => {
        todoCheckbox.checked = isDone;
        if (isDone) todoText.classList.add('done');
        else todoText.classList.remove('done');
    },

    edit: ({ key, target: { value } }) => {
        if (key !== 'Enter') return;
        const todoList = todoListActions.getTodoList();
        todoList[Number(elements.getEditTodoInputEle().dataset.index)].value = value;
        todoListActions.syncTodosWithStorage(todoList);
        todoListActions.renderTodoList();
        elements.showHideEditTodoPopup({ show: false });
    }
}

const todoListActions = {
    getTodoList: () => {
        const todoList = JSON.parse(localStorage.getItem('todoList')) ?? [];
        if (todoList.length > 0) {
            todoList.map((todoItem, index) => todoItem.index = index);
        }
        return todoList;
    },

    updateTodoList: (action, todoItem) => {
        let todoList = todoListActions.getTodoList();
        if (action === 'add') {
            todoList.push(todoItem);
        }
        else if (action === 'delete') {
            todoList = todoList.filter(({ index }) => index !== todoItem.index);
        }
        else if (action === 'update') {
            todoList.forEach(item => {
                if (item.index === todoItem.index) item.isDone = todoItem.isDone;
            })
        }
        todoListActions.syncTodosWithStorage(todoList);
    },

    syncTodosWithStorage: todoList => localStorage.setItem('todoList', JSON.stringify(todoList)),

    renderTodoList: () => {
        const todoListEle = document.getElementById('todo-list');
        todoListEle.innerHTML = '';
        todoListActions.getTodoList().map(todoItem => {
            todoListEle.appendChild(elements.createTodoEle(todoItem));
        })
    }
}

const display = {
    toggleMode: () => {
        const toggleIcon = document.getElementById('toggle-icon');
        toggleIcon.classList.toggle('fa-sun');
        toggleIcon.classList.toggle('fa-moon');
        document.body.classList.toggle('dark-mode');
    }
}

const elements = {
    getEditTodoInputEle: () => document.getElementById('edit-todo-input'),

    createTodoEle: todoItem => {
        // create elements (checkbox, text, delete & edit button) and append to the list element
        const todoItemEle = document.createElement('li');
        const todoCheckbox = document.createElement('input');
        const todoText = document.createElement('span');
        const todoDeleteBtn = document.createElement('i');
        const todoEditBtn = document.createElement('i');

        todoItemEle.id = `todo_${todoItem.index}`;
        todoCheckbox.type = 'checkbox';
        todoText.textContent = todoItem.value;
        todoDeleteBtn.classList.add('fa-solid', 'fa-trash');
        todoEditBtn.classList.add('fa-solid', 'fa-pen-to-square');

        //handle checkbox click
        todoCheckbox.onchange = $event => {
            $event.stopImmediatePropagation();
            todoItem.isDone = $event.target.checked;
            todoCheckbox.checked = todoItem.isDone;
            todoActions.markAsDone(todoItem, todoText, todoCheckbox);
            todoActions.update(todoItem);
        };

        //mark a todo item if it is already done
        todoActions.markAsDone(todoItem, todoText, todoCheckbox);

        //handle delete button click
        todoDeleteBtn.onclick = $event => {
            $event.stopImmediatePropagation();
            todoActions.delete(todoItem);
        }

        //handle edit button click
        todoEditBtn.onclick = $event => {
            elements.showHideEditTodoPopup({ show: true });
            const editTodoInput = elements.getEditTodoInputEle();
            editTodoInput.value = todoItem.value;
            editTodoInput.dataset.index = todoItem.index;
        }

        todoItemEle.append(todoCheckbox, todoText, todoEditBtn, todoDeleteBtn);

        return todoItemEle;
    },

    showHideEditTodoPopup: ({ show = false }) => {
        const editPopupEle = document.getElementById('edit-todo-popup');
        if (show) editPopupEle.style.display = 'block';
        else editPopupEle.style.display = 'none';
    }
}

const init = () => {
    todoListActions.renderTodoList();
}

document.addEventListener('DOMContentLoaded', () => init());