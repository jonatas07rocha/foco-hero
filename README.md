# Foco Hero (v2.0)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-offline--first-green.svg)](https://web.dev/progressive-web-apps/)

**Assistente de foco e produtividade 100% offline-first, instalável como PWA e sem dependência de servidor externo ou login.**

---

## Funcionalidades Principais

- **Dois Métodos de Foco**
  - **Pomodoro:** ciclos configuráveis de foco, pausa curta e pausa longa, com opção de início automático (*auto-start*).
  - **Adaptativo:** cronômetro progressivo para sessões de *Deep Work*, com pausa sem encerrar e finalização manual.
- **Paisagens Sonoras & Mixer Híbrido**
  - Sintetizador local via **Web Audio API** (Chuva, Trovão, Vento, Ruído Marrom/Rosa, Lareira, Grilos, Sinfonia Lo-Fi) com *fade-in/fade-out* configurável nas pausas (`Silenciar`, `Abaixar 25%` ou `Contínuo`), vínculo automático por tema e upload de **faixas locais (MP3/OGG/WAV)** salvas em **IndexedDB**.
- **Visor Inteligente & Modo Zen**
  - Navegação fluida dentro do próprio card (`Foco`, `Painel`, `Loja`, `Ajustes`, `Ajuda`) sem pop-ups externos.
  - Notificações e recompensas exibidas diretamente no visor do cronômetro, além de Modo Zen e opção **Manter tela acesa (Wake Lock)** durante o foco.
  - Atalhos: `Espaço` (iniciar/pausar), `N` (nova tarefa), `Esc` (fechar diálogo, sair do Modo Zen ou avançar aviso no visor).
- **Gestão Enxuta de Tarefas**
  - Criação com estimativa de Pomodoros, **edição rápida inline** (botão de lápis ou duplo clique para editar nome e estimativa), reordenação, alternância para mostrar/ocultar concluídas e proteção contra XSS.
- **Histórico Multi-dias & Analytics**
  - Persistência local em **IndexedDB** (com fallback em `localStorage`), virada automática de dia mantendo tarefas pendentes, gráfico semanal de 7 dias, análise de interrupções internas/externas e **Exportação/Importação JSON**.
- **Gamificação, Loja & Efeitos Visuais**
  - XP e moedas proporcionais ao tempo focado + bônus por sessões sem interrupções.
  - Missões diárias, conquistas, **Escudo de Sequência**, preview ao vivo de 10s e **16 temas compráveis com animações em Canvas 2D ao redor do card** — incluindo o **Tema Matriz**.
- **PWA Offline-First Completo**
  - Zero CDNs externas (CSS, ícones SVG e Service Worker em `public/sw.js`), layout responsivo híbrido para Desktop e Mobile/PWA (`100dvh` + `safe-area`) e deploy automático para **GitHub Pages** via GitHub Actions.

---

## Tecnologias Utilizadas

- HTML5 & CSS3 (zero CDN)
- JavaScript (ES Modules, Vanilla JS)
- Canvas 2D (`theme_effects.js`)
- IndexedDB + `localStorage` fallback
- Web Audio API, Screen Wake Lock API & Web Notifications API
- Service Worker & Web App Manifest
- Node.js nativo (`server.js` e `node --test`) — **zero dependências externas**

---

## Como Executar Localmente

Pré-requisito: **Node.js 18+** (não precisa rodar `npm install`).

```bash
# Iniciar o servidor local (http://127.0.0.1:3000)
npm start

# Executar a suíte de testes automatizados
npm test
```

Para publicar automaticamente no **GitHub Pages**, basta ativar **Settings → Pages → Source: GitHub Actions** no repositório.

---

## Licença

Este projeto está sob a licença **MIT**. Consulte [LICENSE](LICENSE).

---

## Autor

Feito por **Jônatas Rocha** ([GitHub @jonatas07rocha](https://github.com/jonatas07rocha)).
