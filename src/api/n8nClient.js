import { mockClasses } from '../data/mockClasses';

// TODO: Replace with actual n8n Webhook URLs
// const API_BASE_URL = "YOUR_N8N_WEBHOOK_URL";

export const fetchClasses = async () => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockClasses);
        }, 800);
    });
};

export const getAIRecommendation = async (userGoal) => {
    // Simulate AI processing delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple keyword matching for demo purposes
            const lowerGoal = userGoal.toLowerCase();
            const recommendations = mockClasses.filter(c =>
                c.goals.some(g => lowerGoal.includes(g)) ||
                c.description.toLowerCase().includes(lowerGoal) ||
                c.title.toLowerCase().includes(lowerGoal)
            );

            resolve(recommendations.length > 0 ? recommendations : [mockClasses[0], mockClasses[2]]);
        }, 1500);
    });
};

export const bookClass = async (bookingDetails) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Booking confirmed:", bookingDetails);
            resolve({ success: true, message: "Booking confirmed! Check your email." });
        }, 1000);
    });
};
