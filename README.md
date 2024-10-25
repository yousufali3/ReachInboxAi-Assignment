# ReachInBox Assignment

Welcome to my ReachInBox Assigment, this project is an automated email response tool that categorizes emails and sends appropriate replies using AI. It integrates OAuth2 for Gmail and Outlook, uses OpenAI for email categorization and reply generation, and employs BullMQ with Redis for task scheduling. The tool is built in TypeScript.

## Features

- **OAuth2 Authentication**: Connects to Gmail and Outlook via OAuth2.
- **Email Parsing**: Automatically reads and parses incoming emails.
- **AI-Powered Categorization**: Uses OpenAI to categorize emails as:
  - Interested
  - Not Interested
  - More Information
- **Automated Replies**: Sends contextual replies to emails based on the category assigned.
- **Task Scheduling**: Uses BullMQ and Redis to schedule and process tasks like sending email replies.

## Demo Flow

1. **Authenticate Gmail and Outlook**: Users can connect their email accounts using OAuth2.
2. **Email Reception**: The tool listens for incoming emails.
3. **Categorization**: The tool reads email content and assigns a label based on context using OpenAI.
4. **Automatic Reply**: Depending on the category, the tool sends an automated email response.

## Project Structure

        .
        ├── src
        │ ├── Auth
        │ │ └── outlookAuth.ts          # Outlook OAuth2 integration
        │ ├── Controllers
        │ │ ├── googleAuth.ts           # Google OAuth2 integration
        │ │ ├── bullmqController.ts     # BullMQ and Redis queue management
        │ │ ├── emailController.ts      # Functions for categorizing and replying to emails
        │ │ └── openaiController.ts     # OpenAI API integration for categorization and replies
        │ ├── Middlewares
        │ │ ├── openaiClient.ts         # OpenAI API client setup
        │ │ └── redisClient.ts          # Redis client setup
        │ └── index.ts                  # Main Express server
        ├── .env                        # Environment variables
        └── README.md

## Prerequisites

- **Node.js**
- **Redis**
- **Gmail API and Microsoft Azure API Credentials**
- **OpenAI API Key**

<hr>

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TejasNayak42/reachinbox.ai-backend_assignment.git
   cd reachinbox.ai-backend_assignment
   ```

2. **Install dependencies:**

   ```bash
      npm install

   ```

3. **Setup environment variables**

Create a `.env` file at the root of the project:

```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_REDIRECT_URI=your_azure_redirect_uri
AZURE_AUTHORITY=https://login.microsoftonline.com/your_azure_tenant_id

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

```

4.  **Run the server**

            npm run start

## Usage

1. **Authenticate Gmail:**

   Navigate to `http://localhost:3000/auth/google` to authenticate your Google account and authorize the app to read emails.

2. **Authenticate Outlook:**

   Navigate to `http://localhost:3000/auth/azure` to authenticate your Outlook account.

3. **Check and respond to emails:**

   The tool will automatically fetch new emails, categorize them using OpenAI, and send appropriate replies based on the email context.

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `PORT`                 | Port number on which the server runs       |
| `OPENAI_API_KEY`       | API key for OpenAI                         |
| `GOOGLE_CLIENT_ID`     | OAuth2 Client ID for Google                |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret for Google            |
| `GOOGLE_REDIRECT_URI`  | OAuth2 Redirect URI for Google             |
| `AZURE_CLIENT_ID`      | OAuth2 Client ID for Microsoft Outlook     |
| `AZURE_CLIENT_SECRET`  | OAuth2 Client Secret for Microsoft Outlook |
| `AZURE_REDIRECT_URI`   | OAuth2 Redirect URI for Microsoft Outlook  |
| `AZURE_AUTHORITY`      | OAuth2 Authority URL for Microsoft         |
| `REDIS_HOST`           | Host for the Redis server                  |
| `REDIS_PORT`           | Port for the Redis server                  |
| `REDIS_PASSWORD`       | Password for Redis server                  |

## BullMQ & Redis

The tool leverages **BullMQ** for task scheduling. **Redis** is used to manage the queues for sending email replies.

## API Endpoints

### Google OAuth

- **GET /auth/google**: Initiates the Google OAuth2 flow.
- **GET /auth/google/callback**: Handles the Google OAuth2 callback.

### Outlook OAuth

- **GET /auth/azure**: Initiates the Microsoft Azure OAuth2 flow.
- **GET /auth/azure/callback**: Handles the Azure OAuth2 callback.

## How It Works

### OAuth2 Authentication

Users connect their email accounts using Google and Azure OAuth2 authentication flows.

### Email Categorization

The tool fetches recent emails and sends the email content to OpenAI to categorize them into "Interested," "Not Interested," or "More Information."

### Automated Replies

The tool generates contextual replies based on the categorization and schedules them using BullMQ to be sent out automatically.

## Troubleshooting

- **OAuth2 Authentication Issues**: Ensure your client IDs, client secrets, and redirect URIs are correctly configured in the `.env` file.
- **OpenAI API Errors**: Ensure your OpenAI API key is valid and you have sufficient quota.
- **Redis Connection Issues**: Verify your Redis server configuration and credentials in the `.env` file.

## Contact Information

If you have any questions or would like to provide feedback on my project, please don’t hesitate to get in touch at [tejasnayak.tech](https://tejasnayak.tech).

I appreciate your time in reviewing my work and look forward to your feedback!
