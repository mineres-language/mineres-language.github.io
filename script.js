function abrirExemplo(evt, nomeExemplo) {
    // Esconde todo o conteúdo das abas
    let conteudos = document.getElementsByClassName("aba-conteudo");
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].style.display = "none";
    }

    // Remove a classe "active" de todos os botões
    let botoes = document.getElementsByClassName("aba-btn");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].className = botoes[i].className.replace(" active", "");
    }

    // Mostra a aba atual e adiciona a classe "active" no botão clicado
    document.getElementById(nomeExemplo).style.display = "block";
    evt.currentTarget.className += " active";
}

function copiarCodigo(btn) {
    // Encontra a tag <pre> mais próxima dentro do mesmo bloco de código
    const preElement = btn.closest('.code-wrap').querySelector('pre');
    
    // Pega apenas o texto, ignorando o HTML dos <span> do syntax highlight
    const textToCopy = preElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Guarda o texto original do botão
        const originalText = btn.innerHTML;
        
        // Dá o feedback visual pro usuário no melhor estilo mineiro
        btn.innerHTML = "✅ Copiado, sô!";
        btn.style.background = "var(--capim)";
        btn.style.color = "var(--branco)";
        btn.style.borderColor = "var(--capim)";
        
        // Volta o botão ao estado original depois de 2 segundos
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
            btn.style.color = "";
            btn.style.borderColor = "";
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar o trem: ', err);
    });
}

// Função para lidar com as abas de exemplo de código
function abrirExemplo(evt, nomeExemplo) {
    let conteudos = document.getElementsByClassName("aba-conteudo");
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].style.display = "none";
    }

    let botoes = document.getElementsByClassName("aba-btn");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].className = botoes[i].className.replace(" active", "");
    }

    document.getElementById(nomeExemplo).style.display = "block";
    evt.currentTarget.className += " active";
}

// Função para o botão de copiar código
function copiarCodigo(btn) {
    const preElement = btn.closest('.code-wrap').querySelector('pre');
    const textToCopy = preElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        
        btn.innerHTML = "✅ Copiado, sô!";
        btn.style.background = "var(--capim)";
        btn.style.color = "var(--branco)";
        btn.style.borderColor = "var(--capim)";
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
            btn.style.color = "";
            btn.style.borderColor = "";
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar o trem: ', err);
    });
}

// Busca a versão direto do repositório oficial do Minerês no GitHub
function buscarVersaoGithub() {
    // Usando a versão "raw" do link para ler o JSON puro
    const url = 'https://raw.githubusercontent.com/mineres-language/mineres-extension/main/package.json';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.version) {
                const elementosVersao = document.getElementsByClassName('mineres-version');
                for (let i = 0; i < elementosVersao.length; i++) {
                    elementosVersao[i].innerText = 'v' + data.version;
                }
            }
        })
        .catch(erro => {
            console.error('Eita, deu ruim pra buscar a versão do Minerês no GitHub:', erro);
        });
}

// Inicia a busca da versão assim que a página terminar de carregar
window.addEventListener('DOMContentLoaded', buscarVersaoGithub);