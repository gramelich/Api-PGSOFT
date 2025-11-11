// API ONLINE - PGSOFT
const API_BASE = 'https://pg-api-pg.rkfmzx.easypanel.host/api';
let token = localStorage.getItem('pgsoft-token');

// Função para requisições com tratamento de erro
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers }
        });

        // Tenta ler JSON mesmo se erro
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            throw new Error(data.message || `Erro ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Login
async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Preencha email e senha!', 'error');
        return;
    }

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        token = data.token;
        localStorage.setItem('pgsoft-token', token);
        showMainSection();
        showMessage('Login realizado com sucesso!', 'success');
    } catch (error) {
        showMessage(`Erro: ${error.message}`, 'error');
    }
}

// Registro
async function register() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Preencha email e senha!', 'error');
        return;
    }

    try {
        await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        showMessage('Usuário registrado! Faça login.', 'success');
    } catch (error) {
        showMessage(`Erro: ${error.message}`, 'error');
    }
}

// Exibir mensagem
function showMessage(text, type) {
    const msg = document.getElementById('auth-message');
    msg.innerHTML = `<p style="color: ${type === 'error' ? '#ff6b6b' : '#90ee90'}">${text}</p>`;
}

// Mostrar tela principal
async function showMainSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    await Promise.all([loadBalance(), loadGames()]);
}

// Carregar saldo
async function loadBalance() {
    try {
        const data = await apiRequest('/users/balance');
        document.getElementById('balance').textContent = `R$ ${parseFloat(data.balance).toFixed(2)}`;
    } catch (error) {
        console.error('Saldo não carregado:', error);
    }
}

// Carregar jogos
async function loadGames() {
    try {
        const data = await apiRequest('/games');
        const select = document.getElementById('game-select');
        select.innerHTML = '<option value="">Selecione um jogo...</option>';

        data.forEach(game => {
            const opt = document.createElement('option');
            opt.value = game.id;
            opt.textContent = `${game.name} (RTP: ${game.rtp}%)`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Erro ao carregar jogos:', error);
    }
}

// Fazer spin
async function playSpin() {
    const gameId = document.getElementById('game-select').value;
    const bet = parseFloat(document.getElementById('bet-amount').value);
    const isDemo = document.getElementById('demo-mode').checked;

    if (!gameId) return showMessage('Selecione um jogo!', 'error');
    if (!bet || bet < 0.1) return showMessage('Aposta mínima: R$ 0.10', 'error');

    const endpoint = isDemo ? `/games/${gameId}/demo` : `/games/${gameId}/spin`;

    try {
        const data = await apiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify({ bet, lines: 20 })
        });

        const resultDiv = document.getElementById('spin-result');
        resultDiv.innerHTML = `
            <div style="background: #0a1a3a; padding: 15px; border-radius: 8px; border: 1px solid #00d4ff;">
                <p><strong>🎰 Resultado:</strong> ${data.total_win > 0 ? 'GANHOU!' : 'Perdeu'}</p>
                <p><strong>Prêmio:</strong> R$ ${data.total_win.toFixed(2)}</p>
                <p><strong>Multiplicador:</strong> x${data.multiplier || 0}</p>
                <p><strong>Saldo atual:</strong> R$ ${data.balance_after.toFixed(2)}</p>
                <p><em>Símbolos: ${data.symbols?.join(' → ') || 'N/A'}</em></p>
            </div>
        `;

        loadBalance();
        if (!isDemo) loadHistory();
    } catch (error) {
        document.getElementById('spin-result').innerHTML = `
            <p style="color: #ff6b6b">Erro: ${error.message}</p>
        `;
    }
}

// Histórico
async function loadHistory() {
    try {
        const data = await apiRequest('/history?limit=10');
        const list = document.getElementById('history-list');
        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = '<li>Nenhum histórico ainda.</li>';
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            const date = new Date(item.created_at).toLocaleString('pt-BR');
            const win = item.total_win > 0 ? `+R$ ${item.total_win}` : 'R$ 0.00';
            li.innerHTML = `
                <strong>${item.game_name}</strong><br>
                <small>Aposta: R$ ${item.bet} | ${win} | ${date}</small>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        console.error('Erro no histórico:', error);
    }
}

// Logout
function logout() {
    token = null;
    localStorage.removeItem('pgsoft-token');
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('auth-message').innerHTML = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// Auto-login se já tiver token
if (token) {
    showMainSection().catch(() => {
        logout(); // Token inválido
    });
}
