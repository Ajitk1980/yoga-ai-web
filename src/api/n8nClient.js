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

export const fetchClassSchedule = async (classType) => {
    // Mock response for class schedule based on recommended class type
    return new Promise((resolve) => {
        setTimeout(() => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            resolve([
                {
                    id: 'session-1',
                    date: today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: '08:00 AM',
                    instructor: 'Sarah Jenkins',
                    spots: 4,
                    duration: '60 min',
                    location: 'Studio A'
                },
                {
                    id: 'session-2',
                    date: today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: '06:30 PM',
                    instructor: 'Marcus Chen',
                    spots: 2,
                    duration: '75 min',
                    location: 'Studio B'
                },
                {
                    id: 'session-3',
                    date: tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: '07:00 AM',
                    instructor: 'Elara Vane',
                    spots: 8,
                    duration: '60 min',
                    location: 'Garden Pavilion'
                },
                {
                    id: 'session-4',
                    date: tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: '05:00 PM',
                    instructor: 'Sarah Jenkins',
                    spots: 1,
                    duration: '60 min',
                    location: 'Studio A'
                }
            ]);
        }, 1000);
    });
};

export const getAIRecommendation = async (goal) => {
    try {
        const response = await fetch('http://localhost:5678/webhook/webhook/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_goal: goal })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        const data = json.recommendations || [];
        return { data, error: null };
    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        return { data: null, error: error.message };
    }
};

export const bookClass = async (bookingDetails) => {
    // Mock booking success for UI testing
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Mock booking request:', bookingDetails);
            resolve({
                success: true,
                status: 'success',
                message: 'Your spot is reserved! We look forward to seeing you.'
            });
        }, 1500);
    });
};
