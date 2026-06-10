import js from "@eslint/js";
import globals from "globals";


export default [

    // Global ignores — never lint third-party libs or build artifacts
    {
        ignores: ["js/libs/**", "node_modules/**"]
    },

    // ESLint's built-in recommended rules (baseline bug prevention)
    js.configs.recommended,

    // Browser game code — ES modules served directly to the browser
    {
        files: ["js/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                // Third-party libraries loaded as global <script> tags in index.htm
                "Howl": "readonly",
                "Howler": "readonly",
                "Offset": "readonly",
            }
        },
        rules: {

            // --- Bug prevention (errors) ---
            // These catch real problems; fix before committing.
            "curly": ["error", "all"],
            "no-var": "error",
            "eqeqeq": "error",
            "no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "no-undef": "error",
            "no-constant-condition": "error",
            "no-unreachable": "error",

            // --- Downgraded from recommended (tracked in backlog, not blocking) ---
            // CLN-6: Replace options.hasOwnProperty(x) with Object.hasOwn(options, x)
            "no-prototype-builtins": "warn",

            // --- Style (warnings) ---
            // Enforced for consistency but won't block the game from running.
            // See docs/style.md for the rationale behind each rule.
            "indent": ["warn", 4, { "SwitchCase": 1 }],
            "quotes": ["warn", "double", { "avoidEscape": true }],
            "semi": ["warn", "always"],
            "no-trailing-spaces": "warn",
            "no-multiple-empty-lines": ["warn", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
            "space-before-blocks": "warn",
            "brace-style": ["warn", "1tbs"],
            "prefer-const": "warn",
            "keyword-spacing": ["warn", { "before": true, "after": true }],
            "key-spacing": "warn",
        }
    },

    // Node.js dev server — CommonJS, no browser globals
    {
        files: ["nodeServer.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            }
        },
        rules: {
            "no-var": "error",
            "eqeqeq": "error",
        }
    }

];
