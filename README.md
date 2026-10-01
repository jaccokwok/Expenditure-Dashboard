# Expenditure Dashboard

An interactive, full-stack personal finance and expense tracking application built to process raw transaction data and deliver real-time visual analytics. Constructed with Next.js, Tailwind CSS, shadcn/ui, PapaParse, and Recharts, and fully containerized via Docker for seamless parity between development and production runtimes.

---

## Features

* **CSV Data Ingestion:** Parse, validate, and structure transaction logs client-side using PapaParse.
* **Interactive Data Visualization:** View spending category breakdowns, distribution pie charts, and categorical summaries with Recharts.
* **Modern UI & Components:** Built with Tailwind CSS and shadcn/ui for an accessible, responsive dashboard interface.
* **TypeScript Integration:** Strict typing across dataset utilities, components, and charting props.
* **Containerized Architecture:** Uses Next.js standalone output (`output: "standalone"`) with Docker and Docker Compose to enforce 1:1 parity between local development (WSL/Ubuntu) and production builds.

---

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
* **Data Parsing:** [PapaParse](https://www.papaparse.com/)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:
* **Node.js** (v18.x or higher) and **npm**
* **Git**
* **Docker Desktop** (if running containerized)

---

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-GITHUB-USERNAME/expenditure-dashboard.git
   cd expenditure-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser. Live changes will hot-reload automatically.

---

### Docker Setup

To build and run the application in a production-identical containerized environment:

1. **Build and start the container in detached mode:**
   ```bash
   docker compose up --build -d
   ```

2. **Access the containerized app:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Stop the container:**
   ```bash
   docker compose down
   ```

---

## Project Structure

```text
expenditure-dashboard/
├── app/                  # Next.js App Router (pages, layouts, global styles)
├── components/           # Reusable UI components & shadcn primitives
├── lib/                  # Helper utilities and CSV parsing logic
├── public/               # Static assets
├── Dockerfile            # Multi-stage production Docker build definition
├── docker-compose.yml    # Container runtime service configuration
├── next.config.mjs       # Next.js configuration (configured with output: "standalone")
├── package.json          # Dependency manifest and scripts
└── README.md             # Project documentation
```

---

## Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `localhost:3000` with hot-reloading. |
| `npm run build` | Compiles and optimizes the Next.js application for production. |
| `npm run start` | Runs the compiled production build locally. |
| `npm run lint` | Runs ESLint checks across project files. |