const { Firestore } = require('@google-cloud/firestore');

function storeData(id, data) {
  const db = new Firestore({
    projectId: 'submissionmlgc-tbfarhan',
  });

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data)
}

module.exports = storeData;
