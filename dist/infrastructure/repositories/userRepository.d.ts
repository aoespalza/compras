import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/user';
export declare class UserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: string, data: UpdateUserDTO): Promise<User>;
    delete(id: string): Promise<void>;
    verifyPassword(username: string, password: string): Promise<User | null>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=userRepository.d.ts.map