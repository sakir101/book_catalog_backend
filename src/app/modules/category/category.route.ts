import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';


const router = express.Router();

router.get('/',
    CategoryController.getAllFromDB)

router.get('/:id',
    CategoryController.getDataById)

router.post('/create-category',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(CategoryValidation.create),
    CategoryController.insertIntoDB)

router.patch('/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(CategoryValidation.update),
    CategoryController.updateIntoDb)

router.delete('/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CategoryController.deleteFromDB)

export const CategoryRoutes = router