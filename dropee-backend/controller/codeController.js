const CodeModel = require('../model/codeModel');
const HistoryModel = require('../model/historyModel');

const createSnippet = async (req, res) => {
  try {
    const { title, text, language, userId } = req.body;

    if (!title || !text || !userId) {
      return res.status(400).json({ status: 400, message: 'title, text, and userId are required' });
    }

    const snippet = new CodeModel({ title, text, language: language || 'Plain Text', userId });
    await snippet.save();

    // Save to history
    await new HistoryModel({
      userId,
      type: 'code',
      refId: snippet._id.toString(),
      title,
    }).save();

    return res.status(200).json({ status: 200, id: snippet._id, message: 'Snippet created successfully' });
  } catch (err) {
    console.error('Create snippet error:', err);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

const getSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await CodeModel.findById(id);

    if (!snippet) {
      return res.status(404).json({ status: 404, message: 'Snippet not found or expired' });
    }

    return res.status(200).json({ status: 200, snippet });
  } catch (err) {
    console.error('Get snippet error:', err);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

module.exports = { createSnippet, getSnippet };
