//  Local Storage

const getTodosLocalStorage = () => {
    const todos =  JSON.parse(localStorage.getItem("todos")) || [];
    return todos
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0); // Corrigindo a chamada da função saveTodo
    })
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()
    const filterTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filterTodos));
}

const updateTodoStatusLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage()
    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem("todos", JSON.stringify(todos));

}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage()
    todos.map((todo) => todoOldText === todoText ? (todoText = todoNewText) : null)

    localStorage.setItem("todos", JSON.stringify(todos));

}

// Chamada para carregar os todos do localStorage
loadTodos();

// Restante do seu código






// Seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#calcel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-btn")
const filterBtn = document.querySelector("#filter-select")

let oldInputValue ;


// Funções

const saveTodo = (text, done = 0, save = 1) => {

    // Criando os elementos
    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    // Adicionando o icone
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)


    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    // Adicionando o icone
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)


    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    // Adicionando o icone
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    // Utilizando os dados da ls
    if(done){
        todo.classList.add("done")
    }

    if(save){
      saveTodoLocalStorage({text, done});
    }


    todoList.appendChild(todo)

    todoInput.value = ""
    todoInput.focus()
}


const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")
        
        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text
            updateTodoLocalStorage(oldInputValue,text)
        }
    })
}

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        const normalizedSearch = search.toLowerCase();
        
        // Verifica se o título da tarefa inclui o termo de pesquisa
        const isVisible = todoTitle.includes(normalizedSearch);
        
        // Define a visibilidade com base no resultado da verificação acima
        todo.style.display = isVisible ? "flex" : "none";
    });
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;
        
        case "done" : 
            todos.forEach((todo) => {
                if (todo.classList.contains("done")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
            });
            break;
    }
};



// Eventos

todoForm.addEventListener("submit" ,(e) => {
    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue){
        saveTodo(inputValue)
    }
})


document.addEventListener("click", (e) => {

    const targetEl = e.target
    // Elemento pai mais proximo
    const parentEl = targetEl.closest("div")

    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText
    }

    if(targetEl.classList.contains("finish-todo")){
        // Toggle usado para substituir. nao adicionar
        parentEl.classList.toggle("done")

        updateTodoStatusLocalStorage(todoTitle)
    }


    if(targetEl.classList.contains("remove-todo")){
        
        parentEl.remove()
        removeTodoLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains("edit-todo")){
       toggleForms();


       editInput.value = todoTitle;
       oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("click", (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
        updateTodo(editInputValue)
    }

    toggleForms()
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    getSearchTodos(search)
})


eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()
    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value
    console.log(filterValue)
    filterTodos(filterValue)
})


