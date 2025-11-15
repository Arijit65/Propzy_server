const { sequelize } = require('./models');

const removeConstraint = async () => {
  try {
    console.log('🔄 Connecting to database...');
    
    // First, try to drop the foreign key constraint
    console.log('🔄 Dropping foreign key constraint...');
    await sequelize.query('ALTER TABLE "Properties" DROP CONSTRAINT IF EXISTS "Properties_userId_fkey"');
    console.log('✅ Foreign key constraint dropped');

    console.log('🎉 Database constraint removal complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

removeConstraint();
