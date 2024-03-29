import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from '../userGet/user.controller';

const router = express.Router();


router.get('/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
    UserController.getDataByProfile)


export const ProfileRoutes = router