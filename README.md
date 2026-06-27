# ManoCare – Medication Reassurance System for Senior Citizens

A full-stack web application designed to help senior citizens manage daily medications by combining medication reminders with intake confirmation and reassurance. The system aims to reduce medication anxiety, prevent missed or duplicate doses, and provide caregivers with a simple way to manage medication schedules.

---

## Problem Statement

Many senior citizens take multiple medications every day. While reminder applications notify users when to take medicines, they do not answer an important question:

**"Did I already take my medicine?"**

This uncertainty often causes anxiety and may result in missed medications or accidental double dosing.

ManoCare addresses this problem by providing medication reminders, intake confirmation, and medication history in a simple, senior-friendly interface.

---

## Key Features

- Medication scheduling
- Daily medication dashboard
- Medication intake confirmation
- "Did I Take It?" reassurance feature
- Medication history tracking
- Caregiver medicine management
- Accessible and senior-friendly user interface
- Voice assistance support
- Bilingual support (English & Telugu)

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- React Hook Form
- Zod
- Wouter

### Backend

- Node.js
- Express.js
- TypeScript
- Drizzle ORM

### Development Tools

- pnpm Workspace
- Git
- GitHub
- Replit

---

## Architecture

```
                 Caregiver
                     │
                     ▼
           Manage Medication Schedule
                     │
                     ▼
         React + TypeScript Frontend
                     │
              REST API Requests
                     │
                     ▼
        Express.js Backend (TypeScript)
                     │
                 Drizzle ORM
                     │
                     ▼
                  Database
```

---

## Workflow

1. Caregiver adds medication details.
2. Medication information is stored in the database.
3. Dashboard displays scheduled medicines.
4. User confirms medicine intake.
5. Intake history is recorded.
6. User can verify medication status using the reassurance feature.
7. Medication history is available for future reference.

---

## Folder Structure

```
workspace/
├── artifacts/
│   ├── manocare/        # React frontend
│   └── api-server/      # Express backend
├── lib/
├── scripts/
├── package.json
└── README.md
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/AishwaryaKanchu/manocare.git
```

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

---

## Future Improvements

- User authentication
- Push notifications
- Smart pill-box integration
- Mobile application
- Cloud deployment
- AI-powered medication assistance
- Healthcare provider integration

---

## Learning Outcomes

This project helped strengthen my understanding of:

- Full-stack application development
- Component-based UI development with React
- Type-safe development using TypeScript
- REST API design using Express.js
- ORM-based database interaction
- Form validation and state management
- User-centered software design
- Frontend and backend integration

---

## Author

**Aishwarya Kanchu**

GitHub: https://github.com/AishwaryaKanchu

---

## License

Developed for academic and educational purposes.
