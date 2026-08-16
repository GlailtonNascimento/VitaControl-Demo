# VitaControl – Documentação do Projeto

**Versão:** 1.0.0-rc.2  
**Data:** 16 de agosto de 2026  
**Desenvolvedor:** Glailton Nascimento  
**Repositório:** https://github.com/GlailtonNascimento/VitaControl-Demo  

---

## 📌 Resumo do Projeto

O **VitaControl** é um sistema de acompanhamento de pressão arterial e gerenciamento de medicamentos, desenvolvido para auxiliar pacientes hipertensos e diabéticos no controle diário de sua saúde. O sistema oferece:

- Cadastro seguro com nome, e-mail e senha.
- Login com autenticação JWT.
- Recuperação de senha por e-mail (código de 6 dígitos via SendGrid).
- Registro de medições de pressão (sistólica, diastólica, pulsação, contexto).
- Dashboard com classificação visual (Normal, Pré-hipertensão, Hipertensão).
- Gráficos semanais, mensais e anuais.
- (Em breve) Controle de medicamentos, alertas contextuais e relatórios.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Backend | Java 21, Spring Boot 3.2.5, Maven, JPA/Hibernate, PostgreSQL |
| Frontend | Angular 16, TypeScript, Chart.js, HTML/CSS |
| Autenticação | JWT + Spring Security |
| Envio de e-mail | SendGrid API |
| Ambiente de desenvolvimento | Termux (Android) |
| Versionamento | Git + GitHub |

---

## 📁 Estrutura de Diretórios

```

VitaControl-Demo/
├── backend/
│   ├── src/main/java/com/vitacontrol/demo/
│   │   ├── controller/         # Controllers (MedicaoController, etc.)
│   │   ├── model/              # Entidades (Usuario, CodigoRecuperacao, MedicaoPressao)
│   │   ├── repository/         # Repositórios JPA
│   │   ├── security/           # Configurações de segurança, JWT, AuthController
│   │   ├── service/            # Serviços (EmailService)
│   │   └── VitaControlDemoApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── ...
│   └── pom.xml
├── frontend/
│   ├── src/app/
│   │   ├── core/services/      # AuthService, MedicaoService
│   │   ├── features/
│   │   │   ├── auth/           # Login, Registrar, Recuperar-senha
│   │   │   ├── dashboard/      # DashboardComponent
│   │   │   ├── medicoes/       # MedicoesComponent
│   │   │   └── grafico/        # GraficoComponent (Chart.js)
│   │   ├── app.routes.ts
│   │   └── ...
│   ├── angular.json
│   └── package.json
└── README.md

```

---

## ✅ Funcionalidades Concluídas (≈ 80% do projeto)

| Funcionalidade | Status | Detalhe |
|----------------|--------|---------|
| Cadastro de usuário | ✅ 100% | Com nome, e-mail e senha (mínimo 6 caracteres). |
| Login com JWT | ✅ 100% | Token salvo no localStorage e redirecionamento para dashboard. |
| Recuperação de senha | ✅ 100% | Código de 6 dígitos enviado por e-mail (SendGrid). |
| CRUD de medições | ✅ 100% | Inserir, listar, dashboard com médias e status. |
| Dashboard visual | ✅ 100% | Cores, ícones e mensagens personalizadas (Normal, Pré-hipertensão, Hipertensão). |
| Gráficos | ✅ 100% | Semanal, mensal e anual com Chart.js. |
| Interface limpa | ✅ 100% | Sem alerts de depuração, botões espaçados. |
| Fuso horário | ✅ 100% | Corrigido para Brasília (UTC-3). |
| Token JWT fixo | ✅ 100% | Chave secreta definida no `application.properties`. |
| Versionamento | ✅ 100% | Código sincronizado e documentado no GitHub. |

---

## ⏳ Pendências (≈ 20% restante)

| Funcionalidade | Prioridade | Descrição |
|----------------|------------|-----------|
| Controle de Medicamentos | Alta | CRUD (nome, dosagem, horário, frequência) + histórico de tomada. |
| Alertas Contextuais | Alta | Dicas pós-medição (hidratação, descanso, postura) e alerta de horário de medicamento. |
| Relatórios e Filtros | Média | Filtrar medições por dia/mês/ano e opção de imprimir/exportar. |

---

## 📊 Progresso Geral

- **80% do projeto concluído**
- Faltam principalmente os módulos de **medicamentos**, **alertas** e **relatórios** para atingir 100%.

---

## 🚀 Próximos Passos

1. Implementar **CRUD de medicamentos** (backend + frontend).
2. Integrar **alertas contextuais** com medições e medicamentos.
3. Criar **tela de relatórios** com filtros e impressão.

---

## 🧪 Como Rodar o Projeto (para testes locais)

### Pré-requisitos
- Java 21, Maven, Node.js 18+, PostgreSQL (ou banco na nuvem).

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/vitacontrol-demo-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url="jdbc:postgresql://..." \
  --spring.datasource.username="..." \
  --spring.datasource.password="..."
```

Frontend

```bash
cd frontend
npm install
npx ng serve --host 0.0.0.0
```

Acesso

· Frontend: http://localhost:4200
· API: http://localhost:8080/api

---

📝 Histórico de Commits (Principais)

Data Commit Descrição
11/08 3d274fa Ajustes visuais e correções no cadastro/login
14/08 6eafe1b Recuperação de senha com SendGrid + ajustes finos
14/08 8dd8cd7 Dashboard com classificação visual de pressão
15/08 b3de655 Atualização da documentação
16/08 a047224 Ajustes finos no dashboard, gráficos, remoção de alerts

---

📌 Observações Finais

· O sistema está estável e pronto para uso em ambiente de teste.
· A documentação será atualizada conforme novas funcionalidades forem adicionadas.
· Qualquer dúvida, consulte o repositório ou entre em contato com o desenvolvedor.

---

Última atualização: 16 de agosto de 2026

```

---

### 🔧 **Como aplicar:**

1. **Abra o arquivo:**
   ```bash
   nano ~/VitaControl-Demo/VitaControl-Documentacao.md
```

2. Apague todo o conteúdo e cole o texto acima.
3. Salve (Ctrl+O, Enter) e saia (Ctrl+X).
4. Commit e push:
   ```bash
   cd ~/VitaControl-Demo
   git add VitaControl-Documentacao.md
   git commit -m "Atualiza documentação completa (16/08/2026)"
   git push origin main
   ```

---

Pronto! A documentação completa está no GitHub. 🚀
