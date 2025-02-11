# PlantFinder App 🌱
A full-stack plant discovery platform with user authentication, plant management, and social features like commenting and saving plants to mylist.
This is the part of frontend of the App.

## Tech Stack 🛠️
- React (v18+) with React Router
- Bootstrap 5 + Custom CSS
- Axios for API communication
- react-slick for image carousels
- qrcode.react for QR generation

## Setup Instructions ⚙️
1. Clone the repository
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
2. Install dependencies
   npm install
3. Environment Setup 
   Create .env.local file in root directory:
   REACT_APP_API_URL=<your backend API URL>
   REACT_APP_QR_CODE_URL=<your frontend URL>
   For local development, replace URLs with your local backend address
4. Run the application
   npm start