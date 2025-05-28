function responseTransform(req, res, next) {
  // Simpan referensi ke res.json asli
  const originalJson = res.json;

  // Override res.json untuk menambahkan struktur respons
  res.json = function (data) {
    let message = 'Request successfully processed';
    if (req.path === '/login' || req.originalUrl === '/login') {
      message = 'Login successful';
    } else {
        if (req.method === 'POST') {
          message = 'Data successfully added';
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
          message = 'Data successfully edited';
        } else if (req.method === 'GET') {
          message = 'Data retrieved successfully';
        } else if (req.method === 'DELETE') {
          message = 'Data successfully deleted';
        }
    }

    const response = {
      success: true,
      message,
      ...(data && typeof data === 'object' && 'data' in data && 'meta' in data
        ? { data: data.data, meta: data.meta }
        : { data }),
    };

    return originalJson.call(this, response);
  };

  next();
}

module.exports = responseTransform;