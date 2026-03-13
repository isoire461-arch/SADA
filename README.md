# S.E.D.A Organization Login & Sign Up with Dashboard

A modern, responsive authentication and user management system for the S.E.D.A Organization, featuring login, sign-up, and a comprehensive dashboard. Built with HTML, CSS, and JavaScript. Designed for deployment on Vercel.

## Features

- **Dual Authentication**: Toggle between Login and Sign Up modes
- **User Dashboard**: Tabbed interface for user management
- **Registration Management**: View, edit, and delete registered users
- **Data Persistence**: Client-side storage using localStorage
- **Modern Design**: Gradient backgrounds, glassmorphism effects, and smooth animations
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Interactive Elements**: Floating labels, hover effects, and particle animations
- **Form Validation**: Client-side validation with loading states
- **Analytics Dashboard**: Statistics and user insights

## Project Structure

```
SEDA/
├── index.html              # Main authentication page (Login/Sign Up)
├── dashboard.html          # User management dashboard
├── css/
│   └── style.css          # Shared styles
├── js/
│   ├── script.js          # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   └── particles.js       # Particle animation
├── assets/                # Static assets
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## Dashboard Features

### 🏠 **Overview Tab**
- **Statistics Dashboard**: Real-time metrics with beautiful stat cards
- **Quick Actions**: Direct access to registration and user management
- **System Status**: Live system health indicators
- **Visual Analytics**: Completion rates and user insights

### 📋 **Registration Form Tab**
- **Organized Sections**: 
  - Personal Information (ID, Name, Gender, DOB)
  - Cultural Information (Religion, Tribe/Language)
  - Professional Information (Section, Job Title)
  - Contact Information (Email, Phone, Passport)
- **Auto-Generated IDs**: Sequential ID numbering (SEDA202601...)
- **File Upload**: Passport picture upload with validation
- **Responsive Grid**: 2-column layout for better organization

### 👥 **Registered Users Tab**
- **Comprehensive Table**: All user data in a responsive table
- **Advanced Actions**: Edit and delete functionality
- **Statistics Cards**: Total, active, and recent user counts
- **Search & Filter**: Enhanced user management capabilities

### 📊 **Analytics Tab**
- **Framework Ready**: Prepared for future analytics implementation
- **Chart Placeholders**: Space for graphs and detailed reporting
- **Trend Analysis**: User registration patterns and insights

## Technologies Used

- HTML5 with semantic structure
- CSS3 (Flexbox, Grid, Animations, Media Queries)
- Vanilla JavaScript (ES6+, localStorage API)
- Vercel for static site deployment

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your browser to access the authentication page
3. Use the dashboard link or navigate to `dashboard.html` for user management
4. For deployment, connect your repository to Vercel

## Usage

### Authentication Flow
1. **Sign Up**: Fill out the registration form and submit
2. **Auto-Redirect**: Successful registration redirects to the dashboard
3. **Login**: Use any registered credentials to log in
4. **Dashboard Access**: View and manage all registered users

### Dashboard Navigation
- **Registration Form**: Add new users directly from the dashboard
- **Registered Users**: View user statistics and manage existing users
- **Analytics**: Monitor registration trends and statistics

## Data Storage

This demo uses browser localStorage for data persistence:
- User registrations are stored locally in your browser
- Data persists between sessions but is browser-specific
- For production use, implement a proper backend database

## Deployment on Vercel

1. Sign up for a Vercel account at [vercel.com](https://vercel.com)
2. Connect your Git repository or upload the project files
3. Vercel will automatically detect the configuration and deploy both pages
4. Access your live site and dashboard

## Customization

- **Colors**: Modify the CSS custom properties in `css/style.css`
- **Content**: Update the HTML in `index.html` and `dashboard.html`
- **Functionality**: Enhance the JavaScript in `js/script.js` and `js/dashboard.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- User authentication with JWT
- Database storage (MongoDB, PostgreSQL)
- Email verification
- Password reset functionality
- Advanced analytics and reporting
- User roles and permissions

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please contact the S.E.D.A Organization.