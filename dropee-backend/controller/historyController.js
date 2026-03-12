const HistoryModel = require('../model/historyModel');
const { getFrontendBaseUrl } = require('../utils/url');

const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ status: 400, message: 'userId is required' });
    }

    const history = await HistoryModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    const frontendBaseUrl = getFrontendBaseUrl(req);

    const historyWithLinks = history.map((entry) => ({
      _id: entry._id,
      type: entry.type,
      title: entry.title,
      createdAt: entry.createdAt,
      link:
        entry.type === 'file'
          ? `${frontendBaseUrl}/${entry.refId}`
          : `${frontendBaseUrl}/snippet/${entry.refId}`,
    }));

    return res.status(200).json({ status: 200, history: historyWithLinks });
  } catch (err) {
    console.error('Get history error:', err);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

module.exports = { getHistory };
