import axios from 'axios';

export async function sendUsage() {
    try {
        const response = await axios.post('https://api.telemetry.yomenu.app/usage', {});
        return response.data;
    } catch (error) {
        console.error(error);
    }
}