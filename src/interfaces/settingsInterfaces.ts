interface Config {
    id: number;
    key: string;
    value: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConfigsResponse {
    status: string;
    configs: Config[];
}
