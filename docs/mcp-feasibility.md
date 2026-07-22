# MCP dans BRIMKERN (100% navigateur, sans serveur) — faisabilité

> Recherche le 2026-06-25. Question : peut-on faire du **MCP (Model Context Protocol)** dans une app
> 100% navigateur, sans backend ? Réponse courte : **le protocole MCP intégral et serverless n'a pas
> grand intérêt ici ; ce qu'on veut vraiment (donner des outils au modèle) se fait mieux avec une
> couche d'outils locale légère.** Détail ci-dessous.

## 1. Ce qu'est MCP (rappel)
MCP = un protocole **client-serveur** (JSON-RPC 2.0) où un **hôte** (l'app) lance des **clients** qui se
connectent à des **serveurs** exposant **tools / resources / prompts**. Transports standards :
- **stdio** : le serveur est un **processus local** (lancé par l'hôte).
- **Streamable HTTP / SSE** : le serveur est **distant**, joignable en HTTP.

L'intérêt de MCP côté écosystème : brancher des serveurs existants (filesystem, GitHub, Slack, bases de
données…) écrits une fois, réutilisés partout.

## 2. Les contraintes du navigateur (pourquoi « serverless » coince)
- **stdio impossible** : pas de sous-processus / shell / filesystem dans un onglet. Donc les serveurs
  MCP « classiques » (qui tirent leur valeur de l'accès machine) ne tournent pas.
- **HTTP/SSE possible MAIS** : le navigateur peut être un **client** MCP vers un serveur **distant**…
  qui doit donc **exister quelque part** (= pas serverless de bout en bout), et passer le **CORS**.
- Un onglet ne peut faire que des choses **sandbox** : `fetch` (soumis CORS), calcul, IndexedDB, Web
  APIs (clipboard, géoloc, notifications…). Pas de fichiers locaux, pas de réseau brut, pas de process.

## 3. Le vrai bloqueur : la taille du modèle
Indépendamment du transport, le **tool-calling fiable demande un modèle costaud**. Nos modèles
(0.5B–1.5B quantifiés) sont **mauvais pour émettre du structuré** (JSON d'appel d'outil valide,
arguments corrects). En pratique, le function-calling sera **peu fiable** sur ces tailles — c'est ça la
vraie limite, plus que le protocole.

## 4. Les options, par ordre de pragmatisme

### Option A — Couche d'outils locale « MCP-like » (recommandée) · serverless réel
Ne **pas** implémenter le protocole MCP, mais une **boucle de function-calling locale** :
- un **registre d'outils** = fonctions JS (ex. `calculator`, `now`, `fetchUrl` (CORS), `webSearch` via
  une API publique CORS, `readClipboard`, opérations sur les conversations/IndexedDB…) ;
- on injecte leurs **schémas** dans le prompt système (le skill !) ;
- on **parse** les appels d'outil dans la sortie du modèle, on **exécute** en JS, on **réinjecte** le
  résultat, on reboucle.
- 100% navigateur, zéro serveur, zéro CORS hors les `fetch` des outils eux-mêmes.
- **Réutilise l'infra existante** : la boucle de génération de `page.tsx`, et un « skill outils » qui
  décrit le format d'appel. C'est petit à câbler.
- ⚠️ À gater/avertir : peu fiable sous ~3B. Idéal pour démontrer le concept avec 2-3 outils simples.

### Option B — Transport MCP in-browser (Web Worker) · serverless mais peu rentable
Le spec MCP autorise des **transports custom**. On peut faire tourner un « serveur MCP » dans un **Web
Worker** et connecter le client via `postMessage`/`MessageChannel`. On obtient le **modèle MCP complet**
(tools/resources/prompts) **côté client**… mais les outils restent **sandbox navigateur** (même limite
que l'option A) et on paie l'**overhead du protocole** pour une seule app. **Peu d'intérêt** vs A, sauf
si on vise une compat avec des outils MCP déjà écrits en JS isomorphe.

### Option C — Client MCP vers serveurs distants (Streamable HTTP) · PAS serverless
Le navigateur comme **client** MCP vers des serveurs **hébergés** (que l'utilisateur fournit), via
Streamable HTTP + CORS. On accède alors aux « vrais » serveurs MCP (filesystem distant, GitHub…). Mais
ça **suppose des serveurs** (donc pas serverless de ton côté) et une **auth** (tokens). À envisager
plus tard comme « connecte ton serveur MCP » avancé, pas pour le cœur 100%-local.

## 5. Recommandation
- **Court terme** : **Option A** — une petite couche d'outils locale (2-3 outils : calcul, date,
  fetch-URL/recherche), branchée sur la boucle de génération + un skill « outils ». Serverless, dans
  l'esprit du projet (tout en local), et ça **valorise les Skills** déjà en place.
- **Avertir** que la fiabilité dépend de la taille du modèle (bon dès ~3B+, bancal en 0.5B).
- **MCP « vrai »** (Option C) = chantier ultérieur « brancher un serveur MCP distant », hors du
  positionnement 100%-local — à ne faire que si un besoin concret émerge.

> En somme : « MCP sans serveur » au sens strict = peu pertinent (l'intérêt de MCP vient des serveurs
> machine, qu'un onglet ne peut pas être). Mais l'**objectif sous-jacent** — donner des outils au modèle
> en local — est atteignable simplement (Option A), en réutilisant Skills + la boucle de génération.
