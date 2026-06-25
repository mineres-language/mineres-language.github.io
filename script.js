// ── QUICK NAV: destaca o link da seção visível ──
(function () {
    const secoes = ['controle', 'tipos', 'vscode', 'playground', 'comunidade'];
    const links = {};

    document.addEventListener('DOMContentLoaded', () => {
        secoes.forEach(id => {
            links[id] = document.querySelector(`.quick-nav-link[href="#${id}"]`);
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (links[id]) {
                    links[id].classList.toggle('ativo', entry.isIntersecting);
                }
            });
        }, { rootMargin: '-20% 0px -75% 0px' });

        secoes.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    });
})();

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

// ── SYNTAX HIGHLIGHTING ─────────────────────────────────────────────────────

function destacarMineres(src) {
    const KEYWORDS  = new Set(['roda_esse_trem','enquanto_tiver_trem','para_o_trem','toca_o_trem','uai_se','uai_senao','dependenu','du_casu','simbora','cabo','uai','ta_bao','eh','num_eh']);
    const TYPES     = new Set(['trem_di_numeru','trem_cum_virgula','trem_discrita','trem_discolhe','trosso']);
    const OPERATORS = new Set(['fica_assim_entao','mema_coisa','neh_nada','quarque_um','tamem','vam_marca','um_o_oto','veiz','sob']);
    const BUILTINS  = new Set(['oia_proce_ve','xove','bora_cumpade']);

    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    let html = '';
    let i = 0;
    const n = src.length;

    while (i < n) {
        // Comentário de linha //
        if (src[i] === '/' && src[i+1] === '/') {
            let j = i;
            while (j < n && src[j] !== '\n') j++;
            html += `<span class="cc">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // String "..."
        if (src[i] === '"') {
            let j = i + 1;
            while (j < n && src[j] !== '"') { if (src[j] === '\\') j++; j++; }
            if (j < n) j++;
            html += `<span class="cs">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // Char '.'
        if (src[i] === "'") {
            let j = i + 1;
            if (j < n && src[j] === '\\') j++;
            if (j < n) j++;
            if (j < n && src[j] === "'") j++;
            html += `<span class="cs">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // Número
        if (/[0-9]/.test(src[i])) {
            let j = i;
            while (j < n && /[0-9a-fA-FxX.]/.test(src[j])) j++;
            html += `<span class="cn">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // Identificador / palavra-chave
        if (/[a-zA-Z_]/.test(src[i])) {
            let j = i;
            while (j < n && /[a-zA-Z0-9_]/.test(src[j])) j++;
            const word = src.slice(i, j);

            // Comentário de bloco: causo...fim_do_causo
            if (word === 'causo') {
                const end = src.indexOf('fim_do_causo', j);
                if (end !== -1) {
                    html += `<span class="cc">${esc(src.slice(i, end + 12))}</span>`;
                    i = end + 12;
                } else {
                    html += `<span class="cc">${esc(src.slice(i))}</span>`;
                    i = n;
                }
                continue;
            }

            if      (KEYWORDS.has(word))  html += `<span class="ck">${esc(word)}</span>`;
            else if (TYPES.has(word))     html += `<span class="ct">${esc(word)}</span>`;
            else if (OPERATORS.has(word)) html += `<span class="cop">${esc(word)}</span>`;
            else if (BUILTINS.has(word))  html += `<span class="cf">${esc(word)}</span>`;
            else                          html += esc(word);
            i = j; continue;
        }

        html += esc(src[i]); i++;
    }
    return html;
}

function sincronizarHighlight() {
    const editor    = document.getElementById('playground-editor');
    const highlight = document.getElementById('editor-highlight');
    const lineNums  = document.getElementById('line-numbers');
    if (!editor || !highlight) return;

    const src = editor.value;

    highlight.innerHTML = destacarMineres(src) + '\n';
    highlight.scrollTop  = editor.scrollTop;
    highlight.scrollLeft = editor.scrollLeft;

    if (lineNums) {
        const total = src.split('\n').length;
        lineNums.textContent = Array.from({length: total}, (_, i) => i + 1).join('\n');
        lineNums.scrollTop = editor.scrollTop;
    }

}

// ── PLAYGROUND ──────────────────────────────────────────────────────────────

const EXEMPLOS_PLAYGROUND = {
    ola_mundo: `causo\nMeu primeiro programa em Minerês, uai!\nfim_do_causo\n\nbora_cumpade main()\nsimbora\n    trem_discrita mensagem uai\n    mensagem fica_assim_entao "Uai, mundo!\\n" uai\n    oia_proce_ve(mensagem) uai\ncabo`,
    fibonacci: `// Sequência de Fibonacci\nbora_cumpade main()\nsimbora\n    trem_di_numeru n, a, b, prox, i uai\n\n    oia_proce_ve("Digite N:") uai\n    xove(trem_di_numeru, n) uai\n\n    a fica_assim_entao 0 uai\n    b fica_assim_entao 1 uai\n\n    roda_esse_trem (i fica_assim_entao 1 ; i <= n ; i fica_assim_entao i + 1)\n    simbora\n        prox fica_assim_entao a + b uai\n        a fica_assim_entao b uai\n        b fica_assim_entao prox uai\n    cabo\n\n    oia_proce_ve("Enesimo termo:") uai\n    oia_proce_ve(a) uai\ncabo`,
};

function carregarExemploPlayground(nome) {
    document.getElementById('playground-editor').value = EXEMPLOS_PLAYGROUND[nome];
    document.getElementById('playground-filename').textContent = nome + '.uai';
    const saida = document.getElementById('playground-output');
    saida.textContent = '// execute o código para ver a saída aqui, uai...';
    saida.className = 'playground-output';
    sincronizarHighlight();
}

window.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('playground-editor');
    if (!editor) return;

    // Garante que apenas o Terminal está visível no carregamento
    mudarAbaOutput('terminal');

    sincronizarHighlight();

    editor.addEventListener('input', sincronizarHighlight);
    editor.addEventListener('scroll', () => {
        const h  = document.getElementById('editor-highlight');
        const ln = document.getElementById('line-numbers');
        if (h)  { h.scrollTop = editor.scrollTop; h.scrollLeft = editor.scrollLeft; }
        if (ln) { ln.scrollTop = editor.scrollTop; }
    });

    // Tab insere 4 espaços em vez de mover o foco
    editor.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const s = e.target.selectionStart;
            const v = e.target.value;
            e.target.value = v.slice(0, s) + '    ' + v.slice(e.target.selectionEnd);
            e.target.selectionStart = e.target.selectionEnd = s + 4;
            sincronizarHighlight();
        }
    });
});

let _pyodide = null;
let _pyodidePromise = null;

const INTERPRETER_BASE = 'https://raw.githubusercontent.com/mineres-language/mineres-interpreter/main/src/';
const INTERPRETER_FILES = [
    'main.py',
    'lexer/lexer.py',
    'lexer/tokens.py',
    'parser/parser.py',
    'ir/__init__.py',
    'ir/formatador.py',
    'ir/geradores.py',
    'ir/tabela_simbolos.py',
    'interpreter/interpreter.py',
];

async function _inicializarPyodide() {
    definirStatus('Carregando o Python, aguenta aí... ⏳');

    _pyodide = await loadPyodide();

    definirStatus('Baixando o interpretador Minerês...');

    const fs = _pyodide.FS;
    for (const dir of ['/mineres', '/mineres/src', '/mineres/src/lexer',
        '/mineres/src/parser', '/mineres/src/ir', '/mineres/src/interpreter',
        '/mineres/data', '/mineres/data/input', '/mineres/data/output']) {
        try { fs.mkdir(dir); } catch (_) {}
    }

    await Promise.all(INTERPRETER_FILES.map(async (arquivo) => {
        const res = await fetch(INTERPRETER_BASE + arquivo);
        if (!res.ok) throw new Error(`Falha ao baixar ${arquivo}: ${res.status}`);
        const texto = await res.text();
        fs.writeFile('/mineres/src/' + arquivo, texto);
    }));

    definirStatus('');
}

function garantirPyodide() {
    if (_pyodide) return Promise.resolve();
    if (!_pyodidePromise) _pyodidePromise = _inicializarPyodide();
    return _pyodidePromise;
}

// Remove linhas de status que o interpretador imprime
function _filtrarMeta(texto) {
    return texto
        .split('\n')
        .filter(l => {
            const t = l.trim();
            if (/^[-=]{3,}/.test(t)) return false;
            if (/mineres\s+interpreter|iniciando\s+execu|fim\s+da\s+execu/i.test(t)) return false;
            return true;
        })
        .join('\n');
}

// ── TERMINAL INTERATIVO ─────────────────────────────────────────────────────

let _terminalCode       = '';
let _terminalInputs     = [];
let _terminalInputIndex = 0;
let _terminalInputTotal = 0;
let _terminalChunks     = []; // texto impresso antes de cada xove (dry-run)
let _terminalShownLen   = 0;  // chars já exibidos para não duplicar na saída final

async function executarCodigo() {
    const btn    = document.getElementById('executar-btn');
    const output = document.getElementById('playground-output');
    const codigo = document.getElementById('playground-editor').value;

    btn.disabled = true;
    output.className = 'playground-output';
    output.innerHTML = '';

    // Reseta estado do terminal e abas a cada execução
    _terminalShownLen = 0;
    _terminalChunks   = [];
    document.getElementById('output-saida-uai').textContent = '';
    document.getElementById('output-ir').textContent = '';
    mudarAbaOutput('terminal');

    const xoveCount = (codigo.match(/\bxove\b/g) || []).length;

    if (xoveCount === 0) {
        await _rodarCodigo(codigo, '');
    } else {
        await _coletarPrompts(codigo, xoveCount);
    }
}

// Dry-run com stdin fictício para capturar o que o programa imprime antes de cada xove
async function _coletarPrompts(codigo, xoveCount) {
    try {
        await garantirPyodide();
        definirStatus('Preparando...');

        _pyodide.FS.writeFile('/mineres/data/input/entrada.uai', codigo);

        await _pyodide.runPythonAsync(`
            import sys, os
            from io import StringIO

            _mods = [m for m in list(sys.modules.keys())
                    if m in ('lexer', 'parser', 'ir', 'interpreter')
                    or m.startswith(('lexer.', 'parser.', 'ir.', 'interpreter.'))]
            for _m in _mods:
                del sys.modules[_m]

            class _ScanStdin:
                def __init__(self, out):
                    self._out = out
                    self.captures = []
                def readline(self):
                    self.captures.append(self._out.getvalue())
                    return '0\\n'
                def read(self, n=-1):
                    return self.readline()

            _dry_out = StringIO()
            sys.stdout = _dry_out
            sys.stderr = StringIO()
            _scanner = _ScanStdin(_dry_out)
            sys.stdin = _scanner

            os.chdir('/mineres')
            if '/mineres/src' not in sys.path:
                sys.path.insert(0, '/mineres/src')

            try:
                exec(open('/mineres/src/main.py').read(), {'__name__': '__main__'})
            except SystemExit:
                pass
            except Exception:
                pass

            _scan_captures = _scanner.captures
            `);

        const caps = _pyodide.globals.get('_scan_captures').toJs();
        _terminalChunks = [];
        let prev = 0;
        for (const c of caps) {
            _terminalChunks.push(c.slice(prev));
            prev = c.length;
        }
        _terminalShownLen = prev;

    } catch (_) {
        _terminalChunks   = [];
        _terminalShownLen = 0;
    }

    _terminalCode       = codigo;
    _terminalInputs     = [];
    _terminalInputIndex = 0;
    _terminalInputTotal = xoveCount;

    definirStatus('');
    _proximaEntrada();
}

function _proximaEntrada() {
    const output = document.getElementById('playground-output');

    // Congela a linha de input atual como echo de texto
    const row = output.querySelector('.terminal-input-row');
    if (row) {
        const inputEl = row.querySelector('.terminal-inline-input');
        const echo = document.createElement('span');
        echo.className = 'terminal-echo';
        echo.textContent = '▶ ' + (inputEl ? inputEl.value : '') + '\n';
        row.replaceWith(echo);
    }

    if (_terminalInputIndex < _terminalInputTotal) {
        // Exibe o texto que o programa imprime antes deste xove (sem linhas de meta do interpretador)
        const chunk = _filtrarMeta(_terminalChunks[_terminalInputIndex] || '').trim();
        if (chunk) {
            const chunkSpan = document.createElement('span');
            chunkSpan.textContent = chunk + '\n';
            output.appendChild(chunkSpan);
        }

        const newRow = document.createElement('div');
        newRow.className = 'terminal-input-row';

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = '▶ ';

        const inputEl = document.createElement('input');
        inputEl.type         = 'text';
        inputEl.className    = 'terminal-inline-input';
        inputEl.spellcheck   = false;
        inputEl.autocomplete = 'off';

        newRow.appendChild(prompt);
        newRow.appendChild(inputEl);
        output.appendChild(newRow);
        output.scrollTop = output.scrollHeight;
        inputEl.focus();

        inputEl.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                _terminalInputs.push(inputEl.value);
                _terminalInputIndex++;
                _proximaEntrada();
            }
        });
    } else {
        _rodarCodigo(_terminalCode, _terminalInputs.join('\n'));
    }
}

async function _rodarCodigo(codigo, entrada) {
    const output = document.getElementById('playground-output');
    const btn    = document.getElementById('executar-btn');

    try {
        await garantirPyodide();
        definirStatus('Executando...');

        _pyodide.FS.writeFile('/mineres/data/input/entrada.uai', codigo);
        _pyodide.globals.set('_stdin_data', entrada);

        await _pyodide.runPythonAsync(`
            import sys, os
            from io import StringIO

            _mods = [m for m in list(sys.modules.keys())
                    if m in ('lexer', 'parser', 'ir', 'interpreter')
                    or m.startswith(('lexer.', 'parser.', 'ir.', 'interpreter.'))]
            for _m in _mods:
                del sys.modules[_m]

            sys.stdout = StringIO()
            sys.stderr = StringIO()
            sys.stdin  = StringIO(_stdin_data)

            os.chdir('/mineres')
            if '/mineres/src' not in sys.path:
                sys.path.insert(0, '/mineres/src')

            try:
                exec(open('/mineres/src/main.py').read(), {'__name__': '__main__'})
            except SystemExit:
                pass
            except Exception as _e:
                print(f"[Erro interno] {_e}", file=sys.stderr)

            _saida = sys.stdout.getvalue()
            _erros = sys.stderr.getvalue()
            `);

        const saida = _pyodide.globals.get('_saida') || '';
        const erros = _pyodide.globals.get('_erros') || '';

        if (erros && !saida.trim()) {
            output.classList.add('playground-output-error');
        }

        // Remove o prefixo já exibido pelo dry-run e as linhas de meta do interpretador
        const combined = saida + erros;
        const restante = _filtrarMeta(combined.slice(_terminalShownLen)).trim();

        const outSpan = document.createElement('span');
        outSpan.textContent = restante || (combined.trim() ? '' : '(sem saída, uai)');
        output.appendChild(outSpan);
        output.scrollTop = output.scrollHeight;

        // Popula abas de saída.uai e IR com syntax highlighting
        const saidaUai = _lerArquivoFS('/mineres/data/output/saida.uai');
        const saidaIR  = _lerArquivoFS('/mineres/data/output/saida_ir.uai');
        if (saidaUai) document.getElementById('output-saida-uai').innerHTML = destacarOutput('// (lexema, código, linha, coluna)\n' + saidaUai);
        if (saidaIR)  document.getElementById('output-ir').innerHTML = destacarOutput(saidaIR);

    } catch (err) {
        output.classList.add('playground-output-error');
        const errSpan = document.createElement('span');
        errSpan.textContent = 'Eita! Erro inesperado:\n' + err.message;
        output.appendChild(errSpan);
    } finally {
        definirStatus('');
        btn.disabled = false;
    }
}

function definirStatus(msg) {
    document.getElementById('playground-status').textContent = msg;
}

function mudarAbaOutput(aba) {
    const ids = { 'terminal': 'playground-output', 'saida-uai': 'output-saida-uai', 'ir': 'output-ir' };
    Object.values(ids).forEach(id => { document.getElementById(id).style.display = 'none'; });
    document.getElementById(ids[aba]).style.display = 'block';
    document.querySelectorAll('.output-tab').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.output-tab[onclick*="${aba}"]`);
    if (btn) btn.classList.add('active');
}

function _lerArquivoFS(caminho) {
    try { return _pyodide.FS.readFile(caminho, { encoding: 'utf8' }); } catch (_) { return null; }
}

// Highlighter para saida_ir.uai e saida.uai (formato de listas de tuplas)
function destacarOutput(src) {
    const IR_OPS = new Set(['att','call','jmp','jmpif','jmpifnot','ret','push','pop','add','sub','mul','div','mod','eq','neq','lt','lte','gt','gte','and','or','not','print','scan','label']);
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    let html = '';
    let i = 0;
    const n = src.length;
    // controla se estamos no primeiro elemento de uma tupla (opcode no IR)
    let posNaTupla = -1;

    while (i < n) {
        // Comentário de linha //
        if (src[i] === '/' && src[i+1] === '/') {
            let j = i;
            while (j < n && src[j] !== '\n') j++;
            html += `<span class="oc-comment">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // String "..."
        if (src[i] === '"') {
            let j = i + 1;
            while (j < n && src[j] !== '"') { if (src[j] === '\\') j++; j++; }
            if (j < n) j++;
            const val = src.slice(i + 1, j - 1);
            const cls = (posNaTupla === 0 && IR_OPS.has(val)) ? 'oc-op' : 'oc-str';
            html += `<span class="${cls}">${esc(src.slice(i, j))}</span>`;
            if (posNaTupla === 0) posNaTupla = 1;
            i = j; continue;
        }

        // @variável
        if (src[i] === '@') {
            let j = i + 1;
            while (j < n && /[a-zA-Z0-9_]/.test(src[j])) j++;
            html += `<span class="oc-ref">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // Número (incluindo negativos)
        if (/[0-9]/.test(src[i]) || (src[i] === '-' && /[0-9]/.test(src[i+1]))) {
            let j = i + (src[i] === '-' ? 1 : 0);
            while (j < n && /[0-9.]/.test(src[j])) j++;
            html += `<span class="oc-num">${esc(src.slice(i, j))}</span>`;
            i = j; continue;
        }

        // Identificador (null, true, false ou nome)
        if (/[a-zA-Z_]/.test(src[i])) {
            let j = i;
            while (j < n && /[a-zA-Z0-9_]/.test(src[j])) j++;
            const word = src.slice(i, j);
            if (word === 'null' || word === 'true' || word === 'false') {
                html += `<span class="oc-null">${esc(word)}</span>`;
            } else {
                html += `<span class="oc-ref">${esc(word)}</span>`;
            }
            i = j; continue;
        }

        // Pontuação — rastreia posição dentro da tupla
        if (src[i] === '(') { posNaTupla = 0; html += `<span class="oc-punc">${esc(src[i])}</span>`; i++; continue; }
        if (src[i] === ')') { posNaTupla = -1; html += `<span class="oc-punc">${esc(src[i])}</span>`; i++; continue; }
        if (src[i] === ',') { if (posNaTupla >= 0) posNaTupla++; html += `<span class="oc-punc">${esc(src[i])}</span>`; i++; continue; }
        if (src[i] === '[' || src[i] === ']') { html += `<span class="oc-punc">${esc(src[i])}</span>`; i++; continue; }

        html += esc(src[i]); i++;
    }
    return html;
}

function copiarCodigoPlayground(btn) {
    const codigo = document.getElementById('playground-editor').value;
    navigator.clipboard.writeText(codigo).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ Copiado, sô!';
        btn.style.background = 'var(--capim)';
        btn.style.color = 'var(--branco)';
        btn.style.borderColor = 'var(--capim)';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
    }).catch(err => console.error('Erro ao copiar o trem:', err));
}

function alternarTema() {
    const body = document.querySelector('.playground-body');
    const btn  = document.getElementById('tema-btn');
    const claro = body.classList.toggle('claro');
    btn.textContent = claro ? '🌙 modo escuro' : '☀️ modo claro';
}
