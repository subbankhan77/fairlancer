export const menuConfig = {
    admin: {
        manage: [
            {
                id: 1,
                name: "Dashboard",
                icon: "flaticon-home",
                path: "/dashboard",
            },
            // users
            {
                id: 10,
                name: "Manage Users",
                icon: "flaticon-user",
                path: "/users",
            },
            // projects
            {
                id: 11,
                name: "Manage Project",
                icon: "flaticon-content",
                path: "/projects",
            },
            // reviews
            {
                id: 12,
                name: "Manage Reviews",
                icon: "flaticon-presentation",
                path: "/reviews",
            },
            // payments
            {
                id: 13,
                name: "Manage Payments",
                icon: "flaticon-receipt",
                path: "/payments",
            },
        ],
        account: [
            {
                id: 1,
                name: "My Profile",
                icon: "flaticon-photo",
                path: "/my-profile",
            },
            {
                id: 2,
                name: "Logout",
                icon: "flaticon-logout",
                path: "/sign-out",
            }
        ]
    },
    client: {
        manage: [
            {
                id: 1,
                name: "Dashboard",
                icon: "flaticon-home",
                path: "/dashboard",
            },
            // manage projects
            {
                id: 2,
                name: "Manage Projects",
                icon: "flaticon-content",
                path: "/projects",
            },
            // reviews
            {
                id: 3,
                name: "Manage Reviews",
                icon: "flaticon-presentation",
                path: "/reviews",
            }
        ],
        account: [
            {
                id: 1,
                name: "My Profile",
                icon: "flaticon-photo",
                path: "/my-profile",
            },
            {
                id: 2,
                name: "Logout",
                icon: "flaticon-logout",
                path: "/sign-out",
            }
        ]
    },
    freelancer: {
        manage: [
            {
                id: 1,
                name: "Dashboard",
                icon: "flaticon-home",
                path: "/dashboard",
            },
            // proposals
            {
                id: 2,
                name: "My Proposals",
                icon: "flaticon-document",
                path: "/proposals",
            },
            // projects
            {
                id: 3,
                name: "Find Projects",
                icon: "flaticon-search",
                path: "/projects",
            }
        ],
        account: [
            {
                id: 1,
                name: "My Profile",
                icon: "flaticon-photo",
                path: "/my-profile",
            },
            {
                id: 2,
                name: "Logout",
                icon: "flaticon-logout",
                path: "/sign-out",
            }
        ]
    }
};