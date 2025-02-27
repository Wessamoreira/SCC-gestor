const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Modelo do Antidoping
const Antidoping = mongoose.model('Antidoping', new mongoose.Schema({
    atletaNome: String,
    dataTeste: Date,
    resultado: String
}));

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/olimpiadas', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware para parsing JSON
app.use(express.json());

// Rota para salvar o antidoping
app.post('/antidoping', async (req, res) => {
    const { atletaNome, dataTeste, resultado } = req.body;

    // Verificando se todos os dados necessários foram enviados
    if (!atletaNome || !dataTeste || !resultado) {
        return res.status(400).send({ message: "Todos os campos são obrigatórios!" });
    }

    const novoAntidoping = new Antidoping({
        atletaNome,
        dataTeste: new Date(dataTeste),  // Convertendo para Date
        resultado,
    });

    try {
        // Salvando os dados no MongoDB
        await novoAntidoping.save();
        res.status(200).send({ message: 'Teste antidoping salvo com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar antidoping:", error);
        res.status(500).send({ message: 'Erro ao salvar o teste antidoping', error });
    }
});

// Iniciar o servidor
app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
