# DHIS2 Event Program – React Integration

## Overview

This project demonstrates a standalone React application that dynamically renders
a DHIS2 Event Program form using the DHIS2 REST API and submits event data back to DHIS2 Event Program.

## Prerequisites

- Docker & Docker Compose (for DHIS2)
- Node.js (v18+)
- Bootstrap (v5.3.8)
- Git

## DHIS2 Setup

1. Start DHIS2 using Docker
2. Login at http://localhost:8080
3. Create an Event Program with:
   - Name (TEXT)
   - Age (NUMBER)
   - Symptoms (YES/NO)
     - Headache (checkbox)
     - Fever (checkbox)
     - Cough (checkbox)

## React Application Setup

```bash
cd DHIS2-React
npm install
npm i bootstrap@5.3.8
npm run dev
```
