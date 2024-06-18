const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoles() {
  console.log('Seeding roles into database...');

  const roles = [];

  fs.createReadStream('prisma/data/roles.csv')
    .pipe(csv())
    .on('data', (row) => {
      roles.push(row['Role']);
    })
    .on('end', async () => {
      try {
        for (const role of roles) {
          await prisma.Role.create({
            data: {
              role: role,
            },
          });
        }

        console.log(`Seeded ${roles.length} roles successfully!`);
      } catch (error) {
        console.error('Error seeding roles:', error);
      }
    });
}

async function seedModules() {
  console.log('Seeding modules into database...');

  const uniqueModules = new Set();

  fs.createReadStream('prisma/data/modules.csv')
    .pipe(csv())
    .on('data', (row) => {
      const course = row['Course_Learning_Material'];
      const courseLevel = row['Course_Level'];
      const module = row['Module'];
      const difficultyLevel = row['Difficulty_Level'];

      const moduleKey = `${course}-${courseLevel}-${module}-${difficultyLevel}`;
      if (!uniqueModules.has(moduleKey)) {
        uniqueModules.add(moduleKey);

        prisma.CourseLevel.create({
          data: { courseLevel }
        }).then((createdCourseLevel) => {
          prisma.Course.create({
            data: {
              course: course,
              courseLevelId: createdCourseLevel.id
            }
          }).then((createdCourse) => {
            prisma.DifficultyLevel.create({
              data: { difficultyLevel }
            }).then((createdDifficultyLevel) => {
              prisma.Module.create({
                data: {
                  module,
                  link: row['Links'],
                  difficultyLevelId: createdDifficultyLevel.id,
                  courseId: createdCourse.id
                }
              });
            });
          });
        });
      }
    })
    .on('end', async () => {
      console.log(`Seeded ${uniqueModules.size} modules successfully!`);
    });
}

async function main() {
  await seedRoles();
  await seedModules();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error in main function:', error);
});