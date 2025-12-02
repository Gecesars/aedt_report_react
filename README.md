# PyAEDT HFSS Control

## Arquitetura em camadas
- **Frontend**: React 18 + Vite + TypeScript + Tailwind, roteado por React Router e sincronizado via React Query.
- **Backend**: FastAPI com validacao Pydantic, routers por dominio (sessao, projetos, designs, simulacoes) e Celery para tarefas longas.
- **Fila**: Celery + Redis para gerar videos/frames e varrer parametros sem travar o processo web.
- **Camada HFSS**: PyAEDT controlando o AEDT 2025.2 em modo grafico (`non_graphical=False`), mantendo sessao viva via `HFSSSessionManager`.
- **Persistencia leve**: registros de projetos e jobs sao sincronizados em arquivos JSON dentro de `data/` (`projects.json`, `sim_jobs.json`, `sim_frames.json`), permitindo retomar sessoes/reprocessamentos.

Fluxo: Usuario (SPA) -> API -> servicos/filas -> PyAEDT/HFSS -> artefatos no storage -> API -> SPA (graficos, imagens, videos).

## Fluxos primordiais
1. **Sessao AEDT/HFSS**
   - `POST /session/connect` tenta anexar a GUI existente (`new_desktop=False`).
   - `POST /session/start` sobe nova instancia (`new_desktop=True`).
   - Estado exposto em `/session/status` (GUI ativa, projeto/design atual, versao AEDT).
2. **Abertura de projeto HFSS**
   - SPA envia arquivo `.aedt/.aedtz` para `/projects/upload`.
   - Backend salva em `data/uploads`, registra `project_id` e chama `HFSSSessionManager.open_project`.
   - Designs disponiveis retornam para preencher dropdowns do frontend.
3. **Artefatos para relatorios/datasheet**
   - `GET /designs/{id}/summary` retorna setups, portas, metrica de ganho/eficiencia.
   - `GET /designs/{id}/sparameters` expoe matriz completa Sij (magnitude, fase, VSWR).
   - `GET /designs/{id}/radiation` entrega cortes E/H e URL do heatmap.
   - `GET /designs/{id}/images/geometry` entrega PNG/WebP da geometria.
4. **Videos parametricos/SBR**
   - `POST /simulations/{design}/videos` cria job Celery (`generate_simulation_video`).
   - Progresso acompanha em `/simulations/{job}` e frames em `/simulations/{job}/frames`.
5. **Datasheet/dossie automatico**
   - `GET /datasheets/{design}` agrega resumo, S-params, radiacao e imagens para montar datasheet imediato.

## Contrato REST resumido
| Endpoint | Metodo | Descricao |
| --- | --- | --- |
| `/health` | GET | Status do backend e versao alvo do AEDT |
| `/session/connect` | POST | Conecta a sessao HFSS existente |
| `/session/start` | POST | Inicia nova GUI (payload `{ "force": bool }`) |
| `/session/status` | GET | Retorna `SessionStatus` |
| `/projects/upload` | POST multipart | Upload de .aedt/.aedtz |
| `/projects/open` | POST | { `project_id`, `open_in_gui` } |
| `/projects` | GET | Lista projetos registrados |
| `/designs/{id}/summary` | GET | `DesignSummary` |
| `/designs/{id}/sparameters` | GET | `SParameterResponse` |
| `/designs/{id}/radiation` | GET | `RadiationResponse` |
| `/designs/{id}/images/geometry` | GET | Query `view` |
| `/simulations/{design}/videos` | POST | `SimulationVideoRequest` |
| `/simulations/{job}` | GET | `SimulationProgress` |
| `/simulations/{job}/frames` | GET | Lista `SimulationFrame` |
| `/datasheets/{design}` | GET | `DatasheetResponse` consolidado |

### Exemplo `POST /simulations/{design}/videos`
```json
{
  "type": "parametric",
  "parameters": ["theta", "phi"],
  "frame_rate": 12,
  "max_frames": 60
}
```
Resposta:
```json
{
  "job_id": "job-8af3a1c2",
  "design_id": "des-01",
  "status": "queued",
  "submitted_at": "2025-02-02T03:10:00Z"
}
```

## Backend (FastAPI)
Estrutura em `backend/app`:
```
main.py                 # cria FastAPI e registra routers
config.py               # Settings via Pydantic Settings
routers/                # session, projects, designs, simulations
schemas/                # Pydantic models (session, project, design, results, simulation)
services/
  hfss_session.py       # HFSSSessionManager controla Desktop AEDT
  storage.py            # salva uploads/artefatos
  extractors.py         # extrai sumario, S-params, radiacao (stubs prontos p/ PyAEDT)
  video.py              # gera frames placeholder, integra com PyAEDT no futuro
workers/
  tasks.py              # tarefa Celery `generate_simulation_video`
celery_app.py           # instancia Celery com Redis
```
- Todos endpoints retornam modelos tipados.
- `HFSSSessionManager` usa `Desktop(... non_graphical=False)` garantindo GUI ativa.
- `extractors.py` possui comentarios de suposicao onde integraremos chamadas reais do PyAEDT (por exemplo `app.post.create_report`).

## Frontend (Vite + React + TS + Tailwind)
Estrutura em `frontend/src`:
```
main.tsx / router.tsx / App.tsx
pages/SessionPage.tsx             # controle de sessao + upload
pages/SummaryPage.tsx             # cards + grafico RL + imagem geometria
pages/SParametersPage.tsx         # graficos e VSWR
pages/RadiationPage.tsx           # polar + heatmap
pages/SimulationVideoPage.tsx     # gerenciamento de jobs Celery
pages/DatasheetPage.tsx           # resumo consolidado/dossie
components/layout/*               # Sidebar, TopBar, AppLayout
components/charts/*               # Plotly wrappers
components/forms/*                # Upload/Select reutilizaveis
components/common/*               # Card, Table, Loader
services/aedtApi.ts               # cliente Axios tipado
hooks/*                           # React Query hooks (sessao, projetos, designs, resultados, simulacoes)
types/*                           # contratos compartilhados
styles/globals.css                # Tailwind + tokens
```
- React Query sincroniza automaticamente `/session/status`, `/projects`, `/designs/...`.
- Plotly renderiza S-params e diagramas polares; heatmap usa `<img>` pois backend gera PNG.
- SimulationVideoPage controla envio de jobs, monitora progresso e apresenta ultimo frame (futuro: viewer react-three-fiber alimentado por glTF exportado pelo PyAEDT).

## Instrucoes de execucao
### Backend
`powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .[dev]
# Ajuste .env se necessario (REDIS_URL, AEDT install path)
uvicorn app.main:app --reload
pytest -q  # valida repositorios/persistencia
`

#### Script automatizado (PowerShell)
`powershell
.\scripts\start-backend.ps1 -RequiredServices Redis -AedtProcessName ansysedt
`
- Checa servicos informados (ex.: Redis) e o processo do AEDT (nsysedt por padrao).
- Garante/ativa .venv, instala dependencias e abre nova janela com uvicorn.
- -StartMissingServices tenta iniciar servicos parados; -ApiHost/-Port mudam host/porta do uvicorn; -SkipHealthCheck ignora o GET /health; -SkipAedtProcessCheck desabilita a validacao do processo AEDT.

Celery worker + Redis:
`powershell
redis-server # ou docker run -p 6379:6379 redis:7
celery -A app.celery_app.celery_app worker -Q hfss -l info
`
### Frontend
`powershell
cd frontend
npm install
="http://localhost:8000"
npm run dev -- --host
`
Abra http://localhost:5173.
## Proximos passos sugeridos
1. Conectar `extractors.py` aos verdadeiros objetos PyAEDT (Reports, FieldPlots, post-processing) e gerar imagens/frames reais.
2. Adicionar autenticacao e auditoria a nivel de API.
3. Automatizar pipeline de exportacao (PDF datasheet, videos glTF) usando Celery + armazenamento externo (S3, Azure Blob).

