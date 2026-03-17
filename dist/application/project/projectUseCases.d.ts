import { CreateProjectDTO, UpdateProjectDTO } from '../../domain/project';
export declare class ProjectUseCases {
    getAllProjects(): Promise<import("../../domain/project").Project[]>;
    getProjectById(id: string): Promise<import("../../domain/project").Project>;
    getProjectsByStatus(status: string): Promise<import("../../domain/project").Project[]>;
    createProject(data: CreateProjectDTO): Promise<import("../../domain/project").Project>;
    updateProject(id: string, data: UpdateProjectDTO): Promise<import("../../domain/project").Project>;
    deleteProject(id: string): Promise<void>;
    updateProjectStatus(id: string, status: string): Promise<import("../../domain/project").Project>;
}
export declare const projectUseCases: ProjectUseCases;
//# sourceMappingURL=projectUseCases.d.ts.map