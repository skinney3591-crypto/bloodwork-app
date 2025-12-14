/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'markr-blue': '#2563EB',
        'clarity-white': '#FFFFFF',
        'deep-ink': '#1E293B',
        // Secondary Colors
        'success-green': '#10B981',
        'alert-amber': '#F59E0B',
        'soft-red': '#EF4444',
        // Neutral Tones
        'gray-50': '#F9FAFB',
        'gray-400': '#9CA3AF',
        'gray-700': '#374151',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [],
}
