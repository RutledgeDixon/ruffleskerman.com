# 🎯 ruffleskerman.com

This is my personal project hub, along with kind of being a portfolio.

## 🌐 Live Site
Visit: [ruffleskerman.com](https://ruffleskerman.com)

## 📚 Projects Included

- **Planner** - A task planning application with user authentication and database storage
- **Catan Counter** - A card counter for the board game Settlers of Catan
- **Wordle Bot** - An interactive Wordle game
- **Broadcast** - Audio streaming and playback features
- **About** - Personal portfolio and project information

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js API routes
- **Database**: MySQL (remote)
- **Hosting**: [Vercel](https://vercel.com)
- **Authentication**: JWT with bcrypt password hashing

## ⚙️ Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RutledgeDixon/ruffleskerman.com.git
   cd ruffleskerman.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database credentials:
   ```
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_database_name
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📝 Notes

- This repository is public but contains no sensitive credentials
- Database configuration is required to fully use the planner features
- Some features (like user authentication) require the backend database to be configured

## 📋 Todo List

- [ ] Refactor codebase. Tons.
- [ ] Update DB schema to calculate category progress on frontend, not needed in backend.
- [ ] Redesign planner category UI - when a category does the dropdown, it causes the rest of the categories on its line to visually dropdown without actually showing the cards.
- [ ] Switch all TypeScript to JS
- [ ] Make sure mobile looks good.
- [ ] Add projects, update 'about'

## 🤝 Contributing

Nope

## 📄 License

All rights reserved to Rutledge Dixon
