const { prisma } = require("../prisma")
const bcrypt = require('bcrypt')

async function registerUserHandler(req, res) {
    const { name, email, password, weight, age, eatEachDay, foodPreference, goal } = req.body;

    if (!name || !email || !password || !weight || !age || !eatEachDay || !foodPreference || !goal) {
        return res.status(400).json({ status: 'Failed', message: 'Please fill all of the required fields' });
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await prisma.$transaction(async (prisma) => {
            let food_preference = await prisma.food_preference.findFirst({
                where: { name: foodPreference }
            });

            if (!food_preference) {
                food_preference = await prisma.food_preference.create({
                    data: { name: foodPreference }
                });
            }

            let goalData = await prisma.Goal.findFirst({
                where: { name: goal }
            });

            if (!goalData) {
                goalData = await prisma.Goal.create({
                    data: { name: goal }
                });
            }

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    weight,
                    age,
                    eatEachDay,
                    foodPreferenceId: food_preference.ID,
                    goalId: goalData.ID
                }
            });

            const data = {
                ID: user.ID,
                email: user.email,
                name: user.name,
                age: user.age,
                weight: user.weight,
                foodPreference: food_preference.name,
                goal: goalData.name
            }

            return data
        });

        res.status(201).json({
            status: 'Success',
            message: 'User register successful',
            data: result
        });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({
                status: 'Failed',
                message: 'Email has been taken, please select another email'
            });
        } else {
            console.error('Error:', error);
            res.status(500).json({ status: 'Failed', message: 'Failed to create user' });
        }
    }
}




async function editUserHandler(req, res) {
    const { name, weight, age, eatEachDay, foodPreference, goal } = req.body;
    const { userId } = req.params

    try {
        const foodPref = await prisma.food_preference.findFirst({
            where: { name: foodPreference }
        })

        if (!foodPref) {
            await prisma.food_preference.create({
                data: {
                    name: foodPreference
                }
            })
        }

        const goalPref = await prisma.goal.findFirst({
            where: { name: goal }
        })

        if (!goalPref) {
            await prisma.goal.create({
                data: {
                    name: goal
                }
            })
        }

        const updatedUser = await prisma.user.update({
            where: { ID: userId },
            data: {
                name,
                weight,
                age,
                eatEachDay,
                foodPreferenceId: foodPref.ID,
                goalId: goalPref.ID
            }
        });

        const data = {
            ID: updatedUser.ID,
            email: updatedUser.email,
            name: updatedUser.name,
            age: updatedUser.age,
            weight: updatedUser.weight,
            foodPreference: foodPref.name,
            goal: goalPref.name
        }
        res.status(200).json({
            status: 'Success',
            message: 'User data has been successfully changed',
            data: data
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ status: 'Failed', message: 'User not found' });
        }
        console.error('Error:', error);
        res.status(500).json({ status: 'Failed', message: 'Failed to edit user information' });
    }

}


async function getSpesificUserHandler(req, res) {
    const { userId } = req.params

    try {
        const User = await prisma.user.findFirst({
            where: {
                ID: userId
            },
            include: {
                food_preference: true,
                goal: true
            }
        })

        if (!User) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            })
        }

        res.status(200).json({
            status: "Success",
            message: "User Information successfully retrieve",
            data: {
                ID: User.ID,
                name: User.name,
                email: User.email,
                weight: User.weight,
                age: User.age,
                eatEachDay: User.eatEachDay,
                foodPreference: User.food_preference.name,
                goal: User.goal.name
            }
        })
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({
            status: 'Failed', message: 'Failed to retrieve user information'
        })
    }
}


module.exports = { registerUserHandler, editUserHandler, getSpesificUserHandler }