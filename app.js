console.log(document.getElementById("cardTitle"));

function novoGasto() {
  const card = document.getElementById("card");
  const novoGastoBtn = document.getElementById("novoGasto");
  novoGastoBtn.classList.add("oculto");
  card.classList.remove("oculto");

  data.valueAsDate = new Date();
}

function cancelar() {
  const card = document.getElementById("card");
  const novoGastoBtn = document.getElementById("novoGasto");
  card.classList.add("oculto");
  novoGastoBtn.classList.remove("oculto");
}

let editandoId = null;

class Gasto {
  constructor(nome, valor, categoria, data) {
    this.id = Date.now();
    this.nome = nome;
    this.valor = valor;
    this.categoria = categoria;
    this.data = data;
  }
}

class Gastos {
  constructor() {
    this.lista = [];
  }

  adicionarGasto(gasto) {
    this.lista.push(gasto);
  }

  deletarGasto(id) {
    this.lista = this.lista.filter((gasto) => gasto.id !== id);
    atualizarStats();
    atualizarListaGastos();
  }

  calcularTotal() {
    return this.lista.reduce((total, gasto) => total + gasto.valor, 0);
  }

  listarGastos() {
    return this.lista;
  }
}

const sistema = new Gastos();

function adicionarGasto() {
  const nome = document.getElementById("nome");
  const valor = document.getElementById("valor");
  const categoria = document.getElementById("categoria");
  const data = document.getElementById("data");

  temErro = false;

  if (!nome.value) {
    ValidarCampos(nome, "errorNome", "O nome do gasto é obrigatório.");
    temErro = true;
  }

  if (!valor.value || parseFloat(valor.value) <= 0) {
    ValidarCampos(valor, "errorValor", "O valor do gasto é obrigatório.");
    temErro = true;
  }

  if (!categoria.value) {
    ValidarCampos(
      categoria,
      "errorCategoria",
      "A categoria do gasto é obrigatória.",
    );
    temErro = true;
  }

  if (!data.value) {
    ValidarCampos(data, "errorData", "A data do gasto é obrigatória.");
    temErro = true;
  }

  if (temErro == true) return;

  const gasto = new Gasto(
    nome.value,
    parseFloat(valor.value),
    categoria.value,
    data.value,
  );

  if (editandoId !== null) {
    const indexEditar = sistema.lista.findIndex(
      (gasto) => gasto.id === editandoId,
    );

    sistema.lista[indexEditar] = {
      ...sistema.lista[indexEditar],
      nome: nome.value,
      valor: parseFloat(valor.value),
      categoria: categoria.value,
      data: data.value,
    };

    editandoId = null;
  } else {
    sistema.adicionarGasto(gasto);
  }

  nome.value = "";
  valor.value = "";
  categoria.value = "";

  cancelar();
  atualizarStats();
  atualizarListaGastos();
}

function editarGasto(id) {
  const gastoEditar = sistema.lista.find((gasto) => gasto.id === id);

  document.getElementById("nome").value = gastoEditar.nome;
  document.getElementById("valor").value = gastoEditar.valor;
  document.getElementById("categoria").value = gastoEditar.categoria;
  document.getElementById("data").value = gastoEditar.data;

  editandoId = id;

  document.getElementById("cardTitle").innerText = "✏️ Editar Gasto";
  novoGasto();
}

const iconesPorCategoria = {
  alimentacao: "🍔",
  transporte: "🚗",
  moradia: "🏠",
  saude: "💊",
  educacao: "📚",
  lazer: "🎮",
  vestuario: "👕",
  outros: "📦",
};

function atualizarListaGastos(lista = sistema.listarGastos()) {
  const listaGastos = document.getElementById("listaDeGastos");
  listaGastos.innerHTML = "";

  lista.forEach((gasto) => {
    const icone = iconesPorCategoria[gasto.categoria];
    listaGastos.innerHTML += `
        <div class="expense-item">
  <div class="expense-icon bg-violet">${icone}</div>
  <div class="expense-info">
    <div class="expense-name">${gasto.nome}</div>
    <div class="expense-meta">
      <span class="expense-badge bg-violet text-violet">${gasto.categoria}</span>
      <span class="expense-date">${gasto.data}</span>
    </div>
  </div>
  <div class="expense-value">R$ ${gasto.valor.toFixed(2).replace(".", ",")}</div>
  <div class="expense-actions">
    <button onclick="editarGasto(${gasto.id})" class="icon-btn edit">✏️</button>
    <button onclick="sistema.deletarGasto(${gasto.id})" class="icon-btn delete">🗑️</button>
  </div>
</div>
        `;
  });
}

function ValidarCampos(input, errorId, mensagem) {
  const errorText = document.getElementById(errorId);
  document.getElementById(errorId).innerText = mensagem;
  input.classList.add("error-input");
  errorText.classList.add("error-text");
}

const nome = document.getElementById("nome");
const valor = document.getElementById("valor");
const categoria = document.getElementById("categoria");
const data = document.getElementById("data");

limparErro(nome, "errorNome");
limparErro(valor, "errorValor");
limparErro(categoria, "errorCategoria");
limparErro(data, "errorData");

function limparErro(input, errorId) {
  input.addEventListener("input", () => {
    document.getElementById(errorId).innerText = "";
    input.classList.remove("error-input");
  });
}

function atualizarStats() {
  const gastos = sistema.listarGastos();

  const total = sistema.calcularTotal();

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const totalMes = gastos
    .filter((gastosMes) => {
      const data = new Date(gastosMes.data);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    })
    .reduce((totalsoma, gastoMesAtual) => totalsoma + gastoMesAtual.valor, 0);

  const totalRegistos = gastos.length;

  const totalCategorias = new Set(
    gastos.map((gastoCategoria) => gastoCategoria.categoria),
  ).size;

  document.getElementById("totalGasto").innerText = `${formatarMoeda(total)}`;
  document.getElementById("mesAtual").innerText = `${formatarMoeda(totalMes)}`;
  document.getElementById("totalRegistros").innerText = totalRegistos;
  document.getElementById("totalCategorias").innerText = totalCategorias;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const inputPesquisa = document.getElementById("pesquisa");

inputPesquisa.addEventListener("input", () => {
  const texto = inputPesquisa.value.toLowerCase();

  const gastosResultado = sistema.listarGastos().filter((pg) => {
    return pg.nome.toLowerCase().includes(texto);
  });

  atualizarListaGastos(gastosResultado);
});

const btnTodas = document.getElementById("filtroTodas");
const btnAlimentacao = document.getElementById("filtroAlimentacao");
const btnTransporte = document.getElementById("filtroTransporte");
const btnMoradia = document.getElementById("filtroMoradia");
const btnSaude = document.getElementById("filtroSaude");
const btnEducacao = document.getElementById("filtroEducacao");
const btnLazer = document.getElementById("filtroLazer");
const btnVestuario = document.getElementById("filtroVestuario");
const btnOutros = document.getElementById("filtroOutros");

function filtrarCategoria(categoria) {
  const resCategoria = sistema.listarGastos();

  if (categoria === "filtroTodas") return atualizarListaGastos();

  const filtroCatego = resCategoria.filter(
    (fgc) => fgc.categoria === categoria,
  );
  atualizarListaGastos(filtroCatego);
}

btnTodas.addEventListener("click", () => filtrarCategoria("filtroTodas"));
btnAlimentacao.addEventListener("click", () => filtrarCategoria("alimentacao"));
btnTransporte.addEventListener("click", () => filtrarCategoria("transporte"));
btnMoradia.addEventListener("click", () => filtrarCategoria("moradia"));
btnSaude.addEventListener("click", () => filtrarCategoria("saude"));
btnEducacao.addEventListener("click", () => filtrarCategoria("educacao"));
btnLazer.addEventListener("click", () => filtrarCategoria("lazer"));
btnVestuario.addEventListener("click", () => filtrarCategoria("vestuario"));
btnOutros.addEventListener("click", () => filtrarCategoria("outros"));
