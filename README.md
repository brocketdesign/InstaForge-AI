# InstaForge AI

InstaForge AI is a professional content generation app that creates Instagram-ready visuals and captions from a simple prompt. It generates multiple AI images from a single concept, overlays short viral text ideas for each image, and produces optimized captions with hashtags aligned to a specific theme and marketing goal.

## Features

- 🎨 **AI Image Generation**: Generate multiple stunning images from a single prompt using Novita AI
- ✍️ **Smart Text Overlays**: Add viral text overlays to your images for maximum engagement
- 📝 **Caption & Hashtag Generation**: Get optimized captions and hashtags tailored to your theme and marketing goals
- 🖼️ **User Gallery**: Save and manage all your generated content
- ✏️ **Content Editor**: Edit text overlays, captions, and customize your content
- 👤 **User Profile**: Manage your account with Clerk authentication
- 📊 **Professional Dashboard**: Clean and intuitive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB
- **AI Services**: Novita AI (images and text generation)
- **Icons**: Lucide React, Heroicons
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Clerk account for authentication
- Novita AI API key (optional - falls back to demo mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brocketdesign/InstaForge-AI.git
cd InstaForge-AI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://your_mongodb_connection_string

# Novita AI (optional)
NOVITA_API_KEY=your_novita_api_key
NOVITA_API_URL=https://api.novita.ai/v3
```

### Getting API Keys

#### Clerk Setup
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Copy your publishable key and secret key
4. Configure sign-in/sign-up options

#### MongoDB Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password

#### Novita AI Setup (Optional)
1. Sign up at [Novita AI](https://novita.ai)
2. Get your API key from the dashboard
3. If you don't have a Novita AI key, the app will use placeholder images and demo content

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in using Clerk authentication
2. **Generate Content**: 
   - Go to the Generate page
   - Enter your content prompt
   - Specify theme and marketing goal
   - Choose number of images (2-8)
   - Click "Generate Content"
3. **Edit Content**:
   - View generated images with text overlays
   - Edit text overlays, captions, and hashtags
   - Save your changes
4. **Gallery**: Browse and manage all your generated content
5. **Profile**: Manage your account settings

## Project Structure

```
InstaForge-AI/
├── app/
│   ├── api/              # API routes
│   │   ├── generate/     # Content generation endpoint
│   │   ├── content/      # Content CRUD operations
│   │   └── gallery/      # Gallery pagination
│   ├── dashboard/        # Dashboard page
│   ├── generate/         # Content generation page
│   ├── gallery/          # Gallery page
│   ├── profile/          # Profile page
│   ├── edit/[id]/        # Content editor
│   ├── layout.tsx        # Root layout with Clerk
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── mongodb.ts        # MongoDB connection
│   ├── novita.ts         # Novita AI integration
│   └── types.ts          # TypeScript interfaces
├── components/           # Reusable components
├── public/               # Static assets
├── .env.example          # Environment variables template
├── middleware.ts         # Clerk authentication middleware
└── package.json
```

## API Routes

- `POST /api/generate` - Generate new content
- `GET /api/content?id={id}` - Get specific content
- `GET /api/content` - Get all user content
- `PUT /api/content` - Update content
- `DELETE /api/content?id={id}` - Delete content
- `GET /api/gallery` - Get paginated gallery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Support

For support, please open an issue in the GitHub repository.
