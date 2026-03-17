import { User, CreateUserDTO, UpdateUserDTO, AuthPayload } from '../../domain/user';
export declare class AuthUseCases {
    login(username: string, password: string): Promise<{
        user: User;
        token: string;
    }>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User | null>;
    createUser(data: CreateUserDTO): Promise<User>;
    updateUser(id: string, data: UpdateUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    verifyToken(token: string): Promise<AuthPayload>;
}
export declare const authUseCases: AuthUseCases;
//# sourceMappingURL=authUseCases.d.ts.map