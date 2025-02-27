// ui.js

// Função para abrir o modal de adição/edição de atletas
function openModal(index = null) {
    document.getElementById("modal").classList.remove("hidden");
    
    // Se a index não for nula, significa que estamos editando um atleta
    if (index !== null) {
        const atleta = atletas[index];
        document.getElementById("nomeAtleta").value = atleta.nome;
        document.getElementById("dataNascimento").value = atleta.dataNascimento;
        document.getElementById("modal").dataset.index = index;
    } else {
        // Caso contrário, é um novo atleta
        document.getElementById("modal").dataset.index = "";
        document.getElementById("nomeAtleta").value = "";
        document.getElementById("dataNascimento").value = "";
    }
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("nomeAtleta").value = "";
    document.getElementById("dataNascimento").value = "";
}

// Função para renderizar a tabela de atletas
function atualizarTabela() {
    const tabela = $("#tabelaAtletas").DataTable();
    tabela.clear();
    atletas.forEach((atleta, index) => {
        tabela.row.add([
            atleta.nome,
            atleta.dataNascimento,
            `<button onclick="editarAtleta(${index})" class="bg-yellow-500 text-white py-1 px-2 rounded">Editar</button>
             <button onclick="deletarAtleta(${atleta.id})" class="bg-red-500 text-white py-1 px-2 rounded ml-2">Excluir</button>`
        ]);
    });
    tabela.draw();
}

// Função para carregar os atletas
async function carregarAtletas() {
    try {
        const response = await fetch("http://localhost:8000/atletas", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            atletas = await response.json();
            atualizarTabela();
        } else {
            console.error('Erro ao carregar atletas:', response.statusText);
            alert("Erro ao carregar atletas");
        }
    } catch (error) {
        console.error('Erro ao carregar atletas:', error);
        alert("Erro ao carregar atletas");
    }
}

// Função para editar um atleta
function editarAtleta(index) {
    openModal(index);
}

// Função para deletar um atleta
async function deletarAtleta(id) {
    if (confirm("Deseja excluir este atleta?")) {
        try {
            const response = await fetch(`http://localhost:8000/atletas/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                alert('Atleta excluído com sucesso!');
                await carregarAtletas();
            } else {
                alert("Erro ao excluir atleta");
            }
        } catch (error) {
            console.error('Erro ao excluir atleta:', error);
            alert("Erro ao excluir atleta");
        }
    }
}

// Função para salvar o atleta
async function salvarAtleta() {
    const nome = document.getElementById("nomeAtleta").value;
    const dataNascimento = document.getElementById("dataNascimento").value;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!nome || !dataNascimento) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const atletaData = { nome, dataNascimento };

    let url = "http://localhost:8000/atletas";
    let method = "POST";
    const index = document.getElementById("modal").dataset.index;

    // Se estiver editando um atleta
    if (index !== "") {
        const atleta = atletas[index];
        url += `/${atleta.id}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(atletaData)
        });

        if (response.ok) {
            alert('Atleta salvo com sucesso!');
            await carregarAtletas();
            closeModal();
        } else {
            alert("Erro ao salvar atleta");
        }
    } catch (error) {
        console.error('Erro ao salvar atleta:', error);
        alert("Erro ao salvar atleta");
    }
}

// Função para logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Função que é chamada quando o DOM estiver pronto
$(document).ready(() => {
    $("#tabelaAtletas").DataTable();
    carregarAtletas();
});