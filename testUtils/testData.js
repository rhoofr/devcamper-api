// testAccounts[0] = user Account
// testAccounts[1] = publisher Account
// testAccounts[2] = admin Account (has role 'user' initially)
exports.testAccounts = [
  {
    name: 'User Account',
    email: 'user@gmail.com',
    password: 'password',
    role: 'user'
  },
  {
    name: 'Publisher Account',
    email: 'publisher@gmail.com',
    password: 'password',
    role: 'publisher'
  },
  {
    name: 'Admin Account',
    email: 'admin@gmail.com',
    password: 'password',
    role: 'user'
  }
];

exports.testBootcamps = [
  {
    name: 'Devworks Bootcamp',
    description:
      'Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer',
    website: 'https://devworks.com',
    phone: '(111) 111-1111',
    email: 'enroll@devworks.com',
    address: '233 Bay State Rd Boston MA 02215',
    careers: ['Web Development', 'UI/UX', 'Business'],
    housing: false,
    jobAssistance: true,
    jobGuarantee: false,
    acceptGi: true
  },
  {
    name: 'ModernTech Bootcamp',
    description:
      'ModernTech has one goal, and that is to make you a rockstar developer and/or designer with a six figure salary. We teach both development and UI/UX',
    website: 'https://moderntech.com',
    phone: '(222) 222-2222',
    email: 'enroll@moderntech.com',
    address: '220 Pawtucket St, Lowell, MA 01854',
    careers: ['Web Development', 'UI/UX', 'Mobile Development'],
    housing: false,
    jobAssistance: true,
    jobGuarantee: false,
    acceptGi: true
  },
  {
    name: 'Codemasters',
    description:
      'Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in full stack web development and data science',
    website: 'https://codemasters.com',
    phone: '(333) 333-3333',
    email: 'enroll@codemasters.com',
    address: '85 South Prospect Street Burlington VT 05405',
    careers: ['Web Development', 'Data Science', 'Business'],
    housing: false,
    jobAssistance: false,
    jobGuarantee: false,
    acceptGi: false
  },
  {
    name: 'Devcentral Bootcamp',
    description:
      'Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development',
    website: 'https://devcentral.com',
    phone: '(444) 444-4444',
    email: 'enroll@devcentral.com',
    address: '45 Upper College Rd Kingston RI 02881',
    careers: [
      'Mobile Development',
      'Web Development',
      'Data Science',
      'Business'
    ],
    housing: false,
    jobAssistance: true,
    jobGuarantee: true,
    acceptGi: true
  }
];

exports.testCourses = [
  {
    title: 'Front End Web Development',
    description:
      'This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue',
    weeks: 8,
    tuition: 8000,
    minimumSkill: 'beginner',
    scholarshipsAvailable: true
  },
  {
    title: 'Full Stack Web Development',
    description:
      'In this course you will learn full stack web development, first learning all about the frontend with HTML/CSS/JS/Vue and then the backend with Node.js/Express/MongoDB',
    weeks: 12,
    tuition: 10000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: true
  },
  {
    title: 'Full Stack Web Dev',
    description:
      'In this course you will learn all about the front end with HTML, CSS and JavaScript. You will master tools like Git and Webpack and also learn C# and ASP.NET with Postgres',
    weeks: 10,
    tuition: 12000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: true
  },
  {
    title: 'UI/UX',
    description:
      'In this course you will learn to create beautiful interfaces. It is a mix of design and development to create modern user experiences on both web and mobile',
    weeks: 12,
    tuition: 10000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: true
  },
  {
    title: 'Web Design & Development',
    description:
      'Get started building websites and web apps with HTML/CSS/JavaScript/PHP. We teach you',
    weeks: 10,
    tuition: 12000,
    minimumSkill: 'beginner',
    scholarshipsAvailable: true
  },
  {
    title: 'Data Science Program',
    description:
      'In this course you will learn Python for data science, machine learning and big data tools',
    weeks: 10,
    tuition: 9000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: false
  },
  {
    title: 'Web Development',
    description:
      'This course will teach you how to build high quality web applications with technologies like React, Node.js, PHP & Laravel',
    weeks: 8,
    tuition: 8000,
    minimumSkill: 'beginner',
    scholarshipsAvailable: false
  },
  {
    title: 'Software QA',
    description:
      'This course will teach you everything you need to know about quality assurance',
    weeks: 6,
    tuition: 5000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: false
  },
  {
    title: 'IOS Development',
    description:
      'Get started building mobile applications for IOS using Swift and other tools',
    weeks: 8,
    tuition: 6000,
    minimumSkill: 'intermediate',
    scholarshipsAvailable: false
  }
];

exports.testReviews = [
  {
    title: 'Learned a ton!',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '8'
  },
  {
    title: 'Great bootcamp',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '10'
  },
  {
    title: 'Got me a developer job',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '7'
  },
  {
    title: 'Not that great',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '4'
  },
  {
    title: 'Great overall experience',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '7'
  },
  {
    title: 'Not worth the money',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '5'
  },
  {
    title: 'Best instructors',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '10'
  },
  {
    title: 'Was worth the investment',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque',
    rating: '7'
  }
];
