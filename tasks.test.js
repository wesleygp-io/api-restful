const request = require('supertest'); // Importa o supertest para fazer requisições
const { app, server } = require('../index'); // Importa o servidor e a aplicação

// Testes para a API de tarefas
describe('GET /tasks', () => {
    it('Deve retornar todas as tarefas', async () => {
        const response = await request(app).get('/tasks'); // Faz uma requisição GET para /tasks
        expect(response.status).toBe(200); // Verifica se o status da resposta é 200
        expect(response.body).toEqual(expect.arrayContaining([ // Verifica se o corpo da resposta contém um array de tarefas
            expect.objectContaining({ 
                id: expect.any(Number),
                title: expect.any(String),
                completed: expect.any(Boolean),
            })
        ]));
    });

     // Limpa recursos após os testes
     afterAll(() => {
        app.close && app.close(); // Fecha o servidor se ele tiver sido iniciado nos testes (boa prática)
    });
});