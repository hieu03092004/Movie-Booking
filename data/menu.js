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
    title: "general",
    listItems: [
      {
        id: 1,
        title: "Elements",
        url: "/admin",
        icon: "/images/admin_img/element.svg",
      },
      {
        id: 2,
        title: "Notes",
        url: "/admin",
        icon: "/images/admin_img/note.svg",
      },
      {
        id: 3,
        title: "Forms",
        url: "/admin",
        icon: "/images/admin_img/form.svg",
      },
      {
        id: 4,
        title: "Calendar",
        url: "/admin",
        icon: "/images/admin_img/calendar.svg",
      },
    ],
  },
  {
    id: 4,
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
    id: 5,
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
];

module.exports = menu;
