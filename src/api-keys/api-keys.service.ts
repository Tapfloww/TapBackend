import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface ApiKey {
  id: string;
  appId: string;
  name: string;
  prefix: string;
  lastUsed: string | null;
  createdAt: string;
  revokedAt: string | null;
}

@Injectable()
export class ApiKeysService {
  private keys: Map<string, ApiKey> = new Map();

  getByAppId(appId: string) {
    return Array.from(this.keys.values()).filter(k => k.appId === appId);
  }

  create(appId: string, data: { name: string }) {
    const key: ApiKey = {
      id: uuidv4(),
      appId,
      name: data.name,
      prefix: 'sk_' + Math.random().toString(36).substring(7),
      lastUsed: null,
      createdAt: new Date().toISOString(),
      revokedAt: null,
    };
    this.keys.set(key.id, key);
    return key;
  }

  revoke(keyId: string) {
    const key = this.keys.get(keyId);
    if (key) {
      key.revokedAt = new Date().toISOString();
    }
    return key;
  }
}
