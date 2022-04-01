const get = bucket => {
  const srcKey = decodeURIComponent(bucket.Records[0].s3.object.key.replace(/\+/g, ' '));
  const parsedKey = srcKey.split('/');
  const key = parsedKey.shift();

  return key;
};

module.exports = { get };