const { db, User, Project, Update, Inspection } = require('./index');
const bcrypt = require('bcrypt');

async function seedDatabase() {
    try {
        await db.sync({ force: true });
        console.log('Database reset successfully.');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.bulkCreate([
            {
                name: 'Eugene Lotsu',
                email: 'lotsueugene@gmail.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'Kwame Mensah',
                email: 'kwame@example.com',
                password: hashedPassword,
                role: 'client'
            },
            {
                name: 'Adjoa Boateng',
                email: 'adjoa@example.com',
                password: hashedPassword,
                role: 'client'
            },
            {
                name: 'Ama Serwaa',
                email: 'ama@example.com',
                password: hashedPassword,
                role: 'contractor'
            },
            {
                name: 'Yaw Owusu',
                email: 'yaw@example.com',
                password: hashedPassword,
                role: 'contractor'
            },
            {
                name: 'Kofi Asante',
                email: 'kofi@example.com',
                password: hashedPassword,
                role: 'inspector'
            }
        ]);

        const projects = await Project.bulkCreate([
            {
                title: '3-Bedroom House Build',
                description: 'Construction of a 3-bedroom house in East Legon',
                location: 'East Legon, Accra',
                startDate: new Date('2026-01-15'),
                status: 'ongoing',
                clientId: users[1].id,
                contractorId: users[3].id
            },
            {
                title: 'Retail Shop Fit-Out',
                description: 'Interior build-out for retail unit',
                location: 'Kumasi Central Market',
                startDate: new Date('2026-02-01'),
                status: 'ongoing',
                clientId: users[2].id,
                contractorId: users[4].id
            },
            {
                title: 'Office Renovation',
                description: 'Full interior renovation of office building',
                location: 'Osu, Accra',
                startDate: new Date('2025-11-10'),
                status: 'paused',
                clientId: users[1].id,
                contractorId: users[4].id
            }
        ]);

        const updates = await Update.bulkCreate([
            {
                description: 'Foundation completed and cured',
                mediaUrl: 'https://example.com/photos/foundation.jpg',
                status: 'verified',
                projectId: projects[0].id,
                userId: users[3].id
            },
            {
                description: 'Roofing materials delivered to site',
                mediaUrl: 'https://example.com/photos/roofing.jpg',
                status: 'pending',
                projectId: projects[0].id,
                userId: users[3].id
            },
            {
                description: 'Shop partition framing complete',
                mediaUrl: null,
                status: 'pending',
                projectId: projects[1].id,
                userId: users[4].id
            },
            {
                description: 'Electrical rough-in started',
                mediaUrl: null,
                status: 'pending',
                projectId: projects[2].id,
                userId: users[4].id
            }
        ]);

        await Inspection.bulkCreate([
            {
                status: 'verified',
                comments: 'Foundation meets structural requirements',
                inspectionDate: new Date('2026-02-10'),
                projectId: projects[0].id,
                inspectorId: users[5].id,
                updateId: updates[0].id
            },
            {
                status: 'rejected',
                comments: 'Framing photos incomplete; resubmit with weld close-ups',
                inspectionDate: new Date('2026-03-05'),
                projectId: projects[1].id,
                inspectorId: users[5].id,
                updateId: updates[2].id
            },
            {
                status: 'verified',
                comments: 'Rough-in routing acceptable; label circuits before drywall',
                inspectionDate: new Date('2026-03-20'),
                projectId: projects[2].id,
                inspectorId: users[5].id,
                updateId: updates[3].id
            }
        ]);

        console.log('Database seeded successfully!');
        console.log('All passwords: password123');
        console.log('Users:');
        console.log('- admin@example.com (admin)');
        console.log('- kwame@example.com (client)');
        console.log('- adjoa@example.com (client)');
        console.log('- ama@example.com (contractor)');
        console.log('- yaw@example.com (contractor)');
        console.log('- kofi@example.com (inspector)');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await db.close();
    }
}

seedDatabase();
