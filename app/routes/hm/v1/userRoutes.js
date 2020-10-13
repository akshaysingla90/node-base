'use strict';

const { Joi } = require('../../../utils/joiUtils');
const { USER_ROLE } = require(`../../../utils/constants`);
//load controllers
const { userController } = require(`../../../controllers`);

let routes = [
	{
		method: 'GET',
		path: '/v1/serverResponse/',
		joiSchemaForSwagger: {
			group: 'User',
			description: 'Route to get server response (Is server working fine or not?).',
			model: 'SERVER'
		},
		handler: userController.getServerResponse
	},
	{
		method: 'POST',
		path: '/v1/user/register',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().optional().description('User\'s email.'),
				password: Joi.string().optional().description('User\'s password.'),
				userName: Joi.string().optional().description('User\'s user name.')
			},
			group: 'User',
			description: 'Route to registere a user.',
			model: 'Register_User'
		},
		handler: userController.registerNewUser
	},
	{
		method: 'POST',
		path: '/v1/user/',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().optional().description('User\'s email.'),
				password: Joi.string().optional().description('User\'s password.'),
				userName: Joi.string().optional().description('User\'s user name.'),
				firstName: Joi.string().optional().description('User\'s first name.'),
				lastName: Joi.string().optional().description('User\'s last name.'),
				contactNumber: Joi.string().optional().description('User\'s contact number.'),
				operationType: Joi.number().required().description('Operation type. 1 for create, 2 for update & 3 for delete.')
			},
			group: 'User',
			description: 'Route to create/update/Delete a user.',
			model: 'CRUD_User'
		},
		handler: userController.createAndUpdateUser
	},
	{
		method: 'POST',
		path: '/v1/user/login',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('User\'s email Id.'),
				password: Joi.string().required().description('User\'s password.')
			},
			group: 'User',
			description: 'Route to login a user.',
			model: 'Login'
		},
		handler: userController.loginUser
	},
	{
		method: 'POST',
		path: '/v1/user/forgot-password',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('User\'s email Id.'),
			},
			group: 'User',
			description: 'Route to reset user password.',
			model: 'Forgot_Password'
		},
		handler: userController.forgotPassword
	},
	{
		method: 'POST',
		path: '/v1/user/reset-password',
		joiSchemaForSwagger: {
			body: {
				password: Joi.string().required().description('New password.'),
				token: Joi.string().required().description('Reset-password token.')
			},
			group: 'User',
			description: 'Route to reset user password.',
			model: 'Reset_Password'
		},
		handler: userController.resetPassword
	},
	{
		method: 'POST',
		path: '/v1/uploadFile',
		joiSchemaForSwagger: {
			headers: {
				'authorization': Joi.string().required().description('User \'s JWT token.')
			},
			formData: {
				file: Joi.file({ name: "file" })
			},
			group: 'File',
			description: 'Route to upload a file.',
			model: 'File_Upload'
		},
		auth: USER_ROLE.USER,
		handler: userController.uploadFile
	}
];

module.exports = routes;