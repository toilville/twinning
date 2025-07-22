
# Getting Started Guide – Phase 0.5 Toolkit

This guide outlines how to deploy the **Phase 0.5 Toolkit** on a fresh macOS or VPS environment (e.g., Ubuntu on InMotion VPS or similar).

---

## 1. **Prepare Your Environment**
- **Mac mini (macOS):**
  - Install [Homebrew](https://brew.sh/).
  - Install Docker Desktop (`brew install --cask docker`).
  - Install Python 3.11+ (`brew install python`).
  - Install Git (`brew install git`).

- **VPS (Ubuntu/Debian):**
  - Update packages: `sudo apt update && sudo apt upgrade`.
  - Install Docker & Compose:
    ```bash
    curl -fsSL https://get.docker.com | sh
    sudo apt install docker-compose
    ```
  - Install Python 3: `sudo apt install python3-pip python3-venv`.

---

## 2. **Clone and Unpack the Toolkit**
```bash
git clone https://github.com/your-org/phase0.5-toolkit.git
cd phase0.5-toolkit
```
(or download the ZIP and extract it).

---

## 3. **Set Up Core Services**
- **Nextcloud:**  
  Deploy via Docker Compose:
  ```bash
  docker run -d     --name nextcloud     -p 8080:80     -v nextcloud:/var/www/html     nextcloud
  ```
- **Prometheus & Grafana:**  
  Use `docker-compose.yml` (create one with official images).
  - Prometheus on `:9090`.
  - Grafana on `:3000` (default admin: admin/admin).

---

## 4. **Configure Data Pipelines**
- Install Python dependencies:
  ```bash
  pip install pandas requests
  ```
- Test the **extended_merge_metrics.py** script to merge sample CSV logs.
- Connect **Apple Health data**:
  - Use Health Auto Export (iOS) to push data to Nextcloud or your server.
  - Import exported CSV/JSON into Prometheus or InfluxDB.

---

## 5. **Finance & Creative Integrations**
- Deploy **Firefly III** (finance):
  ```bash
  docker run -d     --name firefly     -p 8081:8080     fireflyiii/core:latest
  ```
- Set up directories for creative logs (writing, music, video exports).
- Update **nutrition_log.csv** daily or via automation.

---

## 6. **Voice Journaling Setup**
- Install [OpenAI Whisper](https://github.com/openai/whisper):
  ```bash
  pip install git+https://github.com/openai/whisper.git
  ```
- Create a "Voice Notes" folder in Nextcloud.
- Configure the transcription pipeline (see voice logging docs).

---

## 7. **AI Integration (Local LLMs)**
- Install [Ollama](https://ollama.ai/) or llama.cpp for running local models.
- Test summarization prompts on merged daily metrics.

---

## 8. **Dashboards & Analytics**
- Log into Grafana (`http://localhost:3000`) and import the sample dashboards from **NUTRITION_GRAFANA_DESIGN.md**.
- Add panels for health, creative, and financial KPIs.

---

## 9. **Daily Workflow**
- Follow the **30_DAY_DAILY_CHECKLIST.md** to track implementation.
- Import **NOTION_CHECKLIST_TEMPLATE.csv** into Notion or Logseq.

---

## 10. **Security & Backups**
- Enable HTTPS with Let's Encrypt for public-facing services.
- Schedule Docker volume backups (Nextcloud, Grafana, databases).
- Set up a backup strategy (local + encrypted cloud backup).

---

# Additional Guides
We recommend adding:
- **LLM Integration Guide:** Setting up custom AI queries for Grafana panels.
- **Creative Workflow Automation Guide:** How to auto-log Ableton/DaVinci renders.
- **Health Data ETL Guide:** Detailed steps for Apple Health/Glucose/Thyroid ingestion.
- **Website Migration Guide:** WordPress to Ghost or Hugo static site steps.
- **Voice Journal to Insights Guide:** Connecting Whisper logs to LLM summaries.

