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
apiRouter.put('/api-update_user', parser, apiController.update_user);

//раздел студентов
apiRouter.delete('/student', parser, apiController.del_student);
apiRouter.post('/student', parser, apiController.add_student);
apiRouter.put('/student', parser, apiController.update_student);

//раздел преподавателей
apiRouter.delete('/lecturer', parser, apiController.del_lecturer);
apiRouter.post('/lecturer', parser, apiController.add_lecturer);
apiRouter.put('/lecturer', parser, apiController.update_lecturer);

apiRouter.delete('/lecturer_group', parser, apiController.del_lecturer_group);
apiRouter.post('/lecturer_group', parser, apiController.add_lecturer_group);

//раздел тестов
apiRouter.delete('/test', parser, apiController.del_test);
apiRouter.post('/test', parser, apiController.new_test);
apiRouter.put('/test', parser, apiController.update_test);
apiRouter.post('/solve_test', parser, apiController.check_solve_test);

//раздел группа
apiRouter.delete('/group', parser, apiController.del_group);
apiRouter.post('/group', parser, apiController.new_group);
apiRouter.put('/group', parser, apiController.update_group);

//раздел группа-тест
apiRouter.delete('/group_test', parser, apiController.del_group_test);
apiRouter.post('/group_test', parser, apiController.new_group_test);

module.exports = apiRouter;