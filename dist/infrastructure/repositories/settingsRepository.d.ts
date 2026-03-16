export declare class SettingsRepository {
    findAll(): Promise<any[]>;
    findByKey(key: string): Promise<any | null>;
    findByCategory(category: string): Promise<any[]>;
    upsert(key: string, value: string, category?: string, description?: string): Promise<any>;
    delete(key: string): Promise<void>;
    initializeDefaults(): Promise<void>;
}
export declare const settingsRepository: SettingsRepository;
//# sourceMappingURL=settingsRepository.d.ts.map