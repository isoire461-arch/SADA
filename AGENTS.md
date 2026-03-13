# Repository Guidelines

## Project Structure & Module Organization
This is a static web application for the S.E.D.A Organization, providing an authentication system and a user management dashboard.
- **index.html**: Entry point and main authentication page (Login/Sign Up).
- **dashboard.html**: User management interface with tabs for Overview, Registration, Users list, and Analytics.
- **js/**: Contains application logic. `script.js` handles authentication, while `dashboard.js` manages dashboard interactions and data.
- **css/**: `style.css` provides shared styles across both main pages, utilizing a modern glassmorphism design.
- **Data Persistence**: Uses browser `localStorage` to store user registrations locally (`sedaUsers` key).

## Build, Test, and Development Commands
As a static project, there is no build system or dependency manager (npm/yarn/cargo).
- **Local Development**: Open `index.html` or `dashboard.html` directly in a web browser.
- **Deployment**: Configured for Vercel via [./vercel.json](./vercel.json). Deployment is handled automatically when connected to a Vercel project.

## Coding Style & Naming Conventions
- **JavaScript**:
    - Use `camelCase` for function and variable names (e.g., `showTab`, `registeredUsers`).
    - Use modern ES6+ syntax (`const`, `let`, arrow functions).
    - DOM manipulation is done via vanilla JavaScript (`document.getElementById`, `querySelectorAll`).
- **CSS**:
    - Use `kebab-case` for class names (e.g., `.sidebar-menu`, `.tab-content`).
    - Follow the existing glassmorphism aesthetic (transparency, backdrop-filters).
- **HTML**:
    - Use semantic HTML tags.
    - Forms use floating labels and standard validation attributes.

## Testing Guidelines
There is no automated testing framework currently implemented. Manual verification of UI interactions and data persistence in `localStorage` is required.

## Deployment Guidelines
Deployments are managed through Vercel. Ensure [./vercel.json](./vercel.json) correctly maps routes, as it is configured to route all non-dashboard requests to `index.html`.
