# ccomands.md

## 1. Git mais utilizados
| Tarefa | Comando |
| --- | --- |
| Verificar estado do repositorio | `git status` |
| Listar alteracoes detalhadas | `git diff` |
| Adicionar todos os arquivos rastreados | `git add .` |
| Adicionar arquivo especifico | `git add caminho/arquivo.ext` |
| Criar commit com mensagem | `git commit -m "feat: mensagem"` |
| Atualizar branch local | `git pull --rebase origin <branch>` |
| Enviar commits para o remoto | `git push origin <branch>` |
| Criar nova branch | `git checkout -b nome-da-branch` |
| Alternar para branch existente | `git checkout <branch>` |
| Visualizar historico resumido | `git log --oneline --graph --decorate` |
| Guardar alteracoes temporariamente | `git stash push -m "rotulo"` |
| Recuperar alteracoes guardadas | `git stash pop` |
| Criar tag anotada | `git tag -a v1.0.0 -m "release"` |

## 2. Instalacao e configuracao
### Backend (FastAPI + PyAEDT)
| Tarefa | Comando |
| --- | --- |
| Criar ambiente virtual | `python -m venv .venv` |
| Ativar ambiente (PowerShell) | `.\.venv\Scripts\Activate.ps1` |
| Atualizar pip | `python -m pip install --upgrade pip` |
| Instalar pacote em modo desenvolvimento | `pip install -e .` |
| Instalar dependencias extras | `pip install -r requirements.txt` |
| Instalar Redis via Docker (opcional) | `docker run -d -p 6379:6379 redis:7` |

### Frontend (Vite + React + TS)
| Tarefa | Comando |
| --- | --- |
| Instalar dependencias do projeto | `npm install` |
| Adicionar biblioteca nova | `npm install pacote` |
| Atualizar dependencias existentes | `npm update` |
| Instalar via pnpm (opcao) | `pnpm install` |

## 3. Execucao e utilitarios
### Backend
| Tarefa | Comando |
| --- | --- |
| Iniciar API FastAPI | `uvicorn app.main:app --reload --port 8000` |
| Executar servidor em producao | `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4` |
| Subir worker Celery | `celery -A app.celery_app.celery_app worker -l info -Q hfss` |
| Rodar tarefas agendadas/opcionais | `celery -A app.celery_app.celery_app beat -l info` |
| Executar testes | `pytest -q` |

### Frontend
| Tarefa | Comando |
| --- | --- |
| Rodar ambiente de desenvolvimento | `npm run dev -- --host` |
| Executar lint opcional | `npm run lint` |
| Rodar testes unitarios | `npm run test` |
| Gerar build de producao | `npm run build` |
| Servir build localmente | `npm run preview -- --host` |

### Monitoramento e servicos
| Item | Comando |
| --- | --- |
| Verificar processos do AEDT (Windows) | `Get-Process AnsysEDT*` |
| Parar sessao do AEDT manualmente | `Stop-Process -Name AnsysEDT -Force` |
| Verificar portas abertas (ver API) | `netstat -ano | findstr 8000` |
| Checar Redis ativo | `redis-cli ping` |

> Ajuste os comandos conforme o shell (PowerShell, CMD, bash) e o ambiente (Windows/Linux).
