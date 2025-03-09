const todoActions = {
    add: ({ key, target: { value } }) => {
        const addTodoInputEle = document.getElementById('add-todo-input');
        const todoItem = {
            index: todoListActions.getTodoList().length,
            value,
            isDone: false
        }
        if (key === 'Enter') {
            todoListActions.updateTodoList('add', todoItem);
            todoListActions.renderTodoList();
            addTodoInputEle.value = '';
        }
    },

    update: todoItem => {
        todoListActions.updateTodoList('update', todoItem);
    },

    delete: todoItem => {
        todoListActions.updateTodoList('delete', todoItem);
        todoListActions.renderTodoList();
    }
}

const todoListActions = {
    getTodoList: () => JSON.parse(localStorage.getItem('todoList')) ?? [],

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
        localStorage.setItem('todoList', JSON.stringify(todoList));
    },

    renderTodoList: () => {
        const todoListEle = document.getElementById('todo-list');
        todoListEle.innerHTML = '';
        todoListActions.getTodoList().map(todoItem => {
            todoListEle.appendChild(elements.createTodoEle(todoItem));
        })
    }
}

const elements = {
    createTodoEle: todoItem => {
        // creating elements (checkbox, text & delete button) and appending them to the list element
        const todoItemEle = document.createElement('li');
        const todoCheckbox = document.createElement('input');
        const todoText = document.createElement('span');
        const todoDeleteBtn = document.createElement('i');

        todoItemEle.id = `todo_${todoItem.index}`;
        todoCheckbox.type = 'checkbox';
        todoText.textContent = todoItem.value;
        todoDeleteBtn.classList.add('fa-solid', 'fa-trash');

        //handling checkbox - checked, unchecked events
        todoCheckbox.onchange = function () {
            todoItem.isDone = this.checked;
            todoActions.update(todoItem);
        };
        if (todoItem.isDone) {
            todoText.classList.add('done');
            todoCheckbox.checked = todoItem.isDone;
        }

        //handling delete button click
        todoDeleteBtn.onclick = () => todoActions.delete(todoItem);

        todoItemEle.append(todoCheckbox, todoText, todoDeleteBtn);

        return todoItemEle;
    }
}

const init = () => {
    todoListActions.renderTodoList();
}

document.addEventListener('DOMContentLoaded', () => init());