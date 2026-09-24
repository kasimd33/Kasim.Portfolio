// Add verified personal information here. Empty URLs never render as broken links.
export const portfolio = {
  name: 'Kasim',
  title: 'Software Developer',
  positioning: 'Full-Stack Developer | Java | AI-Powered Applications',
  hero: 'Building scalable full-stack and AI-powered applications.',
  focus: ['Full-Stack', 'Java', 'AI'],
  about: {
    statement: 'Thoughtful code.\nReal-world purpose.',
    introduction: 'I’m Kasim, an Information Science & Engineering graduate focused on turning complex problems into useful software.',
    description: 'My work brings together full-stack engineering, Java backend development, and AI-powered applications. I care about clear interfaces, dependable systems, and learning by building.',
    education: 'Information Science & Engineering',
    institution: '', // Add college/university.
    graduationYear: '',
    level: 'Graduate · Early-career developer',
  },
  links: { github: 'https://github.com/kasimd33', linkedin: '', email: 'dkasim.ise.rymec@gmail.com', phone: '+917019588349', whatsapp: 'https://wa.me/917019588349', resume: '/resume/Kasim-Resume.pdf' },
  phoneDisplay: '+91 7019588349',
  resumeAvailable: true,
  navigation: [{ id: 'about', label: 'About' }, { id: 'projects', label: 'Projects' }, { id: 'experience', label: 'Experience' }, { id: 'contact', label: 'Contact' }],
  projects: [
    { id: 'roadlens', overview: "ROADLENS connects mobile road inspections with AI-assisted damage detection and reporting. Its computer vision workflow uses image analysis to identify road damage, with authority and user workflows, automated reports, and notifications. The stack combines Flutter, Python, FastAPI, and YOLO / OpenCV.", name: 'ROADLENS', category: 'Computer vision · Mobile', title: 'Better roads start with better insight.', description: 'An AI-powered road damage inspection and reporting platform, connecting mobile inspections with actionable reports.', technologies: ['Flutter', 'Python', 'FastAPI', 'YOLO / OpenCV'], features: ['Road damage detection', 'Computer vision and image analysis', 'Mobile road inspection', 'Authority and user workflows', 'Automated reporting', 'Notifications'], image: '/projects/roadlens.svg', imageAlt: 'RoadLens concept diagram showing image analysis, damage detection, and reporting.', github: '', demo: '' },
    { id: 'stockvision', overview: "STOCKVISION AI brings market analytics, real-time stock information, and AI insights into one application. Users can explore stock analysis, maintain a watchlist, and interact with an AI chatbot. The application combines a React frontend with Node.js, MongoDB, REST APIs, and AI capabilities.", name: 'STOCKVISION AI', category: 'AI · Market analytics', title: 'Market information. A clearer perspective.', description: 'Stock market analytics with real-time information, AI insights, and a conversational way to explore stocks.', technologies: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'AI'], features: ['Market analytics', 'Real-time stock information', 'AI insights', 'Watchlist', 'Stock analysis', 'AI chatbot'], image: '/projects/stockvision.svg', imageAlt: 'StockVision concept diagram connecting market data, watchlists, and AI insights.', github: '', demo: '' },
    { id: 'finova', overview: "FINOVA AI brings expense management, budgeting, and financial analytics together in a personal finance application. OCR supports receipt and document scanning, while AI insights and financial reports help users review their finances. Its technology stack includes React, Node.js, MongoDB, AI, and OCR.", name: 'FINOVA AI', category: 'AI · Personal finance', title: 'Make sense of everyday money.', description: 'A personal finance application that brings expenses, budgets, receipt scanning, and AI insights into one place.', technologies: ['React', 'Node.js', 'MongoDB', 'AI', 'OCR'], features: ['Expense management', 'Budgets', 'Analytics', 'OCR receipt and document scanning', 'AI insights', 'Financial reports'], image: '/projects/finova.svg', imageAlt: 'Finova concept diagram linking receipts, expense management, budgets, and financial reports.', github: '', demo: '' },
    { id: 'ballotbridge', overview: "BALLOTBRIDGE organizes online voting around dedicated administrator, voter, and candidate roles. The platform includes authentication, candidate management, a voting workflow, and election results. Its full-stack foundation uses React, Node.js, Express, MongoDB, and Firebase / Auth.", name: 'BALLOTBRIDGE', category: 'Full-stack · Role-based access', title: 'A connected voting experience.', description: 'A role-based online voting platform with dedicated workflows for administrators, voters, and candidates.', technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase / Auth'], features: ['Admin, voter, and candidate roles', 'Authentication', 'Candidate management', 'Voting workflow', 'Election results'], image: '/projects/ballotbridge.svg', imageAlt: 'BallotBridge concept diagram of admin, voter, and candidate roles connected to an election workflow.', github: '', demo: '' },
    { id: 'devstack', overview: "DEVSTACK HUB is a developer tools and learning platform built with Java. Its stack combines JDBC and MySQL for database integration with REST APIs. The project focuses on developer utilities and learning resources.", name: 'DEVSTACK HUB', category: 'Java · Developer tools', title: 'Built for the builder.', description: 'A developer tools and learning platform built with Java, JDBC, MySQL, and REST APIs.', technologies: ['Java', 'JDBC', 'MySQL', 'REST APIs'], features: ['Developer tools', 'Learning platform'], image: '/projects/devstack.svg', imageAlt: 'DevStack Hub architecture diagram connecting Java, JDBC, MySQL, and REST APIs.', github: '', demo: '' },
  ],
  stackArtwork: '/images/stack/tech-atlas.webp',
  featuredStack: [
    { name: 'Java', category: 'Language', description: 'A foundation for backend development and practical application building, including the Java, JDBC, and REST API stack in DevStack Hub.', column: 0, row: 0 },
    { name: 'React', category: 'Frontend', description: 'Component-based interfaces for full-stack applications, including StockVision AI, Finova AI, and BallotBridge.', column: 1, row: 0 },
    { name: 'Python', category: 'Language · AI', description: 'Image analysis and computer vision in RoadLens, alongside FastAPI and YOLO / OpenCV.', column: 2, row: 0 },
    { name: 'Spring Boot', category: 'Backend', description: 'Part of my Java backend development toolkit, alongside Spring MVC and REST APIs.', column: 3, row: 0 },
    { name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript for full-stack projects, including StockVision AI, Finova AI, and BallotBridge.', column: 0, row: 1 },
    { name: 'MySQL', category: 'Database', description: 'Relational data storage in my toolkit, including the Java and JDBC stack used in DevStack Hub.', column: 1, row: 1 },
    { name: 'MongoDB', category: 'Database', description: 'Document-based storage in StockVision AI, Finova AI, and BallotBridge.', column: 2, row: 1 },
    { name: 'Docker', category: 'Developer tools', description: 'Part of my development toolkit, alongside Git, GitHub, Vercel, and Render.', column: 3, row: 1 },
  ],
  stack: [
    { category: 'Languages', items: ['Java', 'Python', 'JavaScript', 'SQL'] },
    { category: 'Frontend', items: ['React', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Spring Boot', 'Spring MVC', 'REST APIs', 'Node.js', 'Express.js'] },
    { category: 'Databases', items: ['MySQL', 'MongoDB'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Render'] },
  ],
  // Unverified records are editable placeholders, not published employment claims.
  experience: [{ organization: 'KodNest', role: 'Java & Full-Stack Training', period: '', verified: false, summary: 'Java, full-stack development, backend development, databases, practical application development, and problem solving.' }],
  certifications: [
    { title: 'Java Full Stack / AI Training', issuer: 'KodNest', date: '', url: '', verified: false },
    { title: 'Vibeathon Achievement', issuer: 'Replit', date: '', url: '', verified: false },
    { title: 'AI / Database Certification', issuer: '', date: '', url: '', verified: false },
  ],
};


