"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_controller_1 = require("../controllers/user.controller");
const userSchema_1 = require("../schema/userSchema");
async function userRoutes(fastify) {
    fastify.post('/user/create', { schema: userSchema_1.CreateUserSwaggerSchema }, user_controller_1.userController.createUser);
    fastify.post('/user/login', { schema: userSchema_1.LoginSwaggerSchema }, user_controller_1.userController.loginUser);
}
//# sourceMappingURL=user.routes.js.map