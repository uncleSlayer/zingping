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

    friends: {
      friendsAdd: {
        path: "/friend/add",
        name: "Add a new friend",
      },
      friendGetAll: {
        path: "/friend/get/all",
        name: "Get all friends",
      },
      sentFriendRequestPending: {
        path: "/friend/request/pending",
        name: "Get all pending friend requests",
      },
      friendRespond: {
        path: "/friend/respond",
        name: "Respond to friend requests",
      },
      searchNewFriend: {
        path: "/friend/search",
        name: "Search for a new friend",
      } 
    },

    /**
     * - chat/get/all - Get all chats
     */

    chat: {
      chatGetAll: {
        path: "/chat/get/all",
        name: "Get all chats",
      },
    },

    /**
     * - auth/logout - User logout
     */

    auth: {
      authLogout: {
        path: "/auth/logout",
        name: "User logout",
      },
    },
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

    auth: {
      authLogin: {
        path: "/auth/login",
        name: "User login",
      },
      authRegister: {
        path: "/auth/register",
        name: "New user registration",
      },
    },
  },
};

/**
 * Frozen route configuration object
 */

export const ROUTES_CONFIG = Object.freeze(_routes);
