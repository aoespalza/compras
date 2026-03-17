import { ProjectRepository, CreateProjectDTO, UpdateProjectDTO, Project } from '../infrastructure/repositories/projectRepository';
export declare class ProjectUseCases {
    private repository;
    constructor(repository: ProjectRepository);
    getAll(): Promise<Project[]>;
    getById(id: string): Promise<Project>;
    getByStatus(status: string): Promise<Project[]>;
    create(data: CreateProjectDTO): Promise<Project>;
    update(id: string, data: UpdateProjectDTO): Promise<Project>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<Project>;
    generateCode(): Promise<string>;
}
//# sourceMappingURL=projectUseCases.d.ts.map