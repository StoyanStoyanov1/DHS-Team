/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
    	extend: {
    		colors: {
    			blue: {
    				'50': '#eff6ff',
    				'100': '#dbeafe',
    				'200': '#bfdbfe',
    				'300': '#93c5fd',
    				'400': '#60a5fa',
    				'500': '#4361ee',
    				'600': '#3a56d4',
    				'700': '#1d4ed8',
    				'800': '#1e40af',
    				'900': '#1e3a8a',
    				'950': '#172554'
    			},
    			gray: {
    				'50': '#f9fafb',
    				'100': '#f3f4f6',
    				'200': '#e5e7eb',
    				'300': '#d1d5db',
    				'400': '#9ca3af',
    				'500': '#6b7280',
    				'600': '#4b5563',
    				'700': '#374151',
    				'800': '#1f2937',
    				'900': '#111827',
    				'950': '#030712'
    			},
    			purple: {
    				'50': '#faf5ff',
    				'100': '#f3e8ff',
    				'500': '#8b5cf6',
    				'600': '#7c3aed'
    			},
    			green: {
    				'50': '#f0fdf4',
    				'100': '#dcfce7',
    				'500': '#22c55e',
    				'600': '#16a34a'
    			},
    			red: {
    				'50': '#fef2f2',
    				'100': '#fee2e2',
    				'500': '#ef4444',
    				'600': '#dc2626'
    			},
    			yellow: {
    				'50': '#fffbeb',
    				'100': '#fef3c7',
    				'500': '#eab308',
    				'600': '#ca8a04'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		boxShadow: {
    			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			xl: '0.75rem',
    			'2xl': '1rem',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		animation: {
    			'fade-in': 'fade-in 0.3s ease-in-out',
    			'slide-in': 'slide-in 0.3s ease-in-out'
    		},
    		keyframes: {
    			'fade-in': {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			'slide-in': {
    				'0%': {
    					transform: 'translateX(-10px)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateX(0)',
    					opacity: '1'
    				}
    			}
    		},
    		transitionDuration: {
    			'400': '400ms'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
}