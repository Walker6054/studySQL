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
apiRouter.delete('/api-del_student', parser, apiController.del_student);
apiRouter.post('/api-add_student', parser, apiController.add_student);
apiRouter.put('/api-update_student', parser, apiController.update_student);

//раздел преподавателей
apiRouter.delete('/api-del_lecturer', parser, apiController.del_lecturer);
apiRouter.post('/api-add_lecturer', parser, apiController.add_lecturer);
apiRouter.put('/api-update_lecturer', parser, apiController.update_lecturer);
apiRouter.delete('/api-del_lecturer_group', parser, apiController.del_lecturer_group);
apiRouter.post('/api-add_lecturer_group', parser, apiController.add_lecturer_group);

//раздел тестов
apiRouter.delete('/api-del_test', parser, apiController.del_test);
apiRouter.post('/api-new_test', parser, apiController.new_test);
apiRouter.put('/api-update_test', parser, apiController.update_test);
apiRouter.post('/api-check_solve_test', parser, apiController.check_solve_test);

//раздел группа
apiRouter.delete('/api-del_group', parser, apiController.del_group);
apiRouter.post('/api-new_group', parser, apiController.new_group);
apiRouter.put('/api-update_group', parser, apiController.update_group);

//раздел группа-тест
apiRouter.delete('/api-del_group_test', parser, apiController.del_group_test);
apiRouter.post('/api-new_group_test', parser, apiController.new_group_test);

module.exports = apiRouter;