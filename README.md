# 🚀 Foco Total (v2.0)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-offline--first-green.svg)](https://web.dev/progressive-web-apps/)

**Assistente de foco e produtividade 100% offline-first, sem dependência de servidor externo ou cadastro.**

---

## ✨ Funcionalidades Principais

- 🧠 **Dois Métodos de Foco**
  - **Pomodoro:** ciclos configuráveis de foco, pausa curta e pausa longa, com opção de início automático (*auto-start*).
  - **Adaptativo:** cronômetro progressivo para sessões de *Deep Work*, agora com **pausa sem encerrar** e finalização manual.
- 🧘 **Modo Zen & Atalhos de Teclado**
  - Interface limpa focada apenas no cronômetro (`Espaço` inicia/pausa, `N` adiciona tarefa, `Esc` fecha modais ou sai do Modo Zen).
- 📋 **Gestão Inteligente de Tarefas**
  - Categorias (`Geral`, `Estudo`, `Trabalho`, `Projeto`, `Pessoal`), filtro por tag, reordenação na lista e proteção contra XSS.
- 📊 **Histórico Multi-dias & Analytics**
  - Persistência local em **IndexedDB** (com migração automática do `localStorage`), virada automática de dia preservando tarefas pendentes, gráfico semanal de 7 dias, análise de interrupções (internas/externas) e distribuição por categoria.
  - **Exportação e Importação de Backup (JSON)** nas Configurações.
- 🎮 **Gamificação & Loja do Foco**
  - XP e moedas proporcionais ao tempo focado + bônus por sessões sem interrupções.
  - Missões diárias, desafios secretos, conquistas e temas (incluindo coleção dos estados brasileiros, **preview ao vivo de 10s**, sazonalidade real e **Escudo de Sequência**).
- 📱 **PWA Offline-First Completo**
  - CSS, ícones SVG e Service Worker (`public/sw.js`) empacotados localmente, sem CDNs externas, com suporte a notificações nativas (`Web Notifications API`).

---

## 🛠️ Tecnologias Utilizadas

- HTML5 & CSS3 (zero CDN)
- JavaScript (ES Modules, Vanilla JS)
- IndexedDB + `localStorage` fallback
- Web Audio API & Web Notifications API
- Service Worker & Web App Manifest
- Node.js nativo (`server.js` e `node --test`) — **zero dependências externas**

---

## 🚀 Como Executar Localmente

Pré-requisito: **Node.js 18+** (não precisa rodar `npm install`).

```bash
# Iniciar o servidor local (http://127.0.0.1:3000)
npm start

# Executar a suíte de testes automatizados
npm test
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte [LICENSE](LICENSE).

---

## 👨‍💻 Autor

Feito por **Jônatas Rocha** ([GitHub @jonatas07rocha](https://github.com/jonatas07rocha)).
