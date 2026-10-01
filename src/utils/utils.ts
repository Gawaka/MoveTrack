
export default function formatTime(totalSeconds: number) {
        const validSeconds = Math.max(0, Math.floor(totalSeconds));

        const hours = Math.floor(validSeconds / 3600);
        const minutes = Math.floor((validSeconds % 3600) / 60);
        const seconds = validSeconds % 60;

        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        if (hours > 0) {
            return `${hours}:${paddedMinutes}:${paddedSeconds}`;
        }

        return `${paddedMinutes}:${paddedSeconds}`;
    };