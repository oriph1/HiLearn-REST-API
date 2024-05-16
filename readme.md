# HiLearn: REST API for Finding a Private Teacher in a Specific Course

HiLearn is a backend server application designed to help students find private teachers for specific courses. It enables students to search for teachers, rate them, and manage their accounts. The app uses MongoDB with Mongoose for data storage and Node.js with Express.js as an abstraction layer.

## Description

HiLearn facilitates connections between students seeking help in specific subjects and teachers available to provide tutoring. The platform ensures secure and efficient management of user data, course information, and teacher ratings.

## User Profiles

### Students:

- Must log in and choose the subjects they need help with.
- Can rate and review teachers they have worked with.

### Teachers:

- Must log in and list the subjects they are available to teach.
- Can update their profiles with additional courses they wish to teach or remove courses they no longer want to teach.

## Use Scenarios

### System Registration:

#### Student Registration:

- Students register using their university email and a password.
- Upon registration, students can access platform features and select courses they need help with.

#### Teacher Registration:

- Teachers register using their university email and a password.
- Upon registration, teachers can access platform features and list courses they are available to teach.

### Subject Selection:

#### Student Requests Tutoring:

- Students search for and select subjects they need help with.
- The system records the student's request for tutoring in the selected subjects.

#### Teacher Lists Subjects:

- Teachers list the subjects they can teach.
- The system updates the teacher's profile with the listed subjects.

### Matching Process:

- The system matches student requests with available teachers based on the subjects listed by teachers and selected by students.
- Presents a list of suitable teachers to students seeking assistance in specific subjects, prioritizing teachers based on their ranking.

### Ranking Teachers:

- Students can rank teachers they have worked with.
- Students navigate to the "Rank Teachers" section, select a teacher, and enter the teacher's email and a ranking.
- The system verifies if the student has already ranked the teacher and records the ranking if it is the first time.

## Functional Requirements

- Matching Process: Implement a process to match student requests with available teachers based on the subject.
- Privacy and Security: Ensure compliance with data protection regulations and implement security measures to safeguard user data and transactions.
- Rating and Review System: Implement a rating and review system for students to provide feedback on their tutoring experience with each teacher.
- Super User Access: Provide administrators with elevated privileges to manage user accounts, system settings, resolve disputes, and perform administrative tasks.

## Database

- User Database: Store user details (students and teachers).
- Courses Database: Store information about available courses.
- Ranking Database: Store information about teacher rankings.
- Database Management Abilities: Add fields, remove fields, and clear data as needed.

## User Interface

### User Registration and Authentication:

- Allow students and teachers to register accounts on the platform.
- Provide authentication mechanisms to ensure secure access to user accounts.
- Restrict database query execution to logged-in users to enhance security and prevent unauthorized access to sensitive data.

### Posting Requests:

- Allow students to post requests for tutoring assistance, specifying their desired subjects.
- Allow teachers to list their available subjects to teach and modify the list.

## Security Measures

- Admin User Security: Secure admin user accounts with strong password policies and limit access to authorized personnel.
- Unverified Student Ratings: The system currently lacks verification for whether a student has been taught by a teacher before allowing them to rate.
- Duplicate Teacher Ratings: Prevent students from rating the same teacher multiple times to ensure fairness.
- Denial of Service (DoS) Attacks: Implement measures to prevent users from overwhelming the system with DoS attacks.
- Session Management: Limit JWT session duration to two hours to reduce the risk of unauthorized access.

## Scalability and Compatibility

- Scalability: Integrate scalable solutions into the platform's architecture to handle growing user demands and data volumes.
- Compatibility: Ensure the platform functions smoothly across different browsers, operating systems, and devices.

## Usage

For detailed API usage and endpoints, please refer to our Postman documentation: https://documenter.getpostman.com/view/30949877/2sA3JM8hW7
