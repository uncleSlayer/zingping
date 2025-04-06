/**
 * Application route configuration
 */

const _routes = {

    /**
     * Protected routes requiring authentication
     */

    protected: {

        /**
         * Friend-related protected routes
         * - friend/add - Add a new friend
         * - friend/get/all - Get all friends
         * - friend/request/status - Get friend requests filtered by status
         * - friend/respond - Respond to friend requests
         */

        friend: [
            "/friend/add",
            "/friend/get/all",
            "/friend/request/pending",
            "/friend/respond"
        ],

    },

    /**
     * Public routes accessible without authentication
     */

    public: {

        /**
         * Authentication-related public routes
         * - auth/login - User login
         * - auth/register - New user registration
         */

        auth: [
            "/auth/login",
            "/auth/register"
        ],
    }
};

/**
 * Frozen route configuration object
 */

export const ROUTES_CONFIG = Object.freeze(_routes);