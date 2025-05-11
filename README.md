# Responsive Dashboard

A clean, fully responsive admin dashboard template built with **TypeScript**, **Tailwind CSS**, and **Vite**. This project provides a foundational UI for admin panels, analytics dashboards, content management systems, or SaaS platforms.


##  About the Project

The **Responsive Dashboard** is designed to help developers kickstart their projects with a modern and minimal dashboard interface. It includes a collapsible sidebar, top navigation bar, and responsive layout that adapts beautifully across desktop, tablet, and mobile screens.

The primary objective of this project is to provide a **scalable and customizable base** that can be extended into full-fledged admin systems or analytic dashboards for various domains like e-commerce, internal tools, CRM, and more.

###  Core UI Features

* **Sidebar Navigation**: Collapsible and highlights active links.
* **Header Bar**: Includes page title and space for search/actions/profile.
* **Main Content Area**: Placeholder for charts, tables, widgets, or forms.
* **Mobile Responsiveness**: Adaptive layout using Tailwind CSS grid/flex utilities.
* **Dark Mode (optional)**: Easily extendable for theming or dark/light modes.

###  Use Cases

* Admin panels for internal business dashboards
* Analytics dashboards for SaaS platforms
* CRM or CMS backends
* Developer starter templates for custom dashboards
* Educational projects to learn layout and design using Tailwind + TypeScript


##  Screenshots
![Screenshot 2025-05-11 215256](https://github.com/user-attachments/assets/fc362381-1b87-4ddb-ad49-990d68930ee9)
![Screenshot 2025-05-11 215308](https://github.com/user-attachments/assets/073a87bb-d3d5-4b3e-aa64-c025ee5d4e0c)



##  Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

* Node.js (v14 or higher recommended)
* npm 

### Installation

```bash
# Clone the repository
git clone https://github.com/latha0001/Responsive-dashboard.git
cd Responsive-dashboard

# Install dependencies
npm install  # or yarn install

# Start the development server
npm run dev  # or yarn dev
```

Open `http://localhost:5173` in your browser to view the app.

deploy link : https://friendly-alfajores-f8e5b4.netlify.app/

##  Project Structure

```
Responsive-dashboard/
├── public/                # Static public assets
├── src/
│   ├── components/        # Reusable UI components (Navbar, Sidebar, etc.)
│   ├── assets/            # Images, logos, icons
│   ├── pages/             # Main content views or pages
│   ├── styles/            # Tailwind CSS config or custom styles
│   └── main.ts            # Application entry point
├── index.html             # HTML shell
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration for build
├── tsconfig.json          # TypeScript config
└── package.json           # Project metadata and scripts
```

---

##  Scripts

  Command           Description                    
 `npm run dev`      Start local development server 
 
 `npm run build`    Build for production       
 
 `npm run preview`  Preview the production build   

##  Future Enhancements

* Add charts and widgets using Chart.js or Recharts
* Integrate authentication and protected routes
* Implement dark mode with toggle
* Build reusable form components
* Add routing support with React Router or similar


##  Author

* **GitHub**: [@latha0001](https://github.com/latha0001)
