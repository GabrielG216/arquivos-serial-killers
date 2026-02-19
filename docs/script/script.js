// Selecionar elementos
const btnPrincipal = document.querySelector('.pages button:first-child');
const btnCriador = document.querySelector('.pages button:last-child');
const divPrincipal = document.querySelector('.page-principal');
const divCriador = document.querySelector('.dev');
const btnReais = document.querySelector('.types button:first-child');
const btnFicticios = document.querySelector('.types button:last-child');
const personsDiv = document.querySelector('.persons:not(.salvos)');
const salvosDiv = document.querySelector('.persons.salvos');
const salvosSection = document.querySelector('.salvos-section');
const btnSaves = document.querySelector('.saves');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const modalImg = document.getElementById('modal-img');
const modalNome = document.getElementById('modal-nome');
const modalNascimento = document.getElementById('modal-nascimento');
const modalDescricao = document.getElementById('modal-descricao');

let personsData = {};
let tipoAtual = 'reais';

// Carregar dados do JSON
fetch('./script/persons.json')
    .then(response => response.json())
    .then(data => {
        personsData = data;
        mostrarReais(); // Mostrar reais por padrão
    });

// Função para obter salvos do localStorage
function obterSalvos() {
    const salvos = localStorage.getItem('salvos');
    return salvos ? JSON.parse(salvos) : [];
}

// Função para salvar no localStorage
function salvarNoStorage(person) {
    const salvos = obterSalvos();
    salvos.push(JSON.stringify(person));
    localStorage.setItem('salvos', JSON.stringify(salvos));
}

// Função para remover do localStorage
function removerDoStorage(personNome) {
    let salvos = obterSalvos();
    salvos = salvos.filter(salvo => JSON.parse(salvo).nome !== personNome);
    localStorage.setItem('salvos', JSON.stringify(salvos));
}

// Função para verificar se está salvo
function estaSalvo(personNome) {
    const salvos = obterSalvos();
    return salvos.some(salvo => JSON.parse(salvo).nome === personNome);
}

// Função para mostrar página principal
function mostrarPrincipal() {
    divPrincipal.style.display = 'block';
    divCriador.style.display = 'none';
    btnPrincipal.classList.add('active');
    btnCriador.classList.remove('active');
}

// Função para mostrar criador
function mostrarCriador() {
    divPrincipal.style.display = 'none';
    divCriador.style.display = 'flex';
    btnCriador.classList.add('active');
    btnPrincipal.classList.remove('active');
}

// Função para mostrar reais
function mostrarReais() {
    btnReais.classList.add('active');
    btnFicticios.classList.remove('active');
    tipoAtual = 'reais';
    esconderSalvos();
    gerarCards('reais', document.getElementById('searchInput') ? document.getElementById('searchInput').value : '');
}

// Função para mostrar fictícios
function mostrarFicticios() {
    btnFicticios.classList.add('active');
    btnReais.classList.remove('active');
    tipoAtual = 'ficticios';
    esconderSalvos();
    gerarCards('ficticios', document.getElementById('searchInput') ? document.getElementById('searchInput').value : '');
}

// Função para mostrar/esconder salvos
function alternarSalvos() {
    if (salvosSection.classList.contains('active')) {
        esconderSalvos();
    } else {
        mostrarSalvos();
    }
}

// Função para mostrar salvos
function mostrarSalvos() {
    salvosSection.classList.add('active');
    personsDiv.style.display = 'none';
    gerarCardsSalvos();
}

// Função para esconder salvos
function esconderSalvos() {
    salvosSection.classList.remove('active');
    personsDiv.style.display = 'flex';
}

// Função para gerar cards salvos
function gerarCardsSalvos() {
    salvosDiv.innerHTML = '';
    const salvos = obterSalvos();
    
    if (salvos.length === 0) {
        salvosDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ccc; font-size: 2rem;">Nenhum card salvo ainda</p>';
        return;
    }

    salvos.forEach(salvoStr => {
        const person = JSON.parse(salvoStr);
        const card = document.createElement('div');
        card.className = 'card-person';
        card.innerHTML = `
            <img class="img-person" src="${person.imagem1}" alt="${person.nome}">
            <h3>${person.nome}</h3>
            <p>${person.nascimento}</p>
            <div class="card-buttons">
                <button class="info-btn">Info</button>
                <button class="save-btn saved"><img src="img/icon-save.png" alt="Salvar"></button>
            </div>
        `;
        card.querySelector('.info-btn').addEventListener('click', () => abrirModal(person));
        card.querySelector('.save-btn').addEventListener('click', () => toggleSalvar(person, card.querySelector('.save-btn')));
        salvosDiv.appendChild(card);
    });
}

// Função para gerar cards com filtro
function gerarCards(tipo, filtro = '') {
    personsDiv.innerHTML = '';
    const filtroLower = filtro.trim().toLowerCase();
    const lista = personsData[tipo].filter(person =>
        person.nome.toLowerCase().includes(filtroLower)
    );
    if (lista.length === 0) {
        personsDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ccc; font-size: 2rem;">Nenhum resultado encontrado</p>';
        return;
    }
    lista.forEach(person => {
        const card = document.createElement('div');
        card.className = 'card-person';
        const estaSalvoAtualmente = estaSalvo(person.nome);
        card.innerHTML = `
            <img class="img-person" src="${person.imagem1}" alt="${person.nome}">
            <h3>${person.nome}</h3>
            <p>${person.nascimento}</p>
            <div class="card-buttons">
                <button class="info-btn">Info</button>
                <button class="save-btn ${estaSalvoAtualmente ? 'saved' : ''}"><img src="img/icon-save.png" alt="Salvar"></button>
            </div>
        `;
        card.querySelector('.info-btn').addEventListener('click', () => abrirModal(person));
        card.querySelector('.save-btn').addEventListener('click', () => toggleSalvar(person, card.querySelector('.save-btn')));
        personsDiv.appendChild(card);
    });
}

// Função para togglear salvamento
function toggleSalvar(person, botao) {
    if (estaSalvo(person.nome)) {
        removerDoStorage(person.nome);
        botao.classList.remove('saved');
    } else {
        salvarNoStorage(person);
        botao.classList.add('saved');
    }
}

// Função para abrir modal
function abrirModal(person) {
    modalImg.src = person.imagem2;
    modalNome.textContent = person.nome;
    modalNascimento.textContent = person.nascimento;
    modalDescricao.textContent = person.descricao;
    modal.style.display = 'block';
}

// Fechar modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Adicionar event listeners
btnPrincipal.addEventListener('click', mostrarPrincipal);
btnCriador.addEventListener('click', mostrarCriador);
btnReais.addEventListener('click', mostrarReais);
btnFicticios.addEventListener('click', mostrarFicticios);
btnSaves.addEventListener('click', alternarSalvos);

// Filtro de busca
const inputPesquisa = document.querySelector('.div-pesquisa input');
if (inputPesquisa) {
    inputPesquisa.setAttribute('id', 'searchInput');
    inputPesquisa.addEventListener('input', function () {
        gerarCards(tipoAtual, this.value);
    });
}

// Inicializar com página principal ativa
mostrarPrincipal();

