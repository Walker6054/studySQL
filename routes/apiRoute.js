const express = require('express');
const apiController = require('../controllers/apiController');
const mainController = require('../controllers/mainController');
const apiRouter = express.Router();

const parser = express.json();
apiRouter.use(parser);

//авторизация/регистрация/восстановление пароля
apiRouter.post('/api-reguser', parser, apiController.reguser);
apiRouter.post('/api-loguser', parser, apiController.loguser);
apiRouter.post('/api-forgotpass', parser, apiController.forgotpass);
apiRouter.post('/api-recoverypass', parser, apiController.recoverypass);

//раздел тестов
apiRouter.post('/api-del_test', parser, apiController.del_test);
apiRouter.post('/api-new_test', parser, apiController.new_test);
apiRouter.post('/api-update_test', parser, apiController.update_test);

module.exports = apiRouter;