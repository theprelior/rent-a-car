//next.config.js

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        // Loader'ı "custom" olarak ayarlıyoruz.
        loader: 'custom',
    },
};

export default config;
