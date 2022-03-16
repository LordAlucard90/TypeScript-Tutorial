import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos/1';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

axios.get(url).then(response => {
    const data = response.data as Todo;
    // console.log(data)
    const id = data.id;
    const title = data.title;
    const finished = data.completed;
    logTodo(id, title, finished);
});

const logTodo = (id: number, title: string, finished: boolean) => {
    console.log(`
                    The todo's data:
                        - id: ${id}
                        - title: ${title}
                        - finished: ${finished}
                    `);
};

