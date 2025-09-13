module.exports = {
  apps: [
    {
      name: 'i18n-api',
      script: './server',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',

      // 环境配置
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // 进程管理
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

      // 集群模式配置（可选）
      // instances: 'max',
      // exec_mode: 'cluster',
    },
  ],
}
