import { runEditorIntegrationTests } from './editorIntegrationTests';

/**
 * Run comprehensive integration tests
 */
export async function runIntegrationTests() {
    console.log('=== Integration Tests ===');

    try {
        // Run the comprehensive editor integration tests
        await runEditorIntegrationTests();

        console.log('✅ Integration tests completed successfully');
        return true;
    } catch (error) {
        console.error('❌ Integration tests failed:', error);
        return false;
    }
}
