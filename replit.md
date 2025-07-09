# BRAGA WORK Website

## Overview

This is a modern, interactive portfolio website for BRAGA WORK, designed to showcase web development services and capture client inquiries. The site features a professional design with smooth animations, a client request form, and an admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript
- **Design Pattern**: Component-based approach with modular CSS
- **Styling**: CSS3 with custom properties (CSS variables) for consistent theming
- **Animations**: CSS transitions and JavaScript-driven interactions
- **Responsive Design**: Mobile-first approach with flexible layouts

### Backend Architecture
- **Technology**: PHP for server-side logic
- **Database**: MySQL for data persistence
- **Authentication**: Session-based authentication for admin access
- **API Pattern**: Traditional server-side rendering with form submissions

### Brand Identity Integration
- **Primary Color**: #00AEEF (Light Blue) - For highlights and main CTAs
- **Secondary Color**: #8BC53F (Light Green) - For secondary elements
- **Background**: #0D1B2A (Dark Blue) - Creates professional contrast
- **Typography**: Inter font family for modern, clean appearance

## Key Components

### 1. Public Website
- **Homepage**: Hero section with animated elements and service presentation
- **Portfolio Section**: Dynamic display of projects with videos and images
- **Contact Form**: Client inquiry capture with validation
- **Responsive Navigation**: Mobile-friendly menu system

### 2. Admin Panel
- **Authentication System**: Password-protected access
- **Quote Management**: View, edit, and delete client inquiries
- **Content Management**: Add/remove portfolio items (videos, images, descriptions)
- **Dashboard**: Overview of system activity and pending requests

### 3. Form System
- **Client Data Capture**: Name, email, phone, project description
- **Validation**: Client-side and server-side input validation
- **Database Storage**: Structured storage of client inquiries

## Data Flow

### Client Inquiry Process
1. Visitor fills out contact form on homepage
2. JavaScript validates form inputs client-side
3. Form data submitted to PHP backend
4. PHP validates and sanitizes data
5. Data stored in MySQL database
6. Admin notification system alerts of new inquiry

### Content Management Flow
1. Admin logs into protected panel
2. Access granted through session management
3. CRUD operations on portfolio content
4. Real-time updates to public website
5. Changes reflected immediately on frontend

## External Dependencies

### Frontend Libraries
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library for UI elements
- **CSS3**: Modern styling with animations and transitions

### Backend Dependencies
- **PHP**: Server-side processing and authentication
- **MySQL**: Database management system
- **Session Management**: PHP native session handling

## Deployment Strategy

### Development Environment
- Local development with XAMPP/WAMP for PHP and MySQL
- File-based structure for easy deployment
- Modular CSS and JS for maintainability

### Production Considerations
- **Hosting**: Shared hosting compatible (PHP/MySQL support required)
- **Security**: Password hashing, SQL injection prevention, XSS protection
- **Performance**: Optimized images, minified CSS/JS, efficient database queries
- **Backup**: Regular database backups for client data protection

### File Structure
```
/assets
  /css - Styling files with component organization
  /js - Interactive functionality and admin panel logic
/admin - Protected administration area
/includes - PHP includes for database and common functions
/uploads - Media files for portfolio content
```

### Database Schema
- **quotes**: Client inquiry storage (id, name, email, phone, description, date)
- **portfolio**: Project content management (id, title, description, media_path, type)
- **admin_users**: Authentication credentials (id, username, password_hash)

This architecture provides a scalable foundation for a professional service website while maintaining simplicity for easy maintenance and updates.