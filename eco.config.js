module.exports = {
  apps: [
    /*
    {
      name: "HUB_Blogger",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Blogger"
    },
    */
    {
      name: "HUB_Logger",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Logger"
    },
    {
      name: "HUB_Counter",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Counter"
    },
    {
      name: "HUB_Guard_1",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Guard_1"
    },
    {
      name: "HUB_Guard_2",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Guard_2"
    },
    {
      name: "HUB_Guard_3",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Guard_3"
    },
    {
      name: "HUB_Guard_4",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Guard_4"
    },
    {
      name: "HUB_Guard_5",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Guard_5"
    },
    {
      name: "HUB_Registry",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Registry"
    },
    {
      name: "HUB_Stat",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Stat"
    },
    {
      name: "HUB_Moderator",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/Moderator"
    },
    {
      name: "HUB_Welcome",
      script: 'index.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./INTERNAL/BOTS/_Welcome"
    }
  ]
};
