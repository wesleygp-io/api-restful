const express = require('express');
const app = express();

app.use(express.json()); // Middleware para interpretar JSON

// Criamos o array "tasks" para armazenar nossas tarefas
let tasks = [
    { id: 1, title: 'Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', completed: false }
];

// Rota para testar se a API está funcionando
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Rota para listar todas as tarefas
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// Rota para criar uma nova tarefa (POST)
app.post('/tasks', (req, res) => {
    const { title } = req.body;

    // **VALIDAÇÃO: Verifica se o título foi fornecido**
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
    }

    // **VALIDAÇÃO: Título não pode exceder 100 caracteres**
    if (title.length > 100) {
        return res.status(400).json({ error: 'Título não pode ter mais de 100 caracteres' }); 
    }

    // Cria a nova tarefa
    const newTask = { id: tasks.length + 1, title, completed: false };
    
    // Adiciona a nova tarefa ao array 'tasks'
    tasks.push(newTask);

    // Retorna a nova tarefa com status 201 (Criado)
    res.status(201).json(newTask);
});

// Rota para atualizar uma tarefa (PUT)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params; // Pega o ID da tarefa na URL
    const { title, completed } = req.body;

    // **VALIDAÇÃO: Verifica se a tarefa existe**
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' }); // Caso não encontre a tarefa
    }

    // **VALIDAÇÃO: Verifica se o título é válido**
    if (title && (title.trim() === '' || title.length > 100)) {
        return res.status(400).json({ error: 'Título inválido. Verifique o título da tarefa.' });
    }

    // Atualiza a tarefa
    task.title = title || task.title;   // Mantém o título atual caso não tenha sido enviado um novo
    task.completed = completed !== undefined ? completed : task.completed; // Se não enviar o "completed", mantemos o valor atual

    // Retorna a tarefa atualizada
    res.status(200).json(task);
});

// Rota para excluir uma tarefa (DELETE)
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;  // Pega o ID da tarefa na URL
    const index = tasks.findIndex(t => t.id === parseInt(id)); // Encontra o índice da tarefa no array

    // **VALIDAÇÃO: Verifica se a tarefa existe**
    if (index === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Remove a tarefa do array
    tasks.splice(index, 1);

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
});

// Define a porta, utilizando a variável de ambiente PORT ou 4000 por padrão
const port = process.env.PORT || 4000;

// Inicia o servidor apenas se o arquivo index.js for executado diretamente
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

module.exports = app; // Exporta a aplicação para uso nos testes