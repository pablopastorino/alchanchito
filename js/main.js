/* -------------------------------- Elements -------------------------------- */
const form = document.querySelector("form");
const deleteButton = document.querySelector("input[type=reset]");
const {
  "cantidad-1": cantidad1,
  "cantidad-2": cantidad2,
  "importe-1": importe1,
  "importe-2": importe2,
} = form.elements;
const url = "https://young-journey-03307.herokuapp.com/api/banks";
let tasaPasiva;
const SPREAD = 0.35;
/* -------------------------------- Listeners ------------------------------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const opcionGandadora = compara(
    cantidad1.value,
    importe1.value,
    cantidad2.value,
    importe2.value
  );
  muestraGanador(opcionGandadora);
});

window.addEventListener("load", async () => {
  const bancos = await obtenerBancos();
  tasaPasiva = bancos[0].clients / 100;
});

deleteButton.addEventListener("pointerdown", borraFormulario);

/* -------------------------------- Functions ------------------------------- */
function compara(cuotas1, valor1, cuotas2, valor2) {
  const tasaActivaMensual = (tasaPasiva + tasaPasiva * SPREAD) / 12;

  const van1 = calculaVan(cuotas1, valor1, tasaActivaMensual);
  const van2 = calculaVan(cuotas2, valor2, tasaActivaMensual);

  return (van1 < van2 && 1) || (van1 > van2 && 2) || 3;
}

function calculaVan(cuotas, importe, tasa) {
  let valorActualNeto = 0;

  if (cuotas == 0) valorActualNeto = importe;
  else {
    for (let i = 0; i < cuotas; i++) {
      const flujoNeto = importe / Math.pow(1 + tasa, i + 1);
      valorActualNeto += flujoNeto;
      console.log(valorActualNeto);
    }
  }
  console.log(valorActualNeto);
  return valorActualNeto;
}

function muestraGanador(numero) {
  if (numero !== 3) {
    const ganador = document.querySelector(`fieldset[class^=metodo-${numero}]`);

    const perdedor = document.querySelector(
      `fieldset[class^=metodo-${numero === 1 ? "2" : "1"}]`
    );

    ganador.classList.toggle("winner");
    perdedor.classList.toggle("loser");

    document.querySelector("h1").innerText = "¡Nuestros expertos calcularon!";
    document.querySelector("h2").innerText = `Y aconsejan la OPCION ${numero}`;
  } else {
    const opcionesEmpatadas = document.querySelectorAll(
      `fieldset[class^=metodo-]`
    );
    opcionesEmpatadas.forEach((o) => o.classList.toggle("tie"));
  }
}

function borraFormulario() {
  let numero = 1;

  document.querySelectorAll(`fieldset[class^=metodo-]`).forEach((e) => {
    e.className = `metodo-${numero}`;
    numero += 1;
  });

  document.querySelector("h1").innerText = "¡Compará tus opciones de pago!";
  document.querySelector("h2").innerText = `Y comprá como te convenga`;
}

async function obtenerBancos() {
  const endpoint = url;
  const respuesta = await fetch(endpoint);
  if (respuesta.ok) {
    const json = await respuesta.json();
    return json;
  } else {
    alert(`Error ${respuesta.status} al consultar a ${respuesta.url}`);
  }
}
