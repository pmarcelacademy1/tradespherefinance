const cron = require('node-cron');
const CopyTrade = require('./Model/CopyTrade');

module.exports.startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily profit update cron job');
    try {
      const trades = await CopyTrade.find({ status: 'active' });
      const now = new Date();

      for (let trade of trades) {
        const daysElapsed = (now - trade.startDate) / (24 * 60 * 60 * 1000);
        console.log(`Cron: Updating trade ${trade._id}: Days elapsed = ${daysElapsed.toFixed(2)}, Amount = ${trade.amount}, WinRate = ${trade.winRate}`);

        if (daysElapsed >= trade.duration || now >= new Date(trade.endDate)) {
          trade.status = 'completed';
          console.log(`Cron: Trade ${trade._id} completed`);
        } else {
          const dailyProfit = trade.amount * (trade.winRate / 100 * 0.01);
          const totalProfit = dailyProfit * daysElapsed * (1 - trade.profitShare / 100);
          trade.currentProfit = parseFloat(totalProfit.toFixed(2));
          console.log(`Cron: Trade ${trade._id}: Daily profit = ${dailyProfit.toFixed(2)}, Total profit = ${trade.currentProfit}`);
        }

        try {
          await trade.save();
          console.log(`Cron: Saved trade ${trade._id} with currentProfit = ${trade.currentProfit}`);
        } catch (saveError) {
          console.error(`Cron: Failed to save trade ${trade._id}:`, saveError);
        }
      }
      console.log('Cron job completed');
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
};