const todoActions = {
    add: ({ key, target: { value } }) => {
        const addTodoInputEle = document.getElementById('add-todo-input');
        const todoItem = {
            index: todoListActions.getTodoList().length,
            value
        }
        if (key === 'Enter') {
            todoListActions.updateTodoList('add', todoItem);
            todoListActions.renderTodoList();
            addTodoInputEle.value = '';
        }
    },

    delete: todoItem => {
        todoListActions.updateTodoList('delete', todoItem);
        todoListActions.renderTodoList();
    }
}

const todoListActions = {
    getTodoList: () => JSON.parse(localStorage.getItem('todoList')) ?? [],

    updateTodoList: (action = 'update', todoItem = { index: '', value: '' }) => {
        let todoList = todoListActions.getTodoList();
        if (action === 'add') todoList.push(todoItem);
        else if (action === 'delete') todoList = todoList.filter(({ index }) => index !== todoItem.index);
        localStorage.setItem('todoList', JSON.stringify(todoList));
    },

    renderTodoList: () => {
        const todoListEle = document.getElementById('todo-list');
        todoListEle.innerHTML = '';
        todoListActions.getTodoList().map(todoItem => {
            todoListEle.appendChild(createTodoEle(todoItem));
        })
    }
}

const createTodoEle = (todoItem) => {
    const todoItemEle = document.createElement('li');

    const todoCheckbox = document.createElement('input');
    todoCheckbox.setAttribute('type', 'checkbox');

    const todoText = document.createElement('span');
    todoItemEle.setAttribute('id', 'todo_' + todoItem.index);
    todoText.textContent = todoItem.value;

    const todoDeleteBtn = document.createElement('button');
    todoDeleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todoDeleteBtn.onclick = () => todoActions.delete(todoItem);

    todoItemEle.append(todoCheckbox, todoText, todoDeleteBtn);

    return todoItemEle;
}

const init = () => {
    todoListActions.renderTodoList();
}

document.addEventListener('DOMContentLoaded', () => init());