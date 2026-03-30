function salvarDados() {
  localStorage.setItem("gastos", JSON.stringify(sistema.lista));
}

function carregarDados() {
  const dados = localStorage.getItem("gastos");

  if (dados) {
    sistema.lista = JSON.parse(dados);
  }
}

function novoGasto() {
  const card = document.getElementById("card");
  const novoGastoBtn = document.getElementById("novoGasto");
  novoGastoBtn.classList.add("oculto");
  card.classList.remove("oculto");

  if (editandoId === null) {
    data.value = new Date().toLocaleDateString("en-CA");
  }

  if (editandoId !== null) {
    document.getElementById("cardTitle").innerText = "Editar Gasto";
    document.getElementById("btnAdicionar").innerText = "Salvar";
  } else {
    document.getElementById("cardTitle").innerText = "Novo Gasto";
    document.getElementById("btnAdicionar").innerText = "Adicionar";
  }
}

function cancelar() {
  const card = document.getElementById("card");
  const novoGastoBtn = document.getElementById("novoGasto");
  card.classList.add("oculto");
  novoGastoBtn.classList.remove("oculto");

  nome.value = "";
  valor.value = "";
  categoria.value = "";
  data.value = "";

  editandoId = null;
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
    salvarDados();
  }

  deletarGasto(id) {
    this.lista = this.lista.filter((gasto) => gasto.id !== id);
    salvarDados();
    atualizarStats();
    atualizarListaGastos();
    atualizarGrafico(sistema.lista);
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
    salvarDados();

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
  atualizarGrafico(sistema.lista);
}

function editarGasto(id) {
  const gastoEditar = sistema.lista.find((gasto) => gasto.id === id);

  document.getElementById("nome").value = gastoEditar.nome;
  document.getElementById("valor").value = gastoEditar.valor;
  document.getElementById("categoria").value = gastoEditar.categoria;
  document.getElementById("data").value = gastoEditar.data;

  editandoId = id;

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

  if (lista.length === 0) {
    listaGastos.innerHTML = `
      <div class="vazio-container">
        <div class="vazio-icone-fundo">
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#808080"><path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z"/></svg>
        </div>
        <h3 class="vazio-titulo">Nenhum gasto encontrado</h3>
        <p class="vazio-descricao">Adicione seu primeiro gasto ou mude os filtros</p>
      </div>
    `;
    return;
  }

  lista.forEach((gasto) => {
    const coresCategoria = {
      alimentacao: "orange",
      transporte: "blue",
      moradia: "violet",
      saude: "red",
      educacao: "cyan",
      lazer: "yellow",
      vestuario: "pink",
      outros: "gray",
    };

    const icone = iconesPorCategoria[gasto.categoria];
    const cor = coresCategoria[gasto.categoria] || "gray";
    listaGastos.innerHTML += `
      <div class="expense-item">
        <div class="expense-icon bg-${cor}">${icone}</div>
        <div class="expense-info">
          <div class="expense-name">${gasto.nome}</div>
          <div class="expense-meta">
            <span class="expense-badge bg-${cor} text-${cor}">${gasto.categoria}</span>
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

let grafico;

function atualizarGrafico(lista) {
  const graficoRosquinha = document.getElementById("graficoGastos");
  const semLista = document.getElementById("semLista");

  if (grafico) {
    grafico.destroy();
  }

  if (lista.length === 0) {
    semLista.innerHTML =
      "<p class='semDados'>Adicione gastos para ver o gráfico</p>";
    return;
  } else {
    semLista.innerHTML = "";
  }

  const categorias = {};

  lista.forEach((gastoG) => {
    if (!categorias[gastoG.categoria]) {
      categorias[gastoG.categoria] = 0;
    }
    categorias[gastoG.categoria] += gastoG.valor;
  });

  const labels = Object.keys(categorias);
  const valores = Object.values(categorias);

  const coresPorCategoria = {
    alimentacao: "#f39c12",
    moradia: "#8e44ad",
    transporte: "#3498db",
    saude: "#e74c3c",
    educacao: "#1abc9c",
    lazer: "#f1c40f",
    vestuario: "#e84393",
  };

  const cores = labels.map((label) => coresPorCategoria[label] || "#ccc");

  grafico = new Chart(graficoRosquinha, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gastos por categoria",
          data: valores,
          backgroundColor: cores,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const nome = context.label;
              const valor = context.raw;

              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const porcentagem = ((valor / total) * 100).toFixed(1);

              return `${nome}: R$ ${valor} (${porcentagem}%)`;
            },
          },
        },
        legend: {
          display: false,
        },
      },

      cutout: "70%",
    },
  });
}

const chips = document.querySelectorAll(".chip");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("ativo"));
    chip.classList.add("ativo");
  });
});

carregarDados();
atualizarListaGastos();
atualizarStats();
atualizarGrafico(sistema.lista);
