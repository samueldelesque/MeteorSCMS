

// app.get('/', function (req, res) {
// 	var csrfToken = generateCSRFToken();
// 	res.cookie('csrf', csrfToken);
// 	res.redirect(url.format({
// 		protocol: 'https',
// 		hostname: 'www.dropbox.com',
// 		pathname: '1/oauth2/authorize',
// 		query: {
// 			client_id: APP_KEY,//App key of dropbox api
// 			response_type: 'code',
// 			state: csrfToken,
// 			redirect_uri: generateRedirectURI(req)
// 		}
// 	}));
// });