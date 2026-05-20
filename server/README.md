# StudyPulse Backend - Phase 1

## Setup
1. Open terminal in `server/`
2. Install dependencies:
   - `npm install`
3. Create a `.env` file manually using `env.example.txt`
4. Run the server:
   - `npm run dev`

## Required Environment Variables
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/studypulse`
- `JWT_SECRET=your_jwt_secret`
- `CLIENT_URL=http://localhost:3000`

## API Base URL
- `http://localhost:5000/api`

## Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Tasks
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/today`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Timetable
- `POST /api/timetable`
- `GET /api/timetable`
- `PUT /api/timetable/:id`
- `DELETE /api/timetable/:id`

### Analytics
- `GET /api/analytics/dashboard`
- `POST /api/analytics/report`
- `GET /api/analytics/reports`

### Notifications
- `POST /api/notifications`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

## Notes
- All protected routes require `Authorization: Bearer <token>`
- Passwords are hashed using bcrypt
- Validation is handled using Zod
- Analytics currently use rule-based insight generation
