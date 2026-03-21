import { Server } from 'http';

import { closeDB } from '../db/db.js';

export const setupGracefulShutdown = (server: Server) => {
  const handleShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal} signal. Shutting down gracefully...`);

    const forceShutdownTimeout = setTimeout(() => {
      console.log(
        '\u26A0\uFE0F Server failed to close in time, forcing shutdown'
      );
      process.exit(1);
    }, 5000);

    try {
      await closeDB();

      server.close(() => {
        clearTimeout(forceShutdownTimeout);
        console.log('💤 Server shut down successfully');
        process.exit(0);
      });
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  ['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, (signal: string) => {
      void handleShutdown(signal);
    });
  });
};
