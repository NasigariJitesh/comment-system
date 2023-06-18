import express from 'express';

import { createReply, getRepliesByUser } from '../controllers/reply';
import { getUserById } from '../controllers/user';
import { isSignedIn, isAuthenticated } from '../controllers/auth';

const router = express.Router();

router.param('userId', getUserById);

router.get('/reply/all/:userId', isSignedIn, isAuthenticated, getRepliesByUser);

// router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.post('/reply/create/:userId', isSignedIn, isAuthenticated, createReply);

export default router;
