# Remonial

Remonial is a testimonial collection platform that allows businesses to gather customer feedback effortlessly. Businesses can share unique testimonial links, and customers can submit reviews with ratings, optional details like name, image, and job title, helping businesses build trust and credibility.

---

## Tech Stack

The app is a fast, interactive, and user-friendly multi-page application, built with Next.js for server-side rendering and optimized performance, along with the following technologies:

- **[NextJS](https://nextjs.org/)**  
- **[Typescript](https://www.typescriptlang.org/)**    
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Shadcn/ui](https://ui.shadcn.com/)**  
- **[Next Auth](https://next-auth.js.org/)**  
- **[MongoDB](https://www.mongodb.com/)**  

---

## API Endpoints

The following API endpoints are available (browseable at `/api`):

```
api/sign-up
api/verify-code
api/check-username
api/onboard-user
api/get-user-details
api/i/{username}
api/send-testimonial
api/get-testimonial
api/accept-testimonials
api/delete-testimonial
api/update-action
```

## Installation

Make sure you have following software installed in your system:
* NodeJS
* npm / pnpm
* Git

First, we need to clone the repository
```
https://github.com/raodevendrasingh/remonial-app.git
```

Install all required dependencies in an isolated environment

```
cd remonial
pnpm install
```
Copy the `.env.sample` as `.env` in `remonial` folder
```
cp .env.sample .env
```

## Running the local server

```
cd remonial
pnpm dev
```
The App should be available on http://localhost:3000/
