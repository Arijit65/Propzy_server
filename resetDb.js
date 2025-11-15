const { sequelize } = require('./models');

const resetDatabase = async () => {
  try {
    console.log('🔄 Dropping all tables...');
    await sequelize.drop();
    console.log('✅ Tables dropped successfully');

    console.log('🔄 Syncing database schema...');
    await sequelize.sync();
    console.log('✅ Database schema synced successfully');

    console.log('🎉 Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
