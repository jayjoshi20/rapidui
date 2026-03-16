# RapidUI - AI-Driven Component Generator

RapidUI is a modern, full-stack web application that leverages the power of Google's Gemini AI to instantly generate production-ready React components styled with Tailwind CSS from simple natural language descriptions.

**Live Demo:** [https://rapidui-khaki.vercel.app/](https://rapidui-khaki.vercel.app/)

## ✨ Features

- **Natural Language to Code:** Describe the UI component you want, and the AI generates the complete React functional component.
- **Instant Live Preview:** See the generated component rendered live within an isolated iframe sandbox before copying the code.
- **Syntax Highlighting:** Beautifully formatted code block using `react-syntax-highlighter`.
- **One-Click Copy:** Easily copy the generated code to your clipboard to drop directly into your project.
- **Tailwind v4 Integration:** All components are fully styled using the latest Tailwind CSS utilities.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI Integration:** Google Generative AI (Gemini 1.5 Flash)
- **Deployment:** Vercel

## 🚀 Getting Started Locally

To run this project on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/jayjoshi20/rapidui.git
cd rapidui
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app/page.tsx` - The main client interface (Textarea, Live Preview, Code Editor).
- `src/app/api/generate/route.ts` - The serverless API endpoint that securely connects to the Gemini API to stream the generated UI code.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
*Built as a showcase for integrating LLMs into modern full-stack React workflows.*
