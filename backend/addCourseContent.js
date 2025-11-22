const mongoose = require('mongoose');
const Course = require('./models/course');
const Section = require('./models/section');
const SubSection = require('./models/subSection');

mongoose.connect('mongodb://localhost:27017/7')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Sample YouTube video URLs for different courses
        const courseContentData = {
            'JavaScript': [
                {
                    sectionName: 'Introduction to JavaScript',
                    lectures: [
                        { title: 'What is JavaScript?', description: 'Learn about JavaScript basics', videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: 600 },
                        { title: 'Variables and Data Types', description: 'Understanding JavaScript variables', videoUrl: 'https://www.youtube.com/watch?v=JcNPtQ3xrIY', duration: 720 },
                        { title: 'Functions in JavaScript', description: 'Master JavaScript functions', videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ', duration: 900 }
                    ]
                },
                {
                    sectionName: 'Advanced JavaScript Concepts',
                    lectures: [
                        { title: 'Closures and Scope', description: 'Deep dive into closures', videoUrl: 'https://www.youtube.com/watch?v=3a0I8ICR1Vg', duration: 840 },
                        { title: 'Async/Await', description: 'Asynchronous JavaScript', videoUrl: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU', duration: 1020 }
                    ]
                }
            ],
            'React': [
                {
                    sectionName: 'React Fundamentals',
                    lectures: [
                        { title: 'Introduction to React', description: 'Getting started with React', videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPg', duration: 900 },
                        { title: 'Components and Props', description: 'React components explained', videoUrl: 'https://www.youtube.com/watch?v=xe-_D-DCtSU', duration: 720 },
                        { title: 'State and Hooks', description: 'Managing state in React', videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0', duration: 960 }
                    ]
                }
            ],
            'Python': [
                {
                    sectionName: 'Python Basics',
                    lectures: [
                        { title: 'Python Introduction', description: 'Get started with Python', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 600 },
                        { title: 'Python Data Structures', description: 'Lists, tuples, and dictionaries', videoUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc', duration: 840 },
                        { title: 'Python Functions', description: 'Functions and modules', videoUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', duration: 720 }
                    ]
                }
            ],
            'Node': [
                {
                    sectionName: 'Node.js Fundamentals',
                    lectures: [
                        { title: 'What is Node.js?', description: 'Introduction to Node.js', videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', duration: 600 },
                        { title: 'Express.js Basics', description: 'Building APIs with Express', videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE', duration: 900 }
                    ]
                }
            ],
            'MongoDB': [
                {
                    sectionName: 'MongoDB Essentials',
                    lectures: [
                        { title: 'MongoDB Introduction', description: 'NoSQL database basics', videoUrl: 'https://www.youtube.com/watch?v=-56x56UppqQ', duration: 720 },
                        { title: 'CRUD Operations', description: 'Create, Read, Update, Delete', videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU', duration: 840 }
                    ]
                }
            ],
            'Full Stack': [
                {
                    sectionName: 'Full Stack Development',
                    lectures: [
                        { title: 'Full Stack Overview', description: 'Complete web development', videoUrl: 'https://www.youtube.com/watch?v=nu_pCVPKzTk', duration: 900 },
                        { title: 'MERN Stack', description: 'MongoDB, Express, React, Node', videoUrl: 'https://www.youtube.com/watch?v=fnpmR6Q5lEc', duration: 1200 }
                    ]
                }
            ]
        };

        const courses = await Course.find();
        console.log(`Found ${courses.length} courses`);

        for (const course of courses) {
            console.log(`\nProcessing course: ${course.courseName}`);

            // Find matching content based on course name
            let contentKey = Object.keys(courseContentData).find(key => 
                course.courseName.toLowerCase().includes(key.toLowerCase())
            );

            if (!contentKey) {
                console.log(`No content template found for ${course.courseName}, skipping...`);
                continue;
            }

            const sectionsData = courseContentData[contentKey];
            const sectionIds = [];

            for (const sectionData of sectionsData) {
                // Create subsections
                const subSectionIds = [];
                for (const lecture of sectionData.lectures) {
                    const subSection = new SubSection({
                        title: lecture.title,
                        description: lecture.description,
                        videoUrl: lecture.videoUrl,
                        youtubeUrl: lecture.videoUrl,
                        timeDuration: lecture.duration
                    });
                    await subSection.save();
                    subSectionIds.push(subSection._id);
                    console.log(`  Created subsection: ${lecture.title}`);
                }

                // Create section with subsections
                const section = new Section({
                    sectionName: sectionData.sectionName,
                    subSection: subSectionIds
                });
                await section.save();
                sectionIds.push(section._id);
                console.log(`Created section: ${sectionData.sectionName}`);
            }

            // Update course with sections
            course.courseContent = sectionIds;
            await course.save();
            console.log(`✅ Updated course: ${course.courseName} with ${sectionIds.length} sections`);
        }

        console.log('\n✅ All courses updated with video content!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
