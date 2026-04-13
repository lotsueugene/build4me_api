const { db, User, Project, Update, Inspection } = require('./index');

async function seedDatabase() {
    try {
        await db.sync({ force: true });
        console.log('Database reset successfully.');

        // Create sample users
        const users = await User.bulkCreate([
            {
                name: 'Kwame Mensah',
                email: 'kwame@example.com',
                password: 'password123',
                role: 'client'
            },
            {
                name: 'Ama Serwaa',
                email: 'ama@example.com',
                password: 'password123',
                role: 'contractor'
            },
            {
                name: 'Kofi Asante',
                email: 'kofi@example.com',
                password: 'password123',
                role: 'inspector'
            }
        ]);

        // Create sample projects
        const projects = await Project.bulkCreate([
            {
                title: '3-Bedroom House Build',
                description: 'Construction of a 3-bedroom house in East Legon',
                location: 'East Legon, Accra',
                startDate: new Date('2026-01-15'),
                status: 'ongoing',
                clientId: users[0].id,
                contractorId: users[1].id
            },
            {
                title: 'Warehouse Extension',
                description: 'Extending existing warehouse with new storage wing',
                location: 'Tema Industrial Area',
                startDate: new Date('2026-03-01'),
                status: 'ongoing',
                clientId: users[0].id,
                contractorId: users[1].id
            },
            {
                title: 'Office Renovation',
                description: 'Full interior renovation of office building',
                location: 'Osu, Accra',
                startDate: new Date('2025-11-10'),
                status: 'completed',
                clientId: users[0].id,
                contractorId: users[1].id
            }
        ]);

        // Create sample updates
        const updates = await Update.bulkCreate([
            {
                description: 'Foundation completed and cured',
                mediaUrl: 'https://example.com/photos/foundation.jpg',
                status: 'verified',
                projectId: projects[0].id,
                userId: users[1].id
            },
            {
                description: 'Roofing materials delivered to site',
                mediaUrl: 'https://example.com/photos/roofing.jpg',
                status: 'pending',
                projectId: projects[0].id,
                userId: users[1].id
            },
            {
                description: 'Warehouse steel frame erected',
                mediaUrl: null,
                status: 'pending',
                projectId: projects[1].id,
                userId: users[1].id
            }
        ]);

        // Create sample inspections
        await Inspection.bulkCreate([
            {
                status: 'verified',
                comments: 'Foundation meets structural requirements',
                inspectionDate: new Date('2026-02-10'),
                projectId: projects[0].id,
                inspectorId: users[2].id,
                updateId: updates[0].id
            },
            {
                status: 'rejected',
                comments: 'Steel frame welds need reinforcement',
                inspectionDate: new Date('2026-04-01'),
                projectId: projects[1].id,
                inspectorId: users[2].id,
                updateId: updates[2].id
            }
        ]);

        console.log('Database seeded successfully!');
        console.log('Sample users created:');
        console.log('- kwame@example.com (client)');
        console.log('- ama@example.com (contractor)');
        console.log('- kofi@example.com (inspector)');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await db.close();
    }
}

seedDatabase();