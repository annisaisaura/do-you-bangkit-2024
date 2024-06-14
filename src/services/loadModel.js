const tf = require('@tensorflow/tfjs-node');

async function loadCareerModel() {
    return tf.loadGraphModel(process.env.CAREER_MODEL_URL);
}

module.exports = loadCareerModel;