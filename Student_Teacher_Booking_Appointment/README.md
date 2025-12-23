# Student-Teacher Booking Appointment System

A comprehensive web-based appointment booking system that allows students and teachers to manage their academic appointments online.

## 📋 Project Overview

This system enables students and teachers to:
- **Students**: Search for teachers, book appointments, send messages, and track bookings
- **Teachers**: Manage availability, approve/reject appointment requests, and communicate with students  
- **Admins**: Manage teachers, approve student registrations, and oversee all appointments

## 🎯 Key Features

### Admin Dashboard
- Add, edit, and delete teachers
- Manage teacher information (Name, Department, Subject)
- Approve/reject student registrations
- View all appointments in the system
- Monitor system activity

### Teacher Dashboard
- Add and manage availability slots
- View and manage appointment requests
- Approve/cancel appointments
- View messages from students
- Schedule management

### Student Dashboard
- Search teachers by name, department, or subject
- View teacher profiles and available slots
- Book appointments with preferred time slots
- View booked appointments
- Cancel pending appointments
- Send and receive messages

## 🏗️ System Architecture

```
├── index.html          # Main HTML structure
├── style.css           # Complete styling
├── firebase-config.js  # Firebase configuration (CDN-based)
├── logger.js           # Comprehensive logging system
├── auth.js             # Authentication & session management
├── admin.js            # Admin dashboard functionality
├── teacher.js          # Teacher dashboard functionality
└── student.js          # Student dashboard functionality
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Authentication)
- **Architecture**: Modular, Component-based
- **Logging**: Custom JavaScript Logger
- **Storage**: Local + Firebase Firestore

## 📦 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project account
- Text editor or IDE

### Steps

1. **Clone/Download the project**
```bash
git clone https://github.com/yourusername/student-teacher-appointment
cd student-teacher-appointment
```

2. **Configure Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Get your Firebase configuration
   - Update `firebase-config.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

3. **Set up Firestore Collections**
   - Create the following collections in Firestore:
     - `users` - Store user profiles
     - `teachers` - Teacher information and profiles
     - `students` - Student profiles and status
     - `appointments` - Appointment records
     - `scheduleSlots` - Teacher availability
     - `messages` - Communication between users

4. **Run the application**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

## 🔐 User Roles & Workflows

### Admin Workflow
1. Login with admin role
2. View teacher management panel
3. Add/update/delete teachers
4. Approve student registrations
5. Monitor all appointments
6. Oversee system statistics

### Teacher Workflow
1. Register or login as teacher
2. Add availability slots
3. Review appointment requests
4. Approve/reject requests
5. Communicate with students
6. Track scheduled appointments

### Student Workflow
1. Register as student (pending approval)
2. Wait for admin approval
3. Login once approved
4. Search for teachers
5. View available time slots
6. Book appointments
7. Receive confirmation notifications
8. Join meetings or cancel if needed

## 📋 Appointment Status Flow

```
pending → approved → completed
      ↓
     rejected

pending → cancelled (by student)
```

## 🔍 Logging System

The application includes a comprehensive logging system that tracks:
- User actions (login, registration, bookings)
- System errors and warnings
- User authentication events
- Data operations
- System performance

### Access Logs
```javascript
// View all logs
logger.getAllLogs()

// View specific level
logger.getLogsByLevel('ERROR')

// Export logs
logger.downloadLogs('json')  // or 'csv'

// Print statistics
logger.printStats()
```

## 📊 Database Schema

### Users Collection
```
{
  uid: string,
  email: string,
  name: string,
  role: 'admin' | 'teacher' | 'student',
  createdAt: timestamp,
  status: 'pending' | 'approved' | 'rejected'
}
```

### Teachers Collection
```
{
  id: string,
  name: string,
  email: string,
  department: string,
  subject: string,
  bio: string,
  approvalStatus: 'approved' | 'pending',
  createdAt: timestamp
}
```

### Appointments Collection
```
{
  id: string,
  studentId: string,
  teacherId: string,
  date: string,
  time: string,
  reason: string,
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Schedule Slots Collection
```
{
  id: string,
  teacherId: string,
  date: string,
  time: string,
  duration: number,
  available: boolean,
  createdAt: timestamp
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Dashboard**: Intuitive navigation with sidebar menus
- **Real-time Notifications**: Toast notifications for user actions
- **Loading States**: Spinner animations for async operations
- **Form Validation**: Client-side validation before submission
- **Status Badges**: Visual indicators for appointment and student status
- **Search Functionality**: Quick teacher search with filters

## 🔒 Security Considerations

1. **Input Validation**: All forms validate before submission
2. **Email Validation**: Email format verification
3. **Password Requirements**: Minimum 6 characters
4. **Firebase Security**: Configure Firestore rules properly
5. **User Authentication**: Role-based access control

### Firestore Security Rules (Template)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /appointments/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing Checklist

- [ ] User authentication (login/register)
- [ ] Role-based dashboard routing
- [ ] Teacher search functionality
- [ ] Appointment booking workflow
- [ ] Admin approval process
- [ ] Message sending/receiving
- [ ] Form validation
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Error handling
- [ ] Logging functionality

## 📈 Performance Optimization

1. **Code Splitting**: Modular JS files for better organization
2. **Lazy Loading**: Dashboard components load on demand
3. **Caching**: Browser caching for static assets
4. **Minification**: Production-ready minified CSS
5. **Efficient Queries**: Indexed Firestore queries

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Other Platforms
- **Vercel**: Connect GitHub repo to Vercel
- **Netlify**: Drag & drop or connect GitHub
- **GitHub Pages**: Static hosting for free
- **AWS S3**: Static website hosting

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase config credentials
- Check Firestore rules and permissions
- Ensure database is not in read-only mode

### Authentication Errors
- Clear browser cache and cookies
- Verify email format
- Check password requirements (min 6 chars)

### Display Issues
- Clear browser cache
- Check JavaScript console for errors
- Verify all CSS files are loaded

## 📝 Future Enhancements

- [ ] Video conferencing integration (Google Meet/Zoom)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Recurring appointments
- [ ] Rating and reviews
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Appointment reminders
- [ ] Analytics dashboard

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Coding Standards

- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow ES6+ syntax
- Use const/let instead of var
- Keep functions focused and modular
- Add error handling and logging

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@example.com
- Check documentation in each file

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Modern web development best practices
- Educational institution feedback

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Your Name  
**GitHub**: https://github.com/yourusername/student-teacher-appointment
