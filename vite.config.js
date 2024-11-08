import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '192.168.1.46', // Replace with your IP address, e.g., '192.168.1.100'
        port: 5000, // Or any port you prefer
        hmr: {
            host: '192.168.1.46', // This is often necessary for hot module replacement
        },
    },
});
