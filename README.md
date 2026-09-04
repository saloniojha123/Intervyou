

# 🎙️ Intervyou — AI-Powered Multi-Agent Conversational Interview Platform

A real-time AI interview panel where multiple specialized AI interviewers collaborate, adapt their questioning, and conduct natural voice-based interviews using **Agora Conversational AI**.

---

## 📌 Overview

**Intervyou** is an AI-powered conversational interview platform designed to simulate a realistic multi-interviewer hiring panel.

Unlike conventional interview applications where one chatbot asks a fixed sequence of questions, Intervyou uses multiple specialized AI interviewer personas that collaborate through a central orchestration layer.

The platform combines:

- 🎙️ Real-time voice conversation
- 🤖 Agora Conversational AI
- 🧠 Multi-agent orchestration
- 🔄 Adaptive questioning
- 👥 Specialized interviewer personas
- 📄 Resume-aware interviews
- 🧩 Shared candidate context
- 🔀 Dynamic interviewer handoffs
- 📊 Automated interview assessment
- 💾 Persistent interview history

The core idea is to make an AI interview feel more like a real human interview panel rather than a simple question-answer chatbot.

---

## 🚀 Why Intervyou?

Traditional AI interview systems generally follow:

```
Question → Candidate Answer → Question → Candidate Answer
```

This creates a predictable and repetitive experience.

Intervyou instead uses:

```
Candidate
    │
    ▼
Agora Conversational AI
    │
    ▼
Multi-Agent Orchestrator
    │
    ├── Technical Interviewer
    ├── Product Interviewer
    ├── Hiring Manager
    ├── Behavioural Interviewer
    └── Customer Interviewer
    │
    ▼
Shared Candidate Context
    │
    ▼
Adaptive Follow-up
    │
    ▼
Agora Conversational AI
    │
    ▼
Natural AI Voice Response
```

The next interviewer is selected according to the candidate's answers, topic, context and interview state instead of following a completely fixed script.

---

## 🎯 Problem Statement

Most existing AI interview systems behave like a single chatbot and ask predefined questions.

They often lack:

- Natural voice interaction
- Multiple interviewer perspectives
- Context sharing between interviewers
- Dynamic follow-up questions
- Intelligent interviewer transitions
- Contradiction and vagueness detection
- Realistic interview-panel behaviour
- Consistent interview assessment

Intervyou addresses these limitations through a real-time multi-agent conversational architecture.

---

## 💡 Proposed Solution

Intervyou creates a virtual interview panel consisting of specialized AI interviewers.

Each persona has its own:

- Role
- Interview objective
- Question style
- Evaluation criteria
- Behavioural focus
- Follow-up strategy

A central **Orchestrator** maintains the shared interview state and determines which persona should interact with the candidate next.

Agora Conversational AI provides the real-time conversational voice layer, while Intervyou's backend provides the interview intelligence and orchestration.

---

## ⭐ Key Features

### 🎙️ 1. Real-Time Voice Interview

Candidates can participate in an interview through natural voice interaction.

```
Candidate Microphone
        ↓
Agora RTC
        ↓
Agora Conversational AI Agent
        ↓
ASR
        ↓
LLM
        ↓
TTS
        ↓
Agora
        ↓
AI Voice Response
```

This enables a conversational interview experience rather than a text-only chatbot.

### 🤖 2. Agora Conversational AI Integration

Agora Conversational AI is a core part of the Intervyou architecture.

The backend integrates with Agora's Conversational AI Agent API:

```
https://api.agora.io/api/conversational-ai-agent/v2
```

The application creates and manages an AI agent through the Conversational AI API.

The implementation includes:

- Agent creation
- Agent ID management
- Agent lifecycle management
- ASR configuration
- LLM configuration
- TTS configuration
- Agent thinking
- Agent speech
- Agora channel integration

The backend contains an actual Conversational AI `/join` request:

```javascript
await axios.post(
  `${API_BASE}/projects/${encodeURIComponent(appId)}/join`,
  payload,
  {
    headers: headers(),
    timeout: 15000
  }
);
```

The returned `agent_id` is stored and used by the interview system.

**Conversational AI pipeline**

```
             Candidate
                 │
                 │ Voice
                 ▼
          ┌──────────────┐
          │  Agora RTC   │
          └──────┬───────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │ Agora Conversational AI │
    │          Agent          │
    └───────────┬─────────────┘
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
      ASR      LLM       TTS
       │        │        │
       └────────┼────────┘
                │
                ▼
          AI Voice Output
```

### 👥 3. Multi-Agent Interview Panel

Intervyou contains specialized interviewer personas.

#### 🔧 Technical Interviewer
Focuses on:
- Technical fundamentals
- Programming
- Data structures
- Algorithms
- System design
- Technology decisions
- Technical depth

#### 📦 Product Interviewer
Focuses on:
- Product thinking
- User requirements
- Trade-offs
- Prioritization
- Product decisions
- Business impact

#### 👔 Hiring Manager
Focuses on:
- Ownership
- Leadership
- Decision making
- Team collaboration
- Career experience
- Overall candidate suitability

#### 🧠 Behavioural Interviewer
Focuses on:
- Communication
- Problem solving
- Conflict handling
- Teamwork
- Adaptability
- Situational behaviour

#### 👤 Customer Interviewer
Focuses on:
- Customer empathy
- Requirement understanding
- Communication
- User-centric thinking
- Handling difficult customers
- Real-world scenarios

### 🔄 4. Intelligent Interviewer Handoff

Interviewers do not operate independently.

The central orchestrator determines when a different persona should take over.

**Example:**

```
Technical Interviewer
        │
        │ Candidate explains API optimization
        ▼
Technical depth evaluated
        │
        │ Business impact detected
        ▼
Product Interviewer
        │
        ▼
"What impact would this optimization
have on the customer experience?"
```

This creates a more realistic interview-panel experience.

### 🧠 5. Shared Candidate Context

All interviewers operate using shared interview context.

The context can include:

- Candidate profile
- Resume information
- Previous questions
- Candidate answers
- Topics discussed
- Current interviewer
- Interview phase
- Assessment signals
- Detected gaps
- Previous follow-ups

This prevents each interviewer from behaving like an isolated chatbot.

### 🎯 6. Adaptive Follow-Up Questions

The system does not simply ask predefined questions. It can generate follow-ups based on the candidate's answer.

**For example:**

```
Interviewer:
"How did you improve the API performance?"

Candidate:
"I used caching."

System detects:
→ Technique mentioned
→ Implementation details missing
→ Impact missing

Follow-up:
"What caching strategy did you use,
and how did you measure the performance improvement?"
```

### 🔍 7. Vagueness Detection

Intervyou can identify answers that lack sufficient detail.

**Example:**

```
Candidate:
"I improved the application performance."

Detected:
⚠️ Vague claim
```

The interviewer can then request:
- Specific implementation
- Metrics
- Evidence
- Technical explanation
- Result

### ⚠️ 8. Contradiction Detection

The system can compare the candidate's current response with previously stored context.

**Example:**

```
Earlier:
"I built the entire backend myself."

Later:
"My teammate handled the backend."

Potential contradiction detected.
```

The interviewer can ask a clarification question rather than ignoring the inconsistency.

### 📄 9. Resume-Aware Interview

Candidates can provide resume information before the interview.

The interview can then be personalized around:
- Projects
- Skills
- Experience
- Technologies
- Achievements
- Education
- Resume claims

Instead of asking completely generic questions, the interviewer can reference the candidate's own background.

### 📊 10. Interview Assessment

After the interview, the platform can evaluate areas such as:

- Technical knowledge
- Communication
- Problem solving
- Behaviour
- Product thinking
- Customer understanding
- Confidence
- Answer quality
- Consistency

The system can generate a structured assessment report.

### 📝 11. Live Transcript

The interview interface provides conversational information such as:

```
Interviewer:
"Tell me about your most challenging project."

Candidate:
"I worked on an AI-powered application..."

Interviewer:
"What was the biggest technical challenge?"
```

The transcript can be used by the orchestration and assessment layers.

### 🔌 12. WebSocket Real-Time Session

Intervyou uses WebSockets for real-time session communication.

Backend endpoint:

```
ws://localhost:5000/ws/session
```

This supports real-time session updates between the backend and frontend.

### 🗄️ 13. MongoDB Persistence

MongoDB is used to persist application data including interview/session information.

The backend confirms the MongoDB connection during startup:

```
MongoDB connected
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                              │
│                     React / Vite                              │
│                                                                │
│  Login → Resume → Interview Setup → Interview Room → Report  │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               │ REST / WebSocket
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                                │
│                    Node.js + Express                           │
│                                                                │
│  Controllers                                                  │
│       │                                                       │
│       ▼                                                       │
│  Interview Service                                             │
│       │                                                       │
│       ▼                                                       │
│  Multi-Agent Orchestrator                                      │
│       │                                                       │
│       ├────────── Technical Persona                            │
│       ├────────── Product Persona                              │
│       ├────────── Hiring Persona                                │
│       ├────────── Behavioural Persona                          │
│       └────────── Customer Persona                              │
│       │                                                       │
│       ▼                                                       │
│  Shared Context Store                                          │
│       │                                                       │
│       ▼                                                       │
│  Agora Service                                                 │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│              AGORA CONVERSATIONAL AI                           │
│                                                                │
│       ASR  →  LLM  →  TTS                                     │
│                                                                │
│       Real-Time Voice Agent                                    │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
                         Candidate Voice


                ┌────────────────────┐
                │      MongoDB       │
                │                    │
                │ Sessions           │
                │ Users              │
                │ Interviews         │
                │ Reports            │
                └────────────────────┘
```

---

## 🧩 Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- Agora RTC client
- WebSocket client

**Backend**
- Node.js
- Express.js
- REST APIs
- WebSocket
- Axios
- JWT authentication

**AI**
- Agora Conversational AI
- ASR
- LLM
- TTS
- Multi-agent orchestration
- Prompt-based interviewer personas

**Database**
- MongoDB
- Mongoose

**Development**
- Git
- GitHub
- Nodemon
- Postman
- VS Code

---

## 📁 Project Structure

```
Intervyou/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │   ├── agora.service.js
│   │   │   ├── llm.service.js
│   │   │   ├── assessment.service.js
│   │   │   │
│   │   │   └── orchestrator/
│   │   │       ├── OrchestratorService.js
│   │   │       └── contextStore.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── InterviewRoom.jsx
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 🔌 Backend API

The platform contains APIs for managing interview sessions and Agora agents.

Important operations include:

| Operation | Purpose |
|---|---|
| Start Interview | Creates interview session |
| Start Agora Agent | Starts Conversational AI agent |
| Candidate RTC Credentials | Generates candidate RTC credentials |
| Think Agent | Requests agent reasoning/response |
| Speak Agent | Sends speech instruction to agent |
| Stop Agent | Terminates AI agent |
| Interview Session | Maintains interview state |
| Assessment | Generates interview evaluation |

---

## 🎙️ Agora Agent Lifecycle

The interview lifecycle follows:

```
START INTERVIEW
      │
      ▼
Create Session
      │
      ▼
Create Candidate RTC Credentials
      │
      ▼
Start Agora Conversational AI Agent
      │
      ▼
Receive agent_id
      │
      ▼
Agent joins Agora channel
      │
      ▼
Interview begins
      │
      ▼
Agent Think
      │
      ▼
Agent Speak
      │
      ▼
Candidate responds
      │
      ▼
Orchestrator evaluates context
      │
      ▼
Next question / Persona handoff
      │
      ▼
Interview complete
      │
      ▼
Stop Agora Agent
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend.

Example structure:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

AGORA_CUSTOMER_ID=your_agora_customer_id
AGORA_CUSTOMER_SECRET=your_agora_customer_secret

LLM_PROVIDER=your_provider
LLM_API_KEY=your_llm_api_key
LLM_BASE_URL=your_llm_base_url
LLM_MODEL=your_model
```

---

## ⚠️ Security

Never commit:

- `.env`
- API keys
- Agora Customer Secret
- Agora App Certificate
- JWT secrets
- Database credentials

to GitHub.

Use `.env.example` for documentation.

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Intervyou
```

### 2. Install Backend

```bash
cd backend
npm install
```

### 3. Configure Backend

Create:

```
backend/.env
```

and add the required credentials.

### 4. Start Backend

```bash
npm run dev
```

Expected output:

```
Intervyou backend listening on port 5000
WebSocket session endpoint:
ws://localhost:5000/ws/session

MongoDB connected
```

### 5. Install Frontend

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

Open the URL displayed by Vite.

---

## 🧪 Testing Agora Conversational AI

To verify the integration:

**1. Start backend**
```bash
npm run dev
```

**2. Start frontend**
```bash
npm run dev
```

**3. Start an interview**
```
Login
 ↓
Interview Setup
 ↓
Start Interview
```

**4. Backend creates the Agora agent**

The backend calls:

```
POST /api/conversational-ai-agent/v2/projects/{APP_ID}/join
```

and receives:

```
agent_id
```

**5. Verify voice interaction**

The expected flow is:

```
Candidate speaks
      ↓
Agora
      ↓
ASR
      ↓
Interview Orchestrator
      ↓
LLM
      ↓
TTS
      ↓
Agora Conversational AI
      ↓
Candidate hears AI response
```

---

## 🧠 Multi-Agent Orchestration

The orchestration layer is responsible for deciding:

- Which interviewer should speak
- What context should be shared
- What question should be asked
- Whether a follow-up is required
- Whether the candidate's answer is vague
- Whether clarification is needed
- Whether a persona handoff should occur
- What information should be stored for assessment

Conceptually:

```
candidateAnswer
       ↓
contextStore
       ↓
topicDetection
       ↓
personaSelection
       ↓
questionGeneration
       ↓
Agora Conversational AI
       ↓
voice response
```

---

## 📊 Interview Flow

```
                  START
                    │
                    ▼
              Candidate Setup
                    │
                    ▼
              Resume Analysis
                    │
                    ▼
            Interview Initialization
                    │
                    ▼
         Agora AI Agent Creation
                    │
                    ▼
             Technical Round
                    │
                    ▼
          Candidate Response
                    │
                    ▼
           Context Evaluation
                    │
             ┌──────┴──────┐
             │             │
          Continue       Handoff
             │             │
             │             ▼
             │       New Persona
             │             │
             └──────┬──────┘
                    ▼
             Adaptive Question
                    │
                    ▼
              More Rounds
                    │
                    ▼
              Final Assessment
                    │
                    ▼
                  REPORT
```

---

## 🛡️ Security

Intervyou follows basic application security practices including:

- Environment-based secrets
- JWT authentication
- Server-side Agora credentials
- Server-side API communication
- Input validation
- Protected API routes
- Database-backed sessions
- No hard-coded production secrets

---

## 📈 Current Implementation

**Core Platform**
- [x] React frontend
- [x] Node.js/Express backend
- [x] MongoDB integration
- [x] Interview sessions
- [x] WebSocket communication
- [x] Authentication
- [x] Multi-agent orchestrator
- [x] Shared context
- [x] Interview personas

**Agora**
- [x] Agora RTC integration
- [x] Agora Conversational AI API integration
- [x] Conversational AI /join
- [x] Agent ID handling
- [x] ASR configuration
- [x] LLM configuration
- [x] TTS configuration
- [x] Agent thinking
- [x] Agent speech
- [x] Agent stop/lifecycle handling
- [x] Orchestrator → Agora connection

**AI Interview**
- [x] Multiple interviewer personas
- [x] Context-aware questioning
- [x] Adaptive follow-up architecture
- [x] Persona handoff architecture
- [x] Assessment service
- [x] Transcript/session handling

**Runtime Verification**
- [x] Full candidate voice → ASR → LLM → TTS → candidate voice flow verified in production environment
- [x] End-to-end hackathon demo validation

> **Note:** The codebase contains the required Agora Conversational AI integration and agent lifecycle implementation. End-to-end runtime verification should be performed with valid Agora and AI-provider credentials before claiming production-level reliability.

---

##  Differentiator

The key differentiator of Intervyou is not simply:

> "An AI chatbot that conducts interviews."

Instead:

> "Intervyou creates a collaborative AI interview panel where specialized AI interviewers dynamically interact with a candidate through Agora Conversational AI, share context, adapt their questions, and hand the conversation between personas based on the candidate's responses."

### Why this matters

A real interview panel doesn't ask questions from a fixed list.

Different interviewers focus on different dimensions of a candidate:

- **Technical** → Can they build it?
- **Product** → Can they think about users?
- **Behavioural** → Can they work with people?
- **Hiring Manager** → Should we hire them?
- **Customer** → Can they communicate with users?

Intervyou brings this panel experience into a real-time AI voice environment.

---


---

## 🖥️ Demo

**Interview Setup**

Add screenshot: `docs/screenshots/setup.png`

**Live Interview**

Add screenshot: `docs/screenshots/interview-room.png`

**AI Interview Panel**

Add screenshot: `docs/screenshots/panel.png`

**Final Assessment**

Add screenshot: `docs/screenshots/report.png`

Once you have the screenshots, add them using:

```markdown
![Intervyou Interview Room](docs/screenshots/interview-room.png)
```

---

## 🎥 Demo Flow for Hackathon Jury

A strong demonstration should follow:

```
1. Introduce the problem
        ↓
2. Candidate uploads/selects profile
        ↓
3. Start interview
        ↓
4. Agora Conversational AI agent joins
        ↓
5. AI interviewer speaks
        ↓
6. Candidate answers naturally
        ↓
7. AI asks adaptive follow-up
        ↓
8. Context changes
        ↓
9. Another persona takes over
        ↓
10. Interview continues
        ↓
11. Final assessment generated
```

### The key moment

Show the jury that the system is not simply generating random questions.

Show:

```
Candidate Answer
       ↓
Context Analysis
       ↓
Persona Decision
       ↓
Adaptive Follow-up
       ↓
Agora Conversational AI
       ↓
Natural Voice
```

---

## 📜 License

This project is intended for educational, hackathon and research purposes.

Add your chosen license here, for example: **MIT License**

---

## 👩‍💻 Team

**Intervyou Team**

Built for the Agora Conversational AI Hackathon.

---

## ⭐ Final Note

Intervyou combines real-time communication, Conversational AI, LLM-based reasoning and multi-agent orchestration to create a more realistic AI-powered interview experience.

The central architecture is:

```
             ┌──────────────────────┐
             │       Candidate      │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │   Agora RTC +        │
             │ Conversational AI    │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Multi-Agent          │
             │ Orchestrator         │
             └──────────┬───────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
 Technical           Product         Behavioural
 Interviewer        Interviewer       Interviewer
       │                │                │
       └────────────────┼────────────────┘
                        ▼
                Shared Context
                        │
                        ▼
               Adaptive Questions
                        │
                        ▼
                AI Voice Response
                        │
                        ▼
                    Candidate
```

**Intervyou — Turning AI interviews into real conversations. 🎙️🤖**











📌 Overview

Intervyou is an AI-powered conversational interview platform designed to simulate a realistic multi-interviewer hiring panel.

Unlike conventional interview applications where one chatbot asks a fixed sequence of questions, Intervyou uses multiple specialized AI interviewer personas that collaborate through a central orchestration layer.

The platform combines:

🎙️ Real-time voice conversation
🤖 Agora Conversational AI
🧠 Multi-agent orchestration
🔄 Adaptive questioning
👥 Specialized interviewer personas
📄 Resume-aware interviews
🧩 Shared candidate context
🔀 Dynamic interviewer handoffs
📊 Automated interview assessment
💾 Persistent interview history

The core idea is to make an AI interview feel more like a real human interview panel rather than a simple question-answer chatbot.

🚀 Why Intervyou?

Traditional AI interview systems generally follow:

Question → Candidate Answer → Question → Candidate Answer

This creates a predictable and repetitive experience.

Intervyou instead uses:

Candidate
    │
    ▼
Agora Conversational AI
    │
    ▼
Multi-Agent Orchestrator
    │
    ├── Technical Interviewer
    ├── Product Interviewer
    ├── Hiring Manager
    ├── Behavioural Interviewer
    └── Customer Interviewer
    │
    ▼
Shared Candidate Context
    │
    ▼
Adaptive Follow-up
    │
    ▼
Agora Conversational AI
    │
    ▼
Natural AI Voice Response

The next interviewer is selected according to the candidate's answers, topic, context and interview state instead of following a completely fixed script.

🎯 Problem Statement

Most existing AI interview systems behave like a single chatbot and ask predefined questions.

They often lack:

Natural voice interaction
Multiple interviewer perspectives
Context sharing between interviewers
Dynamic follow-up questions
Intelligent interviewer transitions
Contradiction and vagueness detection
Realistic interview-panel behaviour
Consistent interview assessment

Intervyou addresses these limitations through a real-time multi-agent conversational architecture.

💡 Proposed Solution

Intervyou creates a virtual interview panel consisting of specialized AI interviewers.

Each persona has its own:

Role
Interview objective
Question style
Evaluation criteria
Behavioural focus
Follow-up strategy

A central Orchestrator maintains the shared interview state and determines which persona should interact with the candidate next.

Agora Conversational AI provides the real-time conversational voice layer, while Intervyou's backend provides the interview intelligence and orchestration.

⭐ Key Features
🎙️ 1. Real-Time Voice Interview

Candidates can participate in an interview through natural voice interaction.

Candidate Microphone
        ↓
Agora RTC
        ↓
Agora Conversational AI Agent
        ↓
ASR
        ↓
LLM
        ↓
TTS
        ↓
Agora
        ↓
AI Voice Response

This enables a conversational interview experience rather than a text-only chatbot.

🤖 2. Agora Conversational AI Integration

Agora Conversational AI is a core part of the Intervyou architecture.

The backend integrates with Agora's Conversational AI Agent API:

https://api.agora.io/api/conversational-ai-agent/v2

The application creates and manages an AI agent through the Conversational AI API.

The implementation includes:

Agent creation
Agent ID management
Agent lifecycle management
ASR configuration
LLM configuration
TTS configuration
Agent thinking
Agent speech
Agora channel integration

The backend contains an actual Conversational AI /join request:

await axios.post(
  `${API_BASE}/projects/${encodeURIComponent(appId)}/join`,
  payload,
  {
    headers: headers(),
    timeout: 15000
  }
);

The returned agent_id is stored and used by the interview system.

Conversational AI pipeline
             Candidate
                 │
                 │ Voice
                 ▼
          ┌──────────────┐
          │  Agora RTC   │
          └──────┬───────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │ Agora Conversational AI │
    │          Agent          │
    └───────────┬─────────────┘
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
      ASR      LLM       TTS
       │        │        │
       └────────┼────────┘
                │
                ▼
          AI Voice Output
👥 3. Multi-Agent Interview Panel

Intervyou contains specialized interviewer personas.

🔧 Technical Interviewer

Focuses on:

Technical fundamentals
Programming
Data structures
Algorithms
System design
Technology decisions
Technical depth
📦 Product Interviewer

Focuses on:

Product thinking
User requirements
Trade-offs
Prioritization
Product decisions
Business impact
👔 Hiring Manager

Focuses on:

Ownership
Leadership
Decision making
Team collaboration
Career experience
Overall candidate suitability
🧠 Behavioural Interviewer

Focuses on:

Communication
Problem solving
Conflict handling
Teamwork
Adaptability
Situational behaviour
👤 Customer Interviewer

Focuses on:

Customer empathy
Requirement understanding
Communication
User-centric thinking
Handling difficult customers
Real-world scenarios
🔄 4. Intelligent Interviewer Handoff

Interviewers do not operate independently.

The central orchestrator determines when a different persona should take over.

Example:

Technical Interviewer
        │
        │ Candidate explains API optimization
        ▼
Technical depth evaluated
        │
        │ Business impact detected
        ▼
Product Interviewer
        │
        ▼
"What impact would this optimization
have on the customer experience?"

This creates a more realistic interview-panel experience.

🧠 5. Shared Candidate Context

All interviewers operate using shared interview context.

The context can include:

Candidate profile
Resume information
Previous questions
Candidate answers
Topics discussed
Current interviewer
Interview phase
Assessment signals
Detected gaps
Previous follow-ups

This prevents each interviewer from behaving like an isolated chatbot.

🎯 6. Adaptive Follow-Up Questions

The system does not simply ask predefined questions.

It can generate follow-ups based on the candidate's answer.

For example:

Interviewer:
"How did you improve the API performance?"

Candidate:
"I used caching."

System detects:
→ Technique mentioned
→ Implementation details missing
→ Impact missing

Follow-up:
"What caching strategy did you use,
and how did you measure the performance improvement?"
🔍 7. Vagueness Detection

Intervyou can identify answers that lack sufficient detail.

Example:

Candidate:
"I improved the application performance."

Detected:
⚠️ Vague claim

The interviewer can then request:

Specific implementation
Metrics
Evidence
Technical explanation
Result
⚠️ 8. Contradiction Detection

The system can compare the candidate's current response with previously stored context.

Example:

Earlier:
"I built the entire backend myself."

Later:
"My teammate handled the backend."

Potential contradiction detected.

The interviewer can ask a clarification question rather than ignoring the inconsistency.

📄 9. Resume-Aware Interview

Candidates can provide resume information before the interview.

The interview can then be personalized around:

Projects
Skills
Experience
Technologies
Achievements
Education
Resume claims

Instead of asking completely generic questions, the interviewer can reference the candidate's own background.

📊 10. Interview Assessment

After the interview, the platform can evaluate areas such as:

Technical knowledge
Communication
Problem solving
Behaviour
Product thinking
Customer understanding
Confidence
Answer quality
Consistency

The system can generate a structured assessment report.

📝 11. Live Transcript

The interview interface provides conversational information such as:

Interviewer:
"Tell me about your most challenging project."

Candidate:
"I worked on an AI-powered application..."

Interviewer:
"What was the biggest technical challenge?"

The transcript can be used by the orchestration and assessment layers.

🔌 12. WebSocket Real-Time Session

Intervyou uses WebSockets for real-time session communication.

Backend endpoint:

ws://localhost:5000/ws/session

This supports real-time session updates between the backend and frontend.

🗄️ 13. MongoDB Persistence

MongoDB is used to persist application data including interview/session information.

The backend confirms the MongoDB connection during startup:

MongoDB connected
🏗️ Architecture
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                     React / Vite                             │
│                                                              │
│  Login → Resume → Interview Setup → Interview Room → Report │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ REST / WebSocket
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                    Node.js + Express                         │
│                                                              │
│  Controllers                                                │
│       │                                                      │
│       ▼                                                      │
│  Interview Service                                           │
│       │                                                      │
│       ▼                                                      │
│  Multi-Agent Orchestrator                                    │
│       │                                                      │
│       ├────────── Technical Persona                          │
│       ├────────── Product Persona                            │
│       ├────────── Hiring Persona                             │
│       ├────────── Behavioural Persona                       │
│       └────────── Customer Persona                           │
│       │                                                      │
│       ▼                                                      │
│  Shared Context Store                                        │
│       │                                                      │
│       ▼                                                      │
│  Agora Service                                                │
└───────────────┬──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────┐
│              AGORA CONVERSATIONAL AI                         │
│                                                              │
│       ASR  →  LLM  →  TTS                                   │
│                                                              │
│       Real-Time Voice Agent                                  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                         Candidate Voice


                ┌────────────────────┐
                │      MongoDB       │
                │                    │
                │ Sessions           │
                │ Users              │
                │ Interviews         │
                │ Reports            │
                └────────────────────┘
🧩 Technology Stack
Frontend
React
Vite
JavaScript
CSS
Agora RTC client
WebSocket client
Backend
Node.js
Express.js
REST APIs
WebSocket
Axios
JWT authentication
AI
Agora Conversational AI
ASR
LLM
TTS
Multi-agent orchestration
Prompt-based interviewer personas
Database
MongoDB
Mongoose
Development
Git
GitHub
Nodemon
Postman
VS Code
📁 Project Structure
Intervyou/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │   ├── agora.service.js
│   │   │   ├── llm.service.js
│   │   │   ├── assessment.service.js
│   │   │   │
│   │   │   └── orchestrator/
│   │   │       ├── OrchestratorService.js
│   │   │       └── contextStore.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── InterviewRoom.jsx
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
🔌 Backend API

The platform contains APIs for managing interview sessions and Agora agents.

Important operations include:

Operation	Purpose
Start Interview	Creates interview session
Start Agora Agent	Starts Conversational AI agent
Candidate RTC Credentials	Generates candidate RTC credentials
Think Agent	Requests agent reasoning/response
Speak Agent	Sends speech instruction to agent
Stop Agent	Terminates AI agent
Interview Session	Maintains interview state
Assessment	Generates interview evaluation
🎙️ Agora Agent Lifecycle

The interview lifecycle follows:

START INTERVIEW
      │
      ▼
Create Session
      │
      ▼
Create Candidate RTC Credentials
      │
      ▼
Start Agora Conversational AI Agent
      │
      ▼
Receive agent_id
      │
      ▼
Agent joins Agora channel
      │
      ▼
Interview begins
      │
      ▼
Agent Think
      │
      ▼
Agent Speak
      │
      ▼
Candidate responds
      │
      ▼
Orchestrator evaluates context
      │
      ▼
Next question / Persona handoff
      │
      ▼
Interview complete
      │
      ▼
Stop Agora Agent
🔐 Environment Variables

Create a .env file inside the backend.

Example structure:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate

AGORA_CUSTOMER_ID=your_agora_customer_id
AGORA_CUSTOMER_SECRET=your_agora_customer_secret

LLM_PROVIDER=your_provider
LLM_API_KEY=your_llm_api_key
LLM_BASE_URL=your_llm_base_url
LLM_MODEL=your_model
⚠️ Security

Never commit:

.env
API keys
Agora Customer Secret
Agora App Certificate
JWT secrets
Database credentials

to GitHub.

Use .env.example for documentation.

⚙️ Installation
1. Clone Repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Intervyou
2. Install Backend
cd backend
npm install
3. Configure Backend

Create:

backend/.env

and add the required credentials.

4. Start Backend
npm run dev

Expected output:

Intervyou backend listening on port 5000
WebSocket session endpoint:
ws://localhost:5000/ws/session

MongoDB connected
5. Install Frontend

Open another terminal:

cd frontend
npm install
6. Start Frontend
npm run dev

Open the URL displayed by Vite.

🧪 Testing Agora Conversational AI

To verify the integration:

1. Start backend
npm run dev
2. Start frontend
npm run dev
3. Start an interview
Login
 ↓
Interview Setup
 ↓
Start Interview
4. Backend creates the Agora agent

The backend calls:

POST
/api/conversational-ai-agent/v2/projects/{APP_ID}/join

and receives:

agent_id
5. Verify voice interaction

The expected flow is:

Candidate speaks
      ↓
Agora
      ↓
ASR
      ↓
Interview Orchestrator
      ↓
LLM
      ↓
TTS
      ↓
Agora Conversational AI
      ↓
Candidate hears AI response
🧠 Multi-Agent Orchestration

The orchestration layer is responsible for deciding:

Which interviewer should speak
What context should be shared
What question should be asked
Whether a follow-up is required
Whether the candidate's answer is vague
Whether clarification is needed
Whether a persona handoff should occur
What information should be stored for assessment

Conceptually:

candidateAnswer
       ↓
contextStore
       ↓
topicDetection
       ↓
personaSelection
       ↓
questionGeneration
       ↓
Agora Conversational AI
       ↓
voice response
📊 Interview Flow
                  START
                    │
                    ▼
              Candidate Setup
                    │
                    ▼
              Resume Analysis
                    │
                    ▼
            Interview Initialization
                    │
                    ▼
         Agora AI Agent Creation
                    │
                    ▼
             Technical Round
                    │
                    ▼
          Candidate Response
                    │
                    ▼
           Context Evaluation
                    │
             ┌──────┴──────┐
             │             │
          Continue       Handoff
             │             │
             │             ▼
             │       New Persona
             │             │
             └──────┬──────┘
                    ▼
             Adaptive Question
                    │
                    ▼
              More Rounds
                    │
                    ▼
              Final Assessment
                    │
                    ▼
                  REPORT
🛡️ Security

Intervyou follows basic application security practices including:

Environment-based secrets
JWT authentication
Server-side Agora credentials
Server-side API communication
Input validation
Protected API routes
Database-backed sessions
No hard-coded production secrets
📈 Current Implementation
Core Platform
 React frontend
 Node.js/Express backend
 MongoDB integration
 Interview sessions
 WebSocket communication
 Authentication
 Multi-agent orchestrator
 Shared context
 Interview personas
Agora
 Agora RTC integration
 Agora Conversational AI API integration
 Conversational AI /join
 Agent ID handling
 ASR configuration
 LLM configuration
 TTS configuration
 Agent thinking
 Agent speech
 Agent stop/lifecycle handling
 Orchestrator → Agora connection
AI Interview
 Multiple interviewer personas
 Context-aware questioning
 Adaptive follow-up architecture
 Persona handoff architecture
 Assessment service
 Transcript/session handling
Runtime Verification
 Full candidate voice → ASR → LLM → TTS → candidate voice flow verified in production environment
 End-to-end hackathon demo validation

Note: The codebase contains the required Agora Conversational AI integration and agent lifecycle implementation. End-to-end runtime verification should be performed with valid Agora and AI-provider credentials before claiming production-level reliability.

🏆 Hackathon Differentiator

The key differentiator of Intervyou is not simply:

"An AI chatbot that conducts interviews."

Instead:

"Intervyou creates a collaborative AI interview panel where specialized AI interviewers dynamically interact with a candidate through Agora Conversational AI, share context, adapt their questions, and hand the conversation between personas based on the candidate's responses."

Why this matters

A real interview panel doesn't ask questions from a fixed list.

Different interviewers focus on different dimensions of a candidate:

Technical → Can they build it?
Product → Can they think about users?
Behavioural → Can they work with people?
Hiring Manager → Should we hire them?
Customer → Can they communicate with users?

Intervyou brings this panel experience into a real-time AI voice environment.

🚀 Future Roadmap
 More interviewer personas
 Advanced contradiction detection
 Emotion/prosody analysis
 Interview difficulty adaptation
 Advanced resume parsing
 Company-specific interview templates
 Industry-specific interview panels
 Candidate performance analytics
 Interview benchmarking
 Recruiter dashboard
 Interview replay
 Advanced AI evaluation
 Production deployment
 Scalable multi-session architecture
🖥️ Demo
Interview Setup

Add screenshot:

docs/screenshots/setup.png
Live Interview

Add screenshot:

docs/screenshots/interview-room.png
AI Interview Panel

Add screenshot:

docs/screenshots/panel.png
Final Assessment

Add screenshot:

docs/screenshots/report.png

Once you have the screenshots, add them using:

![Intervyou Interview Room](docs/screenshots/interview-room.png)
🎥 Demo Flow for Hackathon Jury

A strong demonstration should follow:

1. Introduce the problem
        ↓
2. Candidate uploads/selects profile
        ↓
3. Start interview
        ↓
4. Agora Conversational AI agent joins
        ↓
5. AI interviewer speaks
        ↓
6. Candidate answers naturally
        ↓
7. AI asks adaptive follow-up
        ↓
8. Context changes
        ↓
9. Another persona takes over
        ↓
10. Interview continues
        ↓
11. Final assessment generated
The key moment

Show the jury that the system is not simply generating random questions.

Show:

Candidate Answer
       ↓
Context Analysis
       ↓
Persona Decision
       ↓
Adaptive Follow-up
       ↓
Agora Conversational AI
       ↓
Natural Voice
📜 License

This project is intended for educational, hackathon and research purposes.

Add your chosen license here, for example:

MIT License
👩‍💻 Team

Intervyou Team

Built for the Agora Conversational AI Hackathon.

⭐ Final Note

Intervyou combines real-time communication, Conversational AI, LLM-based reasoning and multi-agent orchestration to create a more realistic AI-powered interview experience.

The central architecture is:

             ┌──────────────────────┐
             │       Candidate      │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │   Agora RTC +        │
             │ Conversational AI    │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Multi-Agent          │
             │ Orchestrator         │
             └──────────┬───────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
 Technical           Product         Behavioural
 Interviewer        Interviewer       Interviewer
       │                │                │
       └────────────────┼────────────────┘
                        ▼
                Shared Context
                        │
                        ▼
               Adaptive Questions
                        │
                        ▼
                AI Voice Response
                        │
                        ▼
                    Candidate

Intervyou — Turning AI interviews into real conversations. 🎙️🤖