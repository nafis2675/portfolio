class InteractiveTerminal {
  constructor() {
    this.history = document.getElementById('terminal-history');
    this.input = document.getElementById('terminal-input');
    if (!this.history || !this.input) return;

    this.commands = {
      help: () => this.lines([
        ['Commands: help, about, skills, projects, experience, languages, contact, github, linkedin, date, clear',
         'コマンド: help, about, skills, projects, experience, languages, contact, github, linkedin, date, clear']
      ]),
      about: () => this.lines([
        ['Nafis Iqbal · Generative AI Engineer · Tokyo, Japan', 'ナフィス・イクバル · 生成AIエンジニア · 東京'],
        ['Two years building agentic RAG, LLM recommendation, and evaluation systems in Japan.', '日本で2年間、RAGエージェント、LLM推薦システム、評価基盤を開発しています。'],
        ['Five client-facing AI projects delivered end to end for a healthcare SaaS platform.', '医療SaaS向けに5件の顧客向けAIプロジェクトを一貫して担当しました。'],
        ['A software QA background is why evaluation and guardrails come first.', 'ソフトウェアQAの経験から、評価とガードレールを最優先に考えています。']
      ]),
      skills: () => this.lines([
        ['GenAI: OpenAI Agents SDK, Realtime API, Gemini, local LLMs, LLM-as-a-Judge, guardrails', '生成AI: OpenAI Agents SDK、Realtime API、Gemini、ローカルLLM、LLM-as-a-Judge、ガードレール'],
        ['RAG: Agentic RAG, hybrid search (dense + BM25), RRF, FAISS, ChromaDB, Text-to-SQL', 'RAG: RAGエージェント、ハイブリッド検索（ベクトル + BM25）、RRF、FAISS、ChromaDB、Text-to-SQL'],
        ['ML: PyTorch, TensorFlow, OpenCV, YOLO 11, collaborative filtering, sequence models', 'ML: PyTorch、TensorFlow、OpenCV、YOLO 11、協調フィルタリング、系列モデル'],
        ['Engineering: Python, FastAPI, SQL, JavaScript, Docker, AWS, n8n, Twilio', '開発: Python、FastAPI、SQL、JavaScript、Docker、AWS、n8n、Twilio'],
        ['QA: LLM evaluation pipelines, Selenium, JMeter, Postman, load and penetration testing', 'QA: LLM評価パイプライン、Selenium、JMeter、Postman、負荷・侵入テスト']
      ]),
      projects: () => this.lines([
        ['Client work: agentic RAG clinic assistant, voice AI evaluation, LLM recommendations,', '顧客向け: RAGエージェント型アシスタント、音声AI評価、LLM推薦、'],
        ['appointment recommendations, product master AI auto-fill.', '予約推薦、商品マスタのAI自動入力。'],
        ['Internal: bilingual RAG chatbot over 450+ pages, YOLO 11 detection, PDF reconciliation.', '社内: 450ページ超の日英RAGチャットボット、YOLO 11検出、PDF照合ツール。'],
        ['See projects.html for details and public code links.', '詳細と公開コードは projects.html をご覧ください。']
      ]),
      experience: () => this.lines([
        ['2024-10 — now  Generative AI Engineer, SY System Co., Ltd. · Tokyo', '2024年10月〜現在  生成AIエンジニア、株式会社エスワイシステム · 東京'],
        ['2023-12 — 2024-10  SQA Freelancer, Tester Work', '2023年12月〜2024年10月  SQAフリーランサー、Tester Work'],
        ['2023-05 — 2024-10  Game Tester (contract), CrusherslabQA', '2023年5月〜2024年10月  ゲームテスター（契約）、CrusherslabQA'],
        ['2022-10 — 2023-05  Manual SQA Engineer (intern), Scientistx Technology', '2022年10月〜2023年5月  マニュアルSQAエンジニア（インターン）、Scientistx Technology']
      ]),
      languages: () => this.lines([
        ['Bengali   native', 'ベンガル語   母語'],
        ['English   fluent, professional working proficiency', '英語   流暢（ビジネスレベル）'],
        ['Japanese  basic, around JLPT N5 — used daily at work, studying for N3', '日本語   基礎レベル（JLPT N5程度）— 業務で日常的に使用、N3を勉強中'],
        ['Hindi / Urdu  conversational', 'ヒンディー語・ウルドゥー語   日常会話レベル']
      ]),
      contact: () => this.lines([
        'Email: nafisiqbalvw@gmail.com',
        'GitHub: https://github.com/nafis2675',
        'LinkedIn: https://www.linkedin.com/in/nafis-iqbal-12186622a/'
      ]),
      github: () => window.open('https://github.com/nafis2675', '_blank', 'noopener,noreferrer'),
      linkedin: () => window.open('https://www.linkedin.com/in/nafis-iqbal-12186622a/', '_blank', 'noopener,noreferrer'),
      date: () => this.line(new Date().toString()),
      clear: () => { this.history.textContent = ''; }
    };

    this.input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      const value = this.input.value.trim();
      this.input.value = '';
      this.line('visitor@portfolio:~$ ' + value, 'terminal-line');
      if (!value) return;
      const command = value.split(/\s+/)[0].toLowerCase();
      if (Object.prototype.hasOwnProperty.call(this.commands, command)) {
        this.commands[command]();
      } else {
        this.line(['Command not found. Type help for available commands.', 'コマンドが見つかりません。help を入力してください。'], 'error');
      }
    });

    document.addEventListener('languageChanged', () => {
      this.history.textContent = '';
      this.welcome();
    });
    this.welcome();
  }

  welcome() {
    this.lines([
      ['Welcome to Nafis Iqbal’s portfolio terminal.', 'ナフィス・イクバルのポートフォリオへようこそ。'],
      ['Type help for available commands.', '利用できるコマンドは help を入力してください。']
    ]);
  }

  line(value, className = 'output-line') {
    const item = document.createElement('div');
    item.className = className;
    item.textContent = Array.isArray(value)
      ? value[document.documentElement.lang === 'ja' ? 1 : 0]
      : value;
    this.history.appendChild(item);
    this.history.scrollTop = this.history.scrollHeight;
  }

  lines(values) {
    values.forEach(value => this.line(value));
  }
}

document.addEventListener('DOMContentLoaded', () => new InteractiveTerminal());
