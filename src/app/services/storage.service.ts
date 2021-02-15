import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(public _storage: Storage) { }

    /**
     * Gets role of user
     */
    getRole() {
        return this._storage.get('user_role');
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this._storage.get('current_user');
    }

    /**
     * Sets role
     * @param param role to set
     */
    setRole(role) {
        return this._storage.set('role', role);
    }

    /**
     * Sets role
     * @param param role to set
     */
    setCurrentUser(user) {
        return this._storage.set('role', user);
    }

    /**
     * Gets specific data from storage with provided key
     * @param key index key
     */
    getData(key) {
        return this._storage.get(key);
    }

    /**
     * Clears storage session
     */
    clearStorageData() {
        return this._storage.clear();
    }

    /**
     * Sets data to storage using provided key and value
     * @param key index key
     * @param value data
     */
    setStorageData(key, value) {
        return this._storage.set(key, value);
    }
}
