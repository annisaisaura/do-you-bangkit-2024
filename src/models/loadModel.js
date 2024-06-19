const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        const model = await tf.loadLayersModel(process.env.MODEL_CAREER_URL);
        return model;
    } catch (error) {
        throw new Error('Failed to load Career Model');
    }
}

module.exports = loadModel;