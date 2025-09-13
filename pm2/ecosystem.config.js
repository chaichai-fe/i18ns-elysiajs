module.exports = {
  apps: [
    {
      name: 'i18n-api',
      script: './server',
      cwd: '/Users/chaipeng/Desktop/i18ns-elysiajs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // 进程管理配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',

      // 健康检查
      health_check_grace_period: 3000,

      // 环境变量文件
      env_file: '.env',
    },
  ],
}
