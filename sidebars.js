/**
 * Sidebar configuration for public documentation only
 * Product docs are kept internal for reference
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // Product documentation sidebar (internal/enterprise)
    productSidebar: [
        'product/vision',
        'product/viewer',
        'product/requirements',
        'product/usage_guide',
        'product/metering',
        'product/pii_handling',
    ],
    // API documentation sidebar (public)
    apiSidebar: [
        {
            type: 'category',
            label: 'API Documentation',
            items: [
                'api/overview',
                'api/realtime-api',
                'api/batch-processing',
                'api/output-formats',
            ],
        },
        {
            type: 'category',
            label: 'Deployment',
            items: [
                'deployment/aws-marketplace',
            ],
        },
        {
            type: 'doc',
            id: 'pricing',
            label: 'Pricing',
        },
    ],
};

module.exports = sidebars;
