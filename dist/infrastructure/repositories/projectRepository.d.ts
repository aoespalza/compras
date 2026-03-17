import { Project, CreateProjectDTO, UpdateProjectDTO } from '../../domain/project/projectEntity';
export { Project, CreateProjectDTO, UpdateProjectDTO };
export declare class ProjectRepository {
    findAll(): Promise<Project[]>;
    findById(id: string): Promise<Project | null>;
    findByCode(code: string): Promise<Project | null>;
    findByStatus(status: string): Promise<Project[]>;
    create(data: CreateProjectDTO): Promise<Project>;
    update(id: string, data: UpdateProjectDTO): Promise<Project>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Project>;
    findLast(): Promise<Project | null>;
}
//# sourceMappingURL=projectRepository.d.ts.map