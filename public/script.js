// VARIÁVEL DE CONFIGURAÇÃO CRÍTICA
// *** ALTERE ESTE VALOR COM O ENDEREÇO DA SUA API NA VPS ***
// Exemplo: 'http://SEU_DOMINIO.com:3000/api/usuario' 
const API_BASE_URL = 'http://localhost:3000/api/usuario'; 

// Exibe a URL na tela para confirmação
document.getElementById('api-url-display').textContent = API_BASE_URL;

const tabelaCorpo = document.querySelector('#tabela-utilizadores tbody');
const formNovoUtilizador = document.getElementById('form-novo-utilizador');
const mensagemPost = document.getElementById('mensagem-post');

// ----------------------------------------------------
// FUNÇÃO 1: CARREGAR/VISUALIZAR UTILIZADORES (GET)
// ----------------------------------------------------
async function carregarUtilizadores() {
    // Número de colunas na tabela (ID, Username, Token, Saldo, RTP, Influencer?, Agente ID)
    const COLUMNS = 7; 
    
    tabelaCorpo.innerHTML = `<tr><td colspan="${COLUMNS}">A carregar dados...</td></tr>`;

    try {
        // Faz a chamada GET para a API
        const response = await fetch(API_BASE_URL); 

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const utilizadores = await response.json();
        
        tabelaCorpo.innerHTML = ''; 

        if (utilizadores.length === 0) {
            tabelaCorpo.innerHTML = `<tr><td colspan="${COLUMNS}">Nenhum utilizador encontrado.</td></tr>`;
            return;
        }

        // Itera sobre os dados e cria uma linha na tabela para cada utilizador
        utilizadores.forEach(utilizador => {
            const row = tabelaCorpo.insertRow();
            
            // Colunas de dados (devem corresponder aos campos devolvidos pela sua API)
            row.insertCell(0).textContent = utilizador.id;
            row.insertCell(1).textContent = utilizador.username; 
            row.insertCell(2).textContent = utilizador.token; 
            row.insertCell(3).textContent = Number(utilizador.saldo).toFixed(2);
            row.insertCell(4).textContent = `${Number(utilizador.rtp).toFixed(2)}%`;
            row.insertCell(5).textContent = utilizador.isinfluencer === 1 ? 'Sim' : 'Não';
            row.insertCell(6).textContent = utilizador.agentid;
        });

    } catch (error) {
        console.error('Erro ao carregar utilizadores:', error);
        tabelaCorpo.innerHTML = `<tr><td colspan="${COLUMNS}">Erro de conexão: ${error.message}. Verifique o console ou API_BASE_URL.</td></tr>`;
    }
}

// ----------------------------------------------------
// FUNÇÃO 2: ADICIONAR NOVO UTILIZADOR (POST)
// ----------------------------------------------------
formNovoUtilizador.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    mensagemPost.textContent = 'A enviar dados...';
    mensagemPost.style.backgroundColor = '#ffc107'; 

    // Coleta todos os dados do formulário, incluindo os campos hidden
    const formData = new FormData(formNovoUtilizador);
    const novoUtilizador = {};
    formData.forEach((value, key) => novoUtilizador[key] = key === 'agentid' ? parseInt(value) : value);
    
    // Converte Saldo, RTP, etc., para números (assumindo que sua API espera números)
    novoUtilizador.saldo = parseFloat(novoUtilizador.saldo);
    // ... e assim por diante para todos os campos numéricos.

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoUtilizador), 
        });

        const resultado = await response.json();

        if (response.ok) {
            mensagemPost.textContent = `✅ Sucesso! Utilizador adicionado. ID: ${resultado.id || 'N/A'}`;
            mensagemPost.style.backgroundColor = '#d4edda'; 
            formNovoUtilizador.reset(); 
            // Os campos hidden precisam ser redefinidos manualmente se for o caso, 
            // mas como têm valores estáticos, não é estritamente necessário.
            carregarUtilizadores(); // Atualiza a lista
        } else {
            throw new Error(`Erro ao adicionar. Resposta da API: ${resultado.message || response.statusText}`);
        }

    } catch (error) {
        console.error('Erro no POST:', error);
        mensagemPost.textContent = `❌ Erro: ${error.message}`;
        mensagemPost.style.backgroundColor = '#f8d7da'; 
    }
});

// Carrega os utilizadores assim que a página é aberta
document.addEventListener('DOMContentLoaded', carregarUtilizadores);
