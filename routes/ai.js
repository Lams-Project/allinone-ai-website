import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// Chat with AI
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, model } = req.body;

    let response;

    switch(model) {
      case 'gemini':
        try {
          response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
              contents: [{ role: 'user', parts: [{ text: message }] }]
            },
            {
              headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
            }
          );
          return res.json({ response: response.data });
        } catch (error) {
          return res.status(500).json({ error: 'Gemini API error: ' + error.message });
        }
      
      case 'gpt':
        try {
          response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: message }]
            },
            {
              headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
            }
          );
          return res.json({ response: response.data });
        } catch (error) {
          return res.status(500).json({ error: 'GPT API error: ' + error.message });
        }

      case 'claude':
        try {
          response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
              model: 'claude-3-sonnet-20240229',
              max_tokens: 1024,
              messages: [{ role: 'user', content: message }]
            },
            {
              headers: {
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
              }
            }
          );
          return res.json({ response: response.data });
        } catch (error) {
          return res.status(500).json({ error: 'Claude API error: ' + error.message });
        }

      case 'deepseek':
        try {
          response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: message }]
            },
            {
              headers: { 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` }
            }
          );
          return res.json({ response: response.data });
        } catch (error) {
          return res.status(500).json({ error: 'Deepseek API error: ' + error.message });
        }

      case 'grok':
        try {
          response = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
              model: 'grok-beta',
              messages: [{ role: 'user', content: message }]
            },
            {
              headers: { 'Authorization': `Bearer ${process.env.GROK_API_KEY}` }
            }
          );
          return res.json({ response: response.data });
        } catch (error) {
          return res.status(500).json({ error: 'Grok API error: ' + error.message });
        }

      default:
        return res.status(400).json({ error: 'Invalid model' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Photo Enhancement
router.post('/enhance-photo', verifyToken, async (req, res) => {
  try {
    const { imageUrl, type } = req.body;
    res.json({ message: 'Photo enhancement initiated', type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Picture to Prompt
router.post('/image-to-prompt', verifyToken, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
      {
        contents: [{
          parts: [
            { text: 'Generate a detailed prompt for image generation based on this image. Be specific and descriptive.' },
            { inline_data: { mime_type: 'image/jpeg', data: imageUrl } }
          ]
        }]
      },
      {
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
      }
    );

    res.json({ prompt: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Video Enhancement
router.post('/enhance-video', verifyToken, async (req, res) => {
  try {
    const { videoUrl, type } = req.body;
    res.json({ message: 'Video enhancement initiated', type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
