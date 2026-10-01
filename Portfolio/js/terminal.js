class InteractiveTerminal {
  constructor() {
    this.history = document.getElementById('terminal-history');
    this.input = document.getElementById('terminal-input');
    if (!this.history || !this.input) return;

    this.commands = {
      help: () => this.lines([
        ['Commands: help, about, skills, projects, contact, github, linkedin, date, clear',
         'コマンド: help, about, skills, projects, contact, github, linkedin, date, clear']
      ]),
      about: () => this.lines([
        ['Nafis Iqbal · Generative AI Engineer · Tokyo, Japan', 'ナフィス・イクバル · 生成AIエンジニア · 東京'],
        ['I build agentic RAG, recommendation, and LLM evaluation systems.', 'RAGエージェント、推薦システム、LLM評価システムを開発しています。'],
        ['My earlier software QA work informs how I test reliability.', 'ソフトウェアQAの経験を信頼性の検証に生かしています。']
      ]),
      skills: () => this.lines([
        ['AI: Agentic RAG, LLM evaluation, hybrid retrieval, recommendations', 'AI: RAGエージェント、LLM評価、ハイブリッド検索、推薦'],
        ['Engineering: Python, FastAPI, SQL, JavaScript, Docker', '開発: Python、FastAPI、SQL、JavaScript、Docker'],
        ['QA: Functional testing, Selenium, JMeter, Postman', 'QA: 機能テスト、Selenium、JMeter、Postman']
      ]),
      projects: () => this.lines([
        ['Selected work: agentic RAG, voice AI evaluation, recommendations, data-entry agents.', '主な実績: RAGエージェント、音声AI評価、推薦、データ入力支援エージェント。'],
        ['See projects.html for details and public code links.', '詳細と公開コードは projects.html をご覧ください。']
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
