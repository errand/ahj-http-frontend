const fetcher = async (options) => {
  const URL = 'https://errand-ahj-http-backend.herokuapp.com/';
  const requestUrl = `${URL}?${options.query}`;

  const request = await fetch(requestUrl, {
    method: options.method,
    body: JSON.stringify(options.data) || null,
  });

  console.log(request, 'request');
  const response = await request.json();
  console.log(response, 'response');
  if (options.callback) {
    options.callback(response);
  }

  return response;
};

export default fetcher;
