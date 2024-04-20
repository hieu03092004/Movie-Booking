const menu = [
  {
    id: 1,
    title: "main",
    listItems: [
      {
        id: 1,
        title: "Homepage",
        url: "/admin",
        icon: "/images/admin_img/home.svg",
      },
      {
        id: 2,
        title: "Profile",
        url: "/admin/users/1",
        icon: "/images/admin_img/user.svg",
      },
    ],
  },
  {
    id: 2,
    title: "lists",
    listItems: [
      {
        id: 1,
        title: "Users",
        url: "/admin/users",
        icon: "/images/admin_img/user.svg",
      },
      {
        id: 2,
        title: "Movies",
        url: "/admin/movies",
        icon: "/images/admin_img/movie.svg",
      },
      {
        id: 3,
        title: "Tickets",
        url: "/admin/tickets",
        icon: "/images/admin_img/ticket.svg",
      },
      {
        id: 4,
        title: "Posts",
        url: "/admin/posts",
        icon: "/images/admin_img/post.svg",
      },
    ],
  },
  {
    id: 3,
    title: "Maintenance",
    listItems: [
      {
        id: 1,
        title: "Settings",
        url: "/admin",
        icon: "/images/admin_img/setting.svg",
      },
      {
        id: 2,
        title: "Backups",
        url: "/admin",
        icon: "/images/admin_img/backup.svg",
      },
    ],
  },
  {
    id: 4,
    title: "analytics",
    listItems: [
      {
        id: 1,
        title: "Charts",
        url: "/admin",
        icon: "/images/admin_img/chart.svg",
      },
      {
        id: 2,
        title: "Logs",
        url: "/admin",
        icon: "/images/admin_img/log.svg",
      },
    ],
  },
  {
    id: 5,
    title: "logout",
    listItems: [
      {
        id: 1,
        title: "Logout",
        url: "/user/logout",
        icon: "/images/admin_img/logout.svg",
      },
    ],
  },
];

module.exports = menu;
