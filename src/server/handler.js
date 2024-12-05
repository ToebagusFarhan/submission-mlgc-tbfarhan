const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const getData = require("../services/getData");

const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const postPredictHandler = async (request, h) => {

  const { image } = request.payload;
  const { model } = request.server.app;

  // Convert Readable stream to a buffer
  let imageBuffer;
  try {
    imageBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      image.on('data', chunk => chunks.push(chunk));  // Collect image data chunks
      image.on('end', () => resolve(Buffer.concat(chunks)));  // Once done, concatenate the chunks into a buffer
      image.on('error', reject);  // Reject if there's an error in the stream
    });
  } catch (error) {
    console.error('Error converting stream to buffer:', error);
    throw new InputError('Failed to read image data');
  }

  
  const { label, suggestion } = await predictClassification(model, imageBuffer);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  return h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    })
    .code(201);
};


const getPredictHistoriesHandler = async (request, h) => {
  const allData = await getData();

  return h.response({
    status: 'success',
    data: allData,
  }).code(200);
}

module.exports = { postPredictHandler, getPredictHistoriesHandler };
