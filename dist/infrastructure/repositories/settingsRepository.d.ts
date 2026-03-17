export interface Setting {
    id: string;
    key: string;
    value: string;
    category: string;
    isSecret: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface SettingDTO {
    key: string;
    value: string;
    category?: string;
    isSecret?: boolean;
}
declare class SettingsRepository {
    findByKey(key: string): Promise<Setting | null>;
    findByCategory(category: string): Promise<Setting[]>;
    findAll(): Promise<Setting[]>;
    upsert(data: SettingDTO): Promise<Setting>;
    delete(key: string): Promise<void>;
    deleteByCategory(category: string): Promise<void>;
    getSMTPConfig(): Promise<{
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
        from?: string;
    } | null>;
}
export declare const settingsRepository: SettingsRepository;
export default settingsRepository;
//# sourceMappingURL=settingsRepository.d.ts.map