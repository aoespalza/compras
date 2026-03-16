export declare class SettingsUseCases {
    getAllSettings(): Promise<any[]>;
    getSettingsByCategory(category: string): Promise<any[]>;
    getSetting(key: string): Promise<any | null>;
    updateSetting(key: string, value: string, description?: string): Promise<any>;
    initializeSettings(): Promise<void>;
    getValidationSettings(): Promise<Record<string, string>>;
    getEmailSettings(): Promise<Record<string, string>>;
    getCompanySettings(): Promise<Record<string, string>>;
}
export declare const settingsUseCases: SettingsUseCases;
//# sourceMappingURL=settingsUseCases.d.ts.map