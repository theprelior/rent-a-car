module.exports = {
  apps: [
    {
      name: 'rent-a-car',
      // 'npm start' yerine doğrudan Next.js'i çalıştırıyoruz
      script: 'node_modules/next/bin/next',
      args: 'start',
      // Çalıştırılacak kullanıcıyı burada net olarak belirtiyoruz
      user: 'nginx',
      // Ortamın 'production' olduğunu belirtiyoruz
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};