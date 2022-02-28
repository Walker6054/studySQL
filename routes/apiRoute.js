const express = require('express');
const apiController = require('../controllers/apiController');
const apiRouter = express.Router();

const parser = express.json();
apiRouter.use(parser);

//авторизация/регистрация/восстановление пароля + изменение данных в ЛК
apiRouter.post('/api-reguser', parser, apiController.reguser);
apiRouter.post('/api-loguser', parser, apiController.loguser);
apiRouter.post('/api-forgotpass', parser, apiController.forgotpass);
apiRouter.post('/api-recoverypass', parser, apiController.recoverypass);
apiRouter.post('/api-update_user', parser, apiController.update_user);

//раздел студентов
apiRouter.post('/api-del_student', parser, apiController.del_student);
apiRouter.post('/api-add_student', parser, apiController.add_student);
apiRouter.post('/api-update_student', parser, apiController.update_student);

//раздел преподавателей
apiRouter.post('/api-del_lecturer', parser, apiController.del_lecturer);
apiRouter.post('/api-add_lecturer', parser, apiController.add_lecturer);

//раздел тестов
apiRouter.post('/api-del_test', parser, apiController.del_test);
apiRouter.post('/api-new_test', parser, apiController.new_test);
apiRouter.post('/api-update_test', parser, apiController.update_test);
apiRouter.post('/api-check_solve_test', parser, apiController.check_solve_test);

//раздел группа
apiRouter.post('/api-del_group', parser, apiController.del_group);
apiRouter.post('/api-new_group', parser, apiController.new_group);
apiRouter.post('/api-update_group', parser, apiController.update_group);

//раздел группа-тест
apiRouter.post('/api-del_group_test', parser, apiController.del_group_test);
apiRouter.post('/api-new_group_test', parser, apiController.new_group_test);

module.exports = apiRouter;