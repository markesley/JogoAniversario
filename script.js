const app = document.getElementById('app');

let fase = 0;
let estiloAlternado = true;

// Quiz de perguntas sobre o João Neto
const perguntas = [
  {
    titulo: "Qual o seu anime preferido que marcou sua infância?",
    opcoes: ["Naruto", "Fairy Tail", "Dragon Ball", "One Piece"],
    correta: "Fairy Tail"
  },
  {
    titulo: "Entre essas opções de sushi qual o João Neto mais gosta?",
    opcoes: ["Sushi tradicional", "Hot roll", "Sushiburguer", "Temaki"],
    correta: "Sushiburguer"
  },
  {
    titulo: "Como o João Neto aprende?",
    opcoes: ["Lendo", "Ouvindo e Visualizando a situação", "Praticando", "Decorando regras"],
    correta: "Ouvindo e Visualizando a situação"
  },
  {
    titulo: "No último ano quais foram os esportes que o João Neto mais fez?",
    opcoes: ["Futebol", "Corrida", "Lutas, vôlei, natação e academia", "Basquete"],
    correta: "Lutas, vôlei, natação e academia"
  },
  {
    titulo: "Como um bom geminiano, você é:",
    opcoes: [
      "Super objetivo e sem dúvidas",
      "Indeciso, imagina várias possibilidades e tem um coração enorme",
      "Sempre na sua",
      "Frio e calculista"
    ],
    correta: "Indeciso, imagina várias possibilidades e tem um coração enorme"
  },
  {
    titulo: "Chegamos no tópico DIVAS POP: Qual delas desbanca TODAS as outras no quesito ARTISTA?",
    opcoes: ["Beyoncé", "Taylor Swift (eu chutaria essa tá, rs)", "Demi Lovato", "Lady Gaga"],
    correta: "Lady Gaga"
  },
  {
    titulo: "Qual é a banda de rock preferida do João Neto?",
    opcoes: ["Metallica", "System Of A Down", "Queen", "Foo Fighters"],
    correta: "System Of A Down"
  },
  {
    titulo: "Qual é o refrão da música “No topo do Mundo” do filme Barbie: Escola de Princesas?",
    opcoes: [
      `No topo do mundo
Onde verei tudo bem de perto
Quase o céu poder tocar

No topo do mundo
Meus sonhos vindo ao meu encontro
Terei asas pra voar`,
      `No topo do mundo
Sinto o vento me chamar
Sonhos de princesa a brilhar

No topo do mundo
Será o meu lugar
Para sempre reinar`,
      `Voe alto sem medo de cair
No horizonte há um novo porvir

No topo do mundo
Vou me encontrar
E minhas asas vão me levar`,
      `No topo do mundo
Tudo é brilho e esplendor
Um céu feito de amor

No topo do mundo
Canto minha canção
Com o coração em comemoração`
    ],
    correta: `No topo do mundo
Onde verei tudo bem de perto
Quase o céu poder tocar

No topo do mundo
Meus sonhos vindo ao meu encontro
Terei asas pra voar`
  }
];

// Variáveis do minijogo de corações
let heartsToClick = 5;
let timeLeft = 10;
let heartTimer;

function renderBoasVindas() {
  app.innerHTML = `
    <div class="screen feminina">
      <h1>Bem-vindo, João Neto! 💖</h1>
      <p>Esse é um joguinho especial feito só pra você.</p>
      <button onclick="proximaFase()">Começar</button>
    </div>
  `;
}

function renderPergunta() {
  const p = perguntas[fase - 1];
  const estilo = estiloAlternado ? 'masculina' : 'feminina';
  estiloAlternado = !estiloAlternado;

  // Limpa a tela e cria o container
  app.innerHTML = `
    <div class="screen ${estilo}">
      <h2>${p.titulo}</h2>
    </div>
  `;

  // Cria as opções via DOM
  const screen = app.querySelector('.screen');
  p.opcoes.forEach(op => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = op;
    
    div.addEventListener('click', () => {
  // Remove seleção anterior
  screen.querySelectorAll('.option').forEach(o => {
    o.classList.remove('selecionada');
    o.style.color = '';         // limpa eventual cor inline
  });

  // Marca a atual
  div.classList.add('selecionada');
  div.style.color = '#000';      // força o preto

  // Verifica a resposta
  responder(op);
});

    screen.appendChild(div);
  });
}

function responder(resposta) {
  const correta = perguntas[fase - 1].correta;

  // Normaliza espaços e quebras
  const normalize = str =>
    str
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');

  if (normalize(resposta) === normalize(correta)) {
    proximaFase();
  } else {
    alert("Ops! Tente de novo 🫣");
  }
}

function renderMinijogo() {
  app.innerHTML = `
    <div class="screen masculina">
      <h2>Fase final! Clique em ${heartsToClick} corações ❤️</h2>
      <div class="minijogo-info">
        <span id="contador">Restam: ${heartsToClick}</span>
        <span id="timer">Tempo: ${timeLeft}s</span>
      </div>
      <div class="minijogo-container" id="minijogo"></div>
    </div>
  `;

  // Inicia o timer
  const timerEl = document.getElementById('timer');
  heartTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(heartTimer);
      alert('Acabou o tempo! Tente de novo 🕒');
      renderMinijogoReset();
    }
  }, 1000);

  // Spawn do primeiro coração
  spawnHeart();
}

function spawnHeart() {
  const container = document.getElementById('minijogo');
  const { width, height } = container.getBoundingClientRect();

  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '❤️';

  // Posição aleatória
  const x = Math.random() * (width - 40);
  const y = Math.random() * (height - 40);
  heart.style.left = `${x}px`;
  heart.style.top  = `${y}px`;

  heart.addEventListener('click', () => {
    heart.remove();
    heartsToClick--;
    document.getElementById('contador').textContent = `Restam: ${heartsToClick}`;

    if (heartsToClick > 0) {
      spawnHeart();
    } else {
      clearInterval(heartTimer);
      renderFinal();
    }
  });

  container.appendChild(heart);
}

function renderMinijogoReset() {
  // Reseta variáveis e reinicia
  heartsToClick = 5;
  timeLeft = 10;
  renderMinijogo();
}

function renderFinal() {
  app.innerHTML = `
    <div class="screen feminina">
      <h2>Parabéns, João Neto! Momo🎉</h2>
      <p>Feliz 23 anos! Que sua vida seja repleta de amor, aventura, sushi e animes incríveis 💕</p>
      <img src="imagens/jn1.jpg" alt="João 1">
      <img src="imagens/jn2.jpg" alt="João 2">
      <img src="imagens/jn3.jpg" alt="João 3">
    </div>
  `;
}

function proximaFase() {
  fase++;
  if (fase === 1) {
    renderPergunta();
  } else if (fase <= perguntas.length) {
    renderPergunta();
  } else if (fase === perguntas.length + 1) {
    renderMinijogo();
  } else {
    renderFinal();
  }
}

// Inicia o jogo
renderBoasVindas();
