# DevEvents - NextJS16

A full-stack web application built while following the **Next.js 16 Full Course** by **JavaScript Mastery**.  
The codebase is **not fully identical** to the course implementation, as I made several adjustments and improvements based on my own preferences and understanding.  
For example, image uploads are handled **directly on the server** instead of using third-party services.

**Course reference:**  
[Next.js 16 Full Course – JavaScript Mastery](https://youtu.be/I1V9YWqRIeI?si=1wxt-pgzmpIw2E8n)

## Features
- Event listing with featured events and dynamic, SEO-friendly routing
- Detailed event pages with related event recommendations
- RESTful API for event creation with validation
- Email-based event booking with duplicate prevention and real-time validation
- Server-side image upload with file type and size validation
- MongoDB integration with Mongoose, schema validation, and optimized indexes
- Product analytics and event tracking using PostHog

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database: MongoDB with Mongoose
- Styling: Tailwind CSS 4 with custom animations
- Analytics: PostHog

## API Endpoints
- `GET /api/events` — Fetch all events (sorted by newest first)
- `GET /api/events/[slug]` — Fetch a single event by its slug
- `POST /api/events` — Create a new event with image upload support

## Installation

**1.** Clone the repository:
```bash
git clone https://github.com/Kerliula/dev-events-nextjs16.git
cd dev-events-nextjs16
```
**2.** Install dependencies:
```bash
npm install
# or
yarn install
```
**3.** Copy .env.example to .env and configure your environment variables:
```bash
cp .env.example .env
```
**4.** Ensure your MongoDB database is running and accessible with the configured connection string.
**5.** Start the local development server:
```bash
npm run dev
# or
yarn dev
```
**6.** Open your browser and navigate to:
```bash
http://localhost:3000
```

## License
This project is for learning purposes and is open for personal use.
