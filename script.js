class Produto {
    constructor(nome, preco, quantidade) {
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.quantidade = parseInt(quantidade);
    }

    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}

const listaDeProdutos = [];
let indiceEdicao = null;

const CHAVE_STORAGE = "sistema_estoque_produtos";

function salvarNoLocalStorage() {
    const listaEmTexto = JSON.stringify(listaDeProdutos);
    localStorage.setItem(CHAVE_STORAGE, listaEmTexto);
}

function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        const produtosObjetos = JSON.parse(dadosSalvos);

        produtosObjetos.forEach((prod) => {
            const produtoInstanciado = new Produto(prod.nome, prod.preco, prod.quantidade);
            listaDeProdutos.push(produtoInstanciado);
        });
    }
}

const formProduto = document.getElementById("produto-form");
const btnLimparTudo = document.getElementById("limpar-tabela");
const totalEstoqueEl = document.getElementById("total-estoque");
const btnSubmit = formProduto.querySelector(".btn-primary");
const inputBusca = document.getElementById("busca");
const mensagemVazia = document.getElementById("mensagem-vazia");

const campoNome = document.getElementById("nome");
const campoPreco = document.getElementById("preco");
const campoQuantidade = document.getElementById("quantidade");
const mensagemErro = document.getElementById("mensagem-erro");

/* ============================================================
   V5 - Mensagens inline (substituem o alert)
   ============================================================ */

function limparDestaques() {
    formProduto.querySelectorAll(".campo-invalido").forEach((campo) => {
        campo.classList.remove("campo-invalido");
    });
}

function mostrarErro(texto, camposInvalidos = []) {
    limparDestaques();

    mensagemErro.textContent = texto;
    mensagemErro.hidden = false;

    camposInvalidos.forEach((campo) => campo.classList.add("campo-invalido"));

    if (camposInvalidos.length > 0) {
        camposInvalidos[0].focus();
    }
}

function limparErro() {
    mensagemErro.hidden = true;
    mensagemErro.textContent = "";
    limparDestaques();
}

// Assim que o usuário volta a digitar, o aviso some
formProduto.addEventListener("input", limparErro);

/* ============================================================
   V5 - Modal de confirmação (substitui o confirm)
   A função devolve uma Promise: ela só é resolvida quando o
   usuário clica em "Confirmar" (true) ou "Cancelar" (false).
   ============================================================ */

const modalConfirmacao = document.getElementById("modal-confirmacao");
const modalTitulo = document.getElementById("modal-titulo");
const modalTexto = document.getElementById("modal-texto");
const btnModalCancelar = document.getElementById("modal-cancelar");
const btnModalConfirmar = document.getElementById("modal-confirmar");

function confirmarAcao(titulo, texto, textoConfirmar = "Confirmar") {
    return new Promise((resolve) => {
        const elementoAnterior = document.activeElement;

        modalTitulo.textContent = titulo;
        modalTexto.textContent = texto;
        btnModalConfirmar.textContent = textoConfirmar;

        modalConfirmacao.hidden = false;
        btnModalCancelar.focus();

        function fechar(resposta) {
            modalConfirmacao.hidden = true;

            btnModalConfirmar.removeEventListener("click", aoConfirmar);
            btnModalCancelar.removeEventListener("click", aoCancelar);
            modalConfirmacao.removeEventListener("click", aoClicarFora);
            document.removeEventListener("keydown", aoPressionarTecla);

            if (elementoAnterior && elementoAnterior.isConnected) {
                elementoAnterior.focus();
            }

            resolve(resposta);
        }

        function aoConfirmar() {
            fechar(true);
        }

        function aoCancelar() {
            fechar(false);
        }

        function aoClicarFora(event) {
            if (event.target === modalConfirmacao) {
                fechar(false);
            }
        }

        function aoPressionarTecla(event) {
            if (event.key === "Escape") {
                fechar(false);
            }

            // Mantém o foco do teclado dentro do modal
            if (event.key === "Tab") {
                if (event.shiftKey && document.activeElement === btnModalCancelar) {
                    event.preventDefault();
                    btnModalConfirmar.focus();
                } else if (!event.shiftKey && document.activeElement === btnModalConfirmar) {
                    event.preventDefault();
                    btnModalCancelar.focus();
                }
            }
        }

        btnModalConfirmar.addEventListener("click", aoConfirmar);
        btnModalCancelar.addEventListener("click", aoCancelar);
        modalConfirmacao.addEventListener("click", aoClicarFora);
        document.addEventListener("keydown", aoPressionarTecla);
    });
}

/* ============================================================
   V5 - Modal "Conceito Bootstrap" (conteúdo montado dinamicamente)
   ============================================================ */

const CONCEITO_BOOTSTRAP = [
    {
        titulo: "O que é o Bootstrap?",
        texto: "É uma biblioteca de CSS e JavaScript com componentes prontos (botões, alertas, modais, tabelas, formulários) e um sistema de grade responsivo. Em vez de escrever todo o CSS do zero, a gente aplica classes prontas direto no HTML."
    },
    {
        titulo: "Como colocaríamos no projeto",
        texto: "Bastaria adicionar o CSS no <head> e o JavaScript antes do </body>, usando o CDN:",
        codigo: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
    },
    {
        titulo: "Mensagens de erro",
        texto: "Nosso aviso vermelho dentro do formulário poderia ser feito só com as classes de alerta do Bootstrap, sem escrever CSS:",
        codigo: '<div class="alert alert-danger" role="alert">Informe um nome válido.</div>'
    },
    {
        titulo: "Modal de confirmação",
        texto: "O Bootstrap já tem um componente de modal pronto. Com os atributos data-bs-toggle e data-bs-target ele abre sem precisar de JavaScript. Neste projeto fizemos o nosso modal com HTML, CSS e JS para entender como ele funciona por dentro (overlay, foco do teclado e Promise).",
        codigo: '<button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#meuModal">Limpar Tudo</button>'
    },
    {
        titulo: "Layout, formulário e tabela",
        texto: "As classes container, row e col-md-6 deixam a página responsiva. Para o formulário e a tabela usaríamos form-control, btn btn-success e table table-striped, e o visual ficaria padronizado com bem menos CSS."
    },
    {
        titulo: "Vantagens e cuidados",
        texto: "Ganhamos rapidez, consistência visual e responsividade pronta. Em contrapartida, o site pode ficar parecido com outros que usam Bootstrap, e é preciso personalizar as cores para ter identidade própria (como o nosso verde e branco)."
    }
];

const btnBootstrap = document.getElementById("btn-bootstrap");
const modalBootstrap = document.getElementById("modal-bootstrap");
const bootstrapConteudo = document.getElementById("bootstrap-conteudo");
const btnBootstrapFechar = document.getElementById("bootstrap-fechar");

function abrirModalBootstrap() {
    bootstrapConteudo.innerHTML = "";

    CONCEITO_BOOTSTRAP.forEach((item) => {
        const bloco = document.createElement("div");
        bloco.className = "bootstrap-bloco";

        const titulo = document.createElement("h3");
        titulo.textContent = item.titulo;

        const texto = document.createElement("p");
        texto.textContent = item.texto;

        bloco.appendChild(titulo);
        bloco.appendChild(texto);

        if (item.codigo) {
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            code.textContent = item.codigo;
            pre.appendChild(code);
            bloco.appendChild(pre);
        }

        bootstrapConteudo.appendChild(bloco);
    });

    modalBootstrap.hidden = false;
    btnBootstrapFechar.focus();
}

function fecharModalBootstrap() {
    modalBootstrap.hidden = true;
    btnBootstrap.focus();
}

btnBootstrap.addEventListener("click", abrirModalBootstrap);
btnBootstrapFechar.addEventListener("click", fecharModalBootstrap);

modalBootstrap.addEventListener("click", function (event) {
    if (event.target === modalBootstrap) {
        fecharModalBootstrap();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modalBootstrap.hidden) {
        fecharModalBootstrap();
    }
});

/* ============================================================
   Formulário e ações da tabela
   ============================================================ */

formProduto.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = campoNome.value.trim();
    const preco = parseFloat(campoPreco.value);
    const quantidade = parseInt(campoQuantidade.value);

    if (!nome) {
        mostrarErro("Por favor, informe um nome válido para o produto.", [campoNome]);
        return;
    }

    const camposNumericosInvalidos = [];

    if (isNaN(preco) || preco <= 0) {
        camposNumericosInvalidos.push(campoPreco);
    }

    if (isNaN(quantidade) || quantidade <= 0) {
        camposNumericosInvalidos.push(campoQuantidade);
    }

    if (camposNumericosInvalidos.length > 0) {
        mostrarErro("O preço e a quantidade devem ser valores numéricos maiores que zero.", camposNumericosInvalidos);
        return;
    }

    const novoProduto = new Produto(nome, preco, quantidade);

    if (indiceEdicao === null) {
        listaDeProdutos.push(novoProduto);
    } else {
        listaDeProdutos[indiceEdicao] = novoProduto;
    }

    salvarNoLocalStorage();

    sairDoModoEdicao();

    atualizarInterface();
    formProduto.reset();
    limparErro();
});

btnLimparTudo.addEventListener("click", async function () {
    if (listaDeProdutos.length === 0) {
        mostrarErro("A tabela já está vazia!");
        return;
    }

    const confirmou = await confirmarAcao(
        "Limpar tudo",
        `Tem certeza que deseja remover todos os ${listaDeProdutos.length} produtos? Essa ação não pode ser desfeita.`,
        "Limpar tudo"
    );

    if (!confirmou) {
        return;
    }

    listaDeProdutos.length = 0;
    localStorage.removeItem(CHAVE_STORAGE);

    sairDoModoEdicao();
    formProduto.reset();
    limparErro();

    atualizarInterface();
});

inputBusca.addEventListener("input", function () {
    atualizarInterface();
});

function prepararEdicao(indexReal) {
    const produto = listaDeProdutos[indexReal];

    limparErro();

    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoQuantidade.value = produto.quantidade;

    indiceEdicao = indexReal;
    btnSubmit.textContent = "Salvar Alterações";
}

function sairDoModoEdicao() {
    indiceEdicao = null;
    btnSubmit.textContent = "Adicionar Produto";
}

async function removerProduto(indexReal) {
    const produto = listaDeProdutos[indexReal];

    const confirmou = await confirmarAcao(
        "Excluir produto",
        `Tem certeza que deseja excluir "${produto.nome}"?`,
        "Excluir"
    );

    if (!confirmou) {
        return;
    }

    listaDeProdutos.splice(indexReal, 1);
    salvarNoLocalStorage();

    if (indiceEdicao !== null) {
        sairDoModoEdicao();
        formProduto.reset();
    }

    atualizarInterface();
}

function obterProdutosFiltrados() {
    const termo = inputBusca.value.toLowerCase();
    return listaDeProdutos.filter(produto => produto.nome.toLowerCase().includes(termo));
}

function atualizarTotalEstoque() {
    const produtosFiltrados = obterProdutosFiltrados();
    const total = produtosFiltrados.reduce((acc, produto) => {
        return acc + produto.calcularSubtotal();
    }, 0);

    totalEstoqueEl.textContent = `Total em Estoque: R$ ${total.toFixed(2)}`;
}

function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    tabelaBody.innerHTML = "";

    const produtosFiltrados = obterProdutosFiltrados();

    if (produtosFiltrados.length === 0) {
        mensagemVazia.style.display = "block";
    } else {
        mensagemVazia.style.display = "none";
    }

    produtosFiltrados.forEach((produto) => {
        const indexReal = listaDeProdutos.indexOf(produto);
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-editar">Editar</button>
                <button class="btn-remover">Remover</button>
            </td>
        `;

        const btnEditar = linha.querySelector(".btn-editar");
        btnEditar.addEventListener("click", () => prepararEdicao(indexReal));

        const btnRemover = linha.querySelector(".btn-remover");
        btnRemover.addEventListener("click", () => removerProduto(indexReal));

        tabelaBody.appendChild(linha);
    });
}

function atualizarInterface() {
    renderizarTabela();
    atualizarTotalEstoque();
}

carregarDoLocalStorage();
atualizarInterface();