# cdx.md

## 1. Visao geral do trabalho realizado
- Implementado backend FastAPI completo com routers para sessao, projetos, designs e simulacoes, seguindo o contrato definido em `pyaedt.md`.
- Estruturado servicos PyAEDT (HFSSSessionManager, extractors, storage, video) e integracao com Celery/Redis para tarefas longas.
- Criado frontend Vite + React + TypeScript com estrutura modular (pages, components, hooks, services, types) e telas principais (sessao, resumo, S-parametros, radiacao, simulacoes) + nova pagina de datasheet.
- Adicionados documentos auxiliares (`README.md` com arquitetura/execucao e `ccomands.md` com comandos frequentes).

## 2. Backend
- `backend/pyproject.toml`: configuracao do projeto Python (FastAPI, PyAEDT, Celery, Redis, pydantic-settings).
- `backend/app/main.py`: inicializa FastAPI, CORS e registra routers.
- `backend/app/config.py`: define Settings (versao AEDT, diretorios de storage/uploads, Redis, CORS) + criacao de diretorios.
- `backend/app/schemas/*`: modelos Pydantic tipando respostas/requests de sessao, projeto, design, resultados e simulacoes.
- `backend/app/services/hfss_session.py`: `HFSSSessionManager` (conectar/iniciar GUI AEDT, abrir projetos, retornar metadados).
- `backend/app/services/storage.py`: persistencia de uploads e artefatos com URLs simuladas.
- `backend/app/services/extractors.py`: extracao realista usando APIs PyAEDT (reports, far-field, export_model_picture) com fallback.
- `backend/app/services/repository.py`: persistencia JSON para projetos (`projects.json`) e jobs/frames (`sim_jobs.json`, `sim_frames.json`).
- `backend/app/services/datasheet.py`: agrega sumario/S-params/radiacao/imagens para gerar datasheet.
- `backend/app/services/video.py`: gerador de frames placeholder para videos parametricos.
- `backend/app/routers/session.py`: endpoints connect/start/status.
- `backend/app/routers/projects.py`: upload, open e listagem de projetos com persistencia.
- `backend/app/routers/designs.py`: summary, sparameters, radiation, geometry image.
- `backend/app/routers/simulations.py`: cria job Celery (fallback sincrono), retorna progresso e frames persistidos.
- `backend/app/routers/datasheets.py`: exposto em `/datasheets/{design}`.
- `backend/app/celery_app.py` + `backend/app/workers/tasks.py`: configuracao Celery e task `generate_simulation_video`.

## 3. Frontend
- `frontend/package.json`, `tsconfig*.json`, `vite.config.ts`, `tailwind.config.cjs`, `postcss.config.cjs`, `index.html`: setup do projeto Vite/React/TS/Tailwind.
- `frontend/src/main.tsx`, `router.tsx`, `components/layout/*`: base do SPA (QueryClientProvider + RouterProvider, Sidebar/TopBar/AppLayout).
- `frontend/src/services/apiClient.ts` + `frontend/src/services/aedtApi.ts`: cliente Axios e funcoes tipadas para todos endpoints REST.
- `frontend/src/hooks/*`: hooks React Query para sessao, projetos, designs, S-params, radiacao, simulacoes.
- `frontend/src/components/common/*`, `components/forms/*`, `components/charts/*`: blocos reutilizaveis (cards, tabelas, upload, select, Plotly charts, heatmap placeholder).
- `frontend/src/pages/*.tsx`: telas Session, Summary, SParameters, Radiation, SimulationVideo e Datasheet implementando fluxos descritos em `pyaedt.md`.
- `backend/tests/test_repository.py`: testes Pytest validando ProjectRepository/SimulationRepository com `tmp_path`.
- `frontend/src/styles/globals.css`: utilitarios Tailwind + estilos basicos.

## 4. Documentacao e comandos
- `README.md`: arquitetura completa, fluxos principais, contrato REST resumido, estrutura de pastas e instrucoes de execucao (backend, Celery/Redis, frontend).
- `ccomands.md`: tabela com comandos Git, instalacao/execucao de backend e frontend, utilitarios de monitoramento.

## 5. Pendencias / proximos passos
1. Integrar `services/extractors.py` e `services/video.py` aos recursos reais do PyAEDT (Reports, FieldPlot, SBR+, exportacao glTF/PNG).
2. Configurar Redis/Celery em ambiente real e validar sincronizacao dos arquivos JSON (`projects.json`, `sim_jobs.json`, `sim_frames.json`) em ambiente multiusuario.
3. Implementar autenticacao/autorizacao (tokens) e ampliar testes automatizados (pytest, React Testing Library, lint/ruff).
