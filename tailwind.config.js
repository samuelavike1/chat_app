import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            screens:{
                xs:"420px",
                sm:"680px",
                md:"768px",
                lg:"1024px",
                xl:"1280px",
                "2xl":"1280px",
            }
        },
    },

    plugins: [forms, require('daisyui'),],

    daisyui: {
        themes: ["dark"], // false: only light + dark | true: all themes | array: specific themes like this ["light",
        // "dark", "cupcake"]
    },
};
