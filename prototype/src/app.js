import { createInitialState, PhoneView, Projection, reduce, Tab, tracks } from "./state.js";

let state = createInitialState();
let toastTimer;

const $ = selector => document.querySelector(selector);
const workspace = $("#workspace");
const contacts = Object.freeze([
  Object.freeze({ initials: "AM", name: "Ana Moura", number: "(65) 99912-4820" }),
  Object.freeze({ initials: "CS", name: "Casa", number: "(65) 3028-0140" }),
  Object.freeze({ initials: "OF", name: "Oficina", number: "(65) 99244-1630" })
]);

const tabLabels = Object.freeze({
  [Tab.APPS]: "Aplicativos",
  [Tab.MAP]: "Mapa",
  [Tab.MEDIA]: "Mídia",
  [Tab.PHONE]: "Telefone",
  [Tab.SETTINGS]: "Ajustes"
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function dispatch(event, message, shouldRender = true) {
  const previous = state;
  state = reduce(state, event);
  // Reducers return the current object for ignored/no-op events.  Avoiding a
  // complete DOM rebuild is important on the 1 GB ARMv7 head unit.
  if (previous === state) return;
  if (shouldRender) render();
  if (message) showToast(message);
}

function projectionLabel() {
  return state.projection === Projection.ANDROID_AUTO
    ? "Android Auto conectado"
    : state.projection === Projection.CARPLAY
      ? "Apple CarPlay conectado"
      : "Nenhum telefone conectado";
}

function mediaControls(compact = false) {
  const track = tracks[state.media.trackIndex];
  const icon = state.media.playing ? "Ⅱ" : "▶";
  if (compact) return `
    <article class="card media-card">
      <em>AGORA TOCANDO</em>
      <div class="media-row"><div class="album">♫</div><div><h2>${track.title}</h2><p>${track.artist}</p></div></div>
      <div class="controls">
        <button data-action="previous" aria-label="Faixa anterior">‹</button>
        <button class="play" data-action="toggle-play" aria-label="${state.media.playing ? "Pausar" : "Reproduzir"}">${icon}</button>
        <button data-action="next" aria-label="Próxima faixa">›</button>
      </div>
    </article>`;

  return `
    <section class="page media-page" aria-label="Mídia">
      <header class="page-heading"><div><em>MÍDIA</em><h1>Sua trilha na estrada</h1></div><div class="source-pill">USB conectado</div></header>
      <div class="media-layout">
        <article class="now-playing card">
          <div class="album album-large">♫</div>
          <div class="track-copy"><span>TOCANDO AGORA • ${track.source}</span><h2>${track.title}</h2><p>${track.artist}</p></div>
          <input class="range progress" data-input="seek" aria-label="Posição da faixa" type="range" min="0" max="${track.duration}" value="${state.media.elapsed}">
          <div class="time-row"><span>${formatTime(state.media.elapsed)}</span><span>${formatTime(track.duration)}</span></div>
          <div class="player-actions">
            <button data-action="shuffle" class="icon-button ${state.media.shuffle ? "active" : ""}" aria-pressed="${state.media.shuffle}" aria-label="Aleatório">⤨</button>
            <button data-action="previous" class="icon-button" aria-label="Faixa anterior">◀</button>
            <button data-action="toggle-play" class="primary-round" aria-label="${state.media.playing ? "Pausar" : "Reproduzir"}">${icon}</button>
            <button data-action="next" class="icon-button" aria-label="Próxima faixa">▶</button>
            <button data-action="repeat" class="icon-button ${state.media.repeat ? "active" : ""}" aria-pressed="${state.media.repeat}" aria-label="Repetir">↻</button>
          </div>
          <div class="volume-row">
            <button data-action="mute" class="icon-button" aria-label="Alternar mudo">${state.media.muted ? "🔇" : "🔊"}</button>
            <input class="range" data-input="volume" aria-label="Volume" type="range" min="0" max="100" value="${state.media.muted ? 0 : state.media.volume}">
            <output>${state.media.muted ? 0 : state.media.volume}%</output>
          </div>
        </article>
        <aside class="queue card"><em>FILA DE REPRODUÇÃO</em>${tracks.map((item, index) => `
          <button class="queue-item ${index === state.media.trackIndex ? "active" : ""}" data-action="select-track" data-index="${index}">
            <span>${index + 1}</span><span><b>${item.title}</b><small>${item.artist}</small></span><time>${formatTime(item.duration)}</time>
          </button>`).join("")}
        </aside>
      </div>
    </section>`;
}

function phoneSummary() {
  return `
    <article class="card phone-card ${state.phone.connected ? "connected" : ""}">
      <em>TELEFONE</em>
      <h2>${projectionLabel()}</h2>
      <p>${state.projectionConnected ? "Toque novamente para desconectar a simulação." : "Escolha uma projeção para simular."}</p>
      <div class="projection-actions">
        <button data-action="projection" data-value="${Projection.ANDROID_AUTO}" class="${state.projection === Projection.ANDROID_AUTO ? "active" : ""}">Android Auto</button>
        <button data-action="projection" data-value="${Projection.CARPLAY}" class="${state.projection === Projection.CARPLAY ? "active" : ""}">Apple CarPlay</button>
      </div>
    </article>`;
}

function renderMap() {
  return `
    <article class="map-card" aria-label="Mapa de demonstração">
      <div class="map-grid"></div><i class="road a"></i><i class="road b"></i><i class="road c"></i><div class="position"><span></span></div>
      <div class="map-copy"><em>MAPA DE CONTINGÊNCIA</em><h1>Pronto para<br>navegar</h1><p>Conecte seu telefone para usar Google Maps pela projeção.</p></div>
      <button data-action="navigate" class="navigate-button">Iniciar navegação →</button>
      <small>DEMONSTRAÇÃO • SEM TILES GOOGLE</small>
    </article>
    <aside class="side-panel">${mediaControls(true)}${phoneSummary()}</aside>`;
}

function renderPhone() {
  if (!state.phone.connected) return `
    <section class="page phone-page empty-state">
      <div class="empty-icon">ᛒ</div><em>TELEFONE</em><h1>Conecte seu telefone</h1>
      <p>Ative o Bluetooth para acessar contatos, chamadas e projeção.</p>
      <button class="primary-button" data-action="connect-phone" ${state.bluetoothEnabled ? "" : "disabled"}>Conectar telefone de demonstração</button>
      ${state.bluetoothEnabled ? "" : "<small>O Bluetooth está desativado.</small>"}
    </section>`;

  const activeCall = state.phone.activeCall ? `
    <section class="call-banner"><span>CHAMADA EM ANDAMENTO</span><strong>${state.phone.activeCall}</strong><time>${formatTime(state.phone.callSeconds)}</time><button data-action="end-call" aria-label="Encerrar chamada">☎</button></section>` : "";
  const selector = `<div class="segmented"><button data-action="phone-view" data-value="${PhoneView.CONTACTS}" class="${state.phone.view === PhoneView.CONTACTS ? "active" : ""}">Contatos</button><button data-action="phone-view" data-value="${PhoneView.KEYPAD}" class="${state.phone.view === PhoneView.KEYPAD ? "active" : ""}">Teclado</button></div>`;
  const body = state.phone.view === PhoneView.CONTACTS
    ? `<div class="contact-list">${contacts.map(contact => `<button class="contact" data-action="call" data-value="${contact.number}"><span>${contact.initials}</span><span><b>${contact.name}</b><small>${contact.number}</small></span><i>☎</i></button>`).join("")}</div>`
    : `<div class="dialer"><output>${state.phone.dialInput || "Digite um número"}</output><div class="dial-pad">${["1","2","3","4","5","6","7","8","9","*","0","#"].map(digit => `<button data-action="digit" data-value="${digit}">${digit}</button>`).join("")}</div><div class="dial-actions"><button data-action="backspace" aria-label="Apagar">⌫</button><button class="call-button" data-action="call" aria-label="Ligar">☎</button></div></div>`;

  return `
    <section class="page phone-page">
      ${activeCall}
      <header class="page-heading"><div><em>TELEFONE</em><h1>Omni Phone</h1><p>Telefone de demonstração conectado</p></div><button class="secondary-button danger" data-action="disconnect-phone">Desconectar</button></header>
      ${selector}<article class="phone-content card">${body}</article>
    </section>`;
}

function renderApps() {
  const apps = [
    ["⌖", "Mapas", "map"], ["♫", "Mídia", "media"], ["☏", "Telefone", "phone"],
    ["◉", "Wi-Fi", "settings"], ["ᛒ", "Bluetooth", "settings"], ["⚙", "Veículo", "settings"]
  ];
  return `
    <section class="page apps-page">
      <header class="page-heading"><div><em>APLICATIVOS</em><h1>Todos os recursos</h1></div><span class="source-pill">6 instalados</span></header>
      <div class="app-grid">${apps.map(([icon, label, target]) => `<button class="app-tile" data-action="launch-app" data-value="${target}"><span>${icon}</span><b>${label}</b><small>Abrir</small></button>`).join("")}</div>
      <p class="safety-note">Algumas funções ficam limitadas enquanto o veículo estiver em movimento.</p>
    </section>`;
}

function toggleRow(title, detail, action, enabled) {
  return `<div class="setting-row"><div><b>${title}</b><small>${detail}</small></div><button class="switch ${enabled ? "on" : ""}" data-action="${action}" role="switch" aria-checked="${enabled}"><span></span></button></div>`;
}

function renderSettings() {
  return `
    <section class="page settings-page">
      <header class="page-heading"><div><em>AJUSTES</em><h1>Preferências do sistema</h1></div><span class="source-pill">SO Omni 0.2.1</span></header>
      <div class="settings-grid">
        <article class="settings-card card"><h2>Conectividade</h2>
          ${toggleRow("Wi-Fi", state.wifiEnabled ? "Ativo e procurando redes" : "Desativado", "toggle-wifi", state.wifiEnabled)}
          ${toggleRow("Bluetooth", state.bluetoothEnabled ? "Visível como SO Omni" : "Desativado", "toggle-bluetooth", state.bluetoothEnabled)}
        </article>
        <article class="settings-card card"><h2>Tela e áudio</h2>
          <label class="slider-setting"><span><b>Brilho</b><output>${state.brightness}%</output></span><input class="range" data-input="brightness" type="range" min="20" max="100" value="${state.brightness}"></label>
          <label class="slider-setting"><span><b>Volume principal</b><output>${state.media.volume}%</output></span><input class="range" data-input="volume" type="range" min="0" max="100" value="${state.media.volume}"></label>
          ${toggleRow("Reduzir animações", "Mais conforto e menor uso gráfico", "toggle-motion", state.reducedMotion)}
        </article>
        <article class="settings-card card system-card"><h2>Sistema</h2><div class="system-info"><span>Memória alvo<b>1 GB RAM</b></span><span>Armazenamento alvo<b>16 GB</b></span><span>Ambiente atual<b>Protótipo web</b></span></div><button class="secondary-button danger" data-action="reset">Restaurar ajustes</button></article>
      </div>
    </section>`;
}

function render() {
  $("#wifi").setAttribute("aria-pressed", String(state.wifiEnabled));
  $("#bluetooth").setAttribute("aria-pressed", String(state.bluetoothEnabled));
  $("#clock").textContent = state.clock;
  $("#date").textContent = state.date;
  document.body.classList.toggle("reduced-motion", state.reducedMotion);
  document.documentElement.style.setProperty("--screen-brightness", String(0.55 + state.brightness * 0.0045));

  const screens = {
    [Tab.APPS]: renderApps,
    [Tab.MAP]: renderMap,
    [Tab.MEDIA]: () => mediaControls(false),
    [Tab.PHONE]: renderPhone,
    [Tab.SETTINGS]: renderSettings
  };
  workspace.className = `workspace workspace-${state.activeTab}`;
  workspace.innerHTML = screens[state.activeTab]();
  for (const button of document.querySelectorAll(".dock [data-tab]")) {
    const selected = button.dataset.tab === state.activeTab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-current", selected ? "page" : "false");
  }
  document.title = `${tabLabels[state.activeTab]} • SO Omni`;
}

document.addEventListener("click", event => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    dispatch({ type: "SELECT_TAB", tab: tabButton.dataset.tab });
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  const value = button.dataset.value;
  switch (button.dataset.action) {
    case "backspace": dispatch({ type: "DIAL_BACKSPACE" }); break;
    case "call": dispatch({ type: "START_CALL", target: value }, "Chamada iniciada"); break;
    case "connect-phone": dispatch({ type: "CONNECT_PHONE" }, "Telefone conectado"); break;
    case "digit": dispatch({ type: "DIAL_DIGIT", digit: value }); break;
    case "disconnect-phone": dispatch({ type: "DISCONNECT_PHONE" }, "Telefone desconectado"); break;
    case "end-call": dispatch({ type: "END_CALL" }, "Chamada encerrada"); break;
    case "launch-app": dispatch({ type: "SELECT_TAB", tab: value }, `${tabLabels[value]} aberto`); break;
    case "mute": dispatch({ type: "TOGGLE_MUTE" }); break;
    case "navigate":
      if (!state.bluetoothEnabled) showToast("Ative o Bluetooth para iniciar a projeção");
      else dispatch({ type: "CONNECT_PROJECTION", projection: state.projectionConnected ? state.projection : Projection.ANDROID_AUTO }, "Projeção pronta para navegação");
      break;
    case "next": dispatch({ type: "NEXT_TRACK" }); break;
    case "phone-view": dispatch({ type: "SET_PHONE_VIEW", view: value }); break;
    case "previous": dispatch({ type: "PREVIOUS_TRACK" }); break;
    case "projection":
      if (!state.bluetoothEnabled) showToast("Ative o Bluetooth antes de conectar");
      else if (state.projection === value) dispatch({ type: "DISCONNECT_PROJECTION" }, "Projeção desconectada");
      else dispatch({ type: "CONNECT_PROJECTION", projection: value }, `${value === Projection.CARPLAY ? "Apple CarPlay" : "Android Auto"} conectado`);
      break;
    case "repeat": dispatch({ type: "TOGGLE_REPEAT" }); break;
    case "reset": dispatch({ type: "RESET_SETTINGS" }, "Ajustes restaurados"); break;
    case "select-track": dispatch({ type: "SELECT_TRACK", trackIndex: Number(button.dataset.index) }); break;
    case "shuffle": dispatch({ type: "TOGGLE_SHUFFLE" }); break;
    case "toggle-bluetooth": dispatch({ type: "TOGGLE_BLUETOOTH" }); break;
    case "toggle-motion": dispatch({ type: "TOGGLE_REDUCED_MOTION" }); break;
    case "toggle-play": dispatch({ type: "TOGGLE_PLAY" }); break;
    case "toggle-wifi": dispatch({ type: "TOGGLE_WIFI" }); break;
  }
});

$("#wifi").addEventListener("click", () => dispatch({ type: "TOGGLE_WIFI" }));
$("#bluetooth").addEventListener("click", () => dispatch({ type: "TOGGLE_BLUETOOTH" }));

workspace.addEventListener("input", event => {
  const input = event.target.closest("[data-input]");
  if (!input) return;
  if (input.dataset.input === "brightness") dispatch({ type: "SET_BRIGHTNESS", brightness: input.value });
  if (input.dataset.input === "seek") dispatch({ type: "SEEK_MEDIA", elapsed: input.value });
  if (input.dataset.input === "volume") dispatch({ type: "SET_VOLUME", volume: input.value });
});

function updateClock() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(now).replace(".", "");
  const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(now);
  dispatch({
    type: "TICK",
    clock: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now),
    date: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${shortDate}`
  });
}

updateClock();
setInterval(updateClock, 30_000);
setInterval(() => {
  // Do not wake up and repaint the UI every second while it is idle.
  if (state.media.playing) dispatch({ type: "MEDIA_TICK" }, undefined, state.activeTab === Tab.MEDIA);
  if (state.phone.activeCall) dispatch({ type: "CALL_TICK" }, undefined, state.activeTab === Tab.PHONE);
}, 1_000);
