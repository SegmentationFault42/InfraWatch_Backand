"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../../config/dotenv");
const base_errors_1 = require("../errors/base.errors");
const user_repository_1 = require("../repositories/user.repository");
const role_repository_1 = require("../repositories/role.repository");
class UserService {
    async createUser(data) {
        const existingUser = await user_repository_1.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new base_errors_1.ConflictError('Usuário já existe com este email');
        }
        let roleId = data.roleId;
        if (!roleId) {
            const defaultRole = await role_repository_1.roleRepository.getDefaultViewerRole();
            roleId = defaultRole.id;
        }
        else {
            const role = await role_repository_1.roleRepository.findById(roleId);
            if (!role) {
                throw new base_errors_1.NotFoundError('Role');
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const newUser = await user_repository_1.userRepository.create({
            ...data,
            password: hashedPassword,
            roleId,
        });
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    async loginUser(email, password) {
        const user = await user_repository_1.userRepository.findForLogin(email);
        if (!user) {
            throw new base_errors_1.UnauthorizedError('Credenciais inválidas');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new base_errors_1.UnauthorizedError('Credenciais inválidas');
        }
        const fullUser = await user_repository_1.userRepository.findById(user.id);
        if (!fullUser) {
            throw new base_errors_1.NotFoundError('Usuário');
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            roleId: fullUser.role?.id,
        }, dotenv_1.ENV.JWT_SECRET, { expiresIn: '24h' });
        return {
            token,
            user: {
                id: fullUser.id,
                name: fullUser.name,
                email: fullUser.email,
                role: fullUser.role,
            },
        };
    }
    async getUserById(id) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new base_errors_1.NotFoundError('Usuário');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map