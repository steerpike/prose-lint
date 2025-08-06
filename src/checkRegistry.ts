/**
 * Check Registry - manages available checks and their metadata
 */

import { CheckFunction, CheckMetadata, CheckCategory } from './types';

export class CheckRegistry {
    private checks = new Map<string, CheckFunction>();
    private metadata = new Map<string, CheckMetadata>();
    private categories = new Map<string, CheckCategory>();

    /**
     * Register a new check
     */
    registerCheck(
        id: string,
        checkFunction: CheckFunction,
        metadata: Omit<CheckMetadata, 'id'>
    ): void {
        this.checks.set(id, checkFunction);
        this.metadata.set(id, { id, ...metadata });

        // Add to category
        const categoryId = metadata.category;
        if (!this.categories.has(categoryId)) {
            this.categories.set(categoryId, {
                id: categoryId,
                name: this.formatCategoryName(categoryId),
                description: `Checks related to ${categoryId}`,
                checks: []
            });
        }

        const category = this.categories.get(categoryId)!;
        category.checks.push({ id, ...metadata });
    }

    /**
     * Get a specific check function
     */
    getCheck(id: string): CheckFunction | undefined {
        return this.checks.get(id);
    }

    /**
     * Get metadata for a specific check
     */
    getCheckMetadata(id: string): CheckMetadata | undefined {
        return this.metadata.get(id);
    }

    /**
     * Get all registered check IDs
     */
    getAllCheckIds(): string[] {
        return Array.from(this.checks.keys());
    }

    /**
     * Get all checks in a category
     */
    getChecksByCategory(categoryId: string): CheckMetadata[] {
        const category = this.categories.get(categoryId);
        return category ? category.checks : [];
    }

    /**
     * Get all categories
     */
    getAllCategories(): CheckCategory[] {
        return Array.from(this.categories.values());
    }

    /**
     * Get enabled checks based on configuration
     */
    getEnabledChecks(config: { [checkId: string]: boolean }): string[] {
        return this.getAllCheckIds().filter(id => config[id] !== false);
    }

    /**
     * Remove a check
     */
    unregisterCheck(id: string): void {
        this.checks.delete(id);
        const metadata = this.metadata.get(id);
        this.metadata.delete(id);

        if (metadata) {
            const category = this.categories.get(metadata.category);
            if (category) {
                category.checks = category.checks.filter(check => check.id !== id);
            }
        }
    }

    /**
     * Check if a check is registered
     */
    hasCheck(id: string): boolean {
        return this.checks.has(id);
    }

    /**
     * Get total number of registered checks
     */
    getCheckCount(): number {
        return this.checks.size;
    }

    /**
     * Format category name for display
     */
    private formatCategoryName(categoryId: string): string {
        return categoryId
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Clear all checks (useful for testing)
     */
    clear(): void {
        this.checks.clear();
        this.metadata.clear();
        this.categories.clear();
    }
}
