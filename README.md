# CookClient

![Angular](https://img.shields.io/badge/Angular-19.2.0-red) ![TypeScript](https://img.shields.io/badge/Typescript-5.7.2-blue)

A Recipe Management application developed in Angular, enabling users to discover, create, and review recipes. Created to work with [CookAPI](https://github.com/your-username/cook-api) - a Spring Boot backend.

## Key Features

- **User Authentication** - Secure registration and login system with JWT tokens
- **Automatic Token Refresh** - Seamless authentication using refresh tokens
- **Recipe Discovery** - Browse paginated recipe collections with advanced sorting options
- **Recipe Management** - Create, modify, and delete your own recipes with image uploads
- **Review System** - Write reviews and rate recipes, delete your own reviews
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Real-time Feedback** - Toast notifications for user actions
- **Form Validation** - Client-side validation for better user experience

## Architecture
```
┌──────────────────────────────────────────┐     
│              CookAPI                     │
│           Spring Boot Backend            │     
│         (REST API + JWT Auth)            │
└──────────────────────────────────────────┘     
                   ▲     
                   │  HTTP REST + JWT Tokens     
                   ▼     
┌──────────────────────────────────────────┐    
│             Angular Services             │     
│    (Recipe, Account, Authentication)     │         
│          HTTP Client + Interceptors      │
└──────────────────────────────────────────┘      
                   ▲      
                   │  Business Logic + State Management     
                   ▼      
┌──────────────────────────────────────────┐          
│            Angular Components            │             
│         (Recipe List, Forms, Auth)       │                   
│          Reactive Forms + Signals        │                  
│            Component Communication       │                     
└──────────────────────────────────────────┘                     
                   ▲         
                   │  Templates + User Interaction         
                   ▼         
┌──────────────────────────────────────────┐         
│                 User                     │         
│      Recipe browsing and management      │         
└──────────────────────────────────────────┘         
```

## Tech Stack
### Core Technologies

- **Angular 19** - Modern TypeScript-based framework with Signals
- **TypeScript** - Strongly typed superset of JavaScript
- **CSS** - Custom styling with responsive design
- **Reactive Forms** - Angular form handling and validation


### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd cookclient
npm install
```

2. **Install and start [CookAPI](https://github.com/filip-wojc/CookAPI)**

3. **Start the Angular application**
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### Recipe Management
- **Browse Recipes**: Paginated recipe listing with sorting by calories, difficulty, name
- **Recipe Details**: Full recipe information with ingredients, difficulty rating, and user reviews
- **Create/Edit**: Rich form interface for recipe creation and modification
- **Image Upload**: Support for recipe images with preview functionality
- **User Authorization**: Users can only edit/delete their own recipes

### Review System
- **Rate Recipes**: 1-10 star rating system
- **Write Reviews**: Detailed text reviews with title and description
- **Average Ratings**: Calculated average ratings displayed on recipes
- **Review Management**: Users can delete their own reviews

### User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Comprehensive error messages and recovery
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: Success and error notifications

## License

This project is an educational/portfolio project demonstrating modern Angular development practices with Spring Boot integration.
