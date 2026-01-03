// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'GOAL3',
    tagline: 'Enterprise ACORD AL3 Parser for Cloud-Ready Analytics and AI Workloads | Zero Data Exfiltration',
    favicon: 'img/favicon.png',

    // Set the production url of your site here
    url: 'https://priyaiosystems.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Priya IO Systems',
    projectName: 'GOAL3',

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use  internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: undefined,
                },
                blog: false, // Disable blog for MVP
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                gtag: {
                    trackingID: process.env.GA_TRACKING_ID || 'G-PLACEHOLDER',
                    anonymizeIP: true,
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/goal3-social-card.jpg',
            metadata: [
                { name: 'keywords', content: 'ACORD AL3, insurance data parser, InsurTech, cloud analytics, enterprise insurance technology, AL3 to Parquet, AL3 to JSON, insurance data integration, policy data extraction, ACORD data conversion, insurance AI, insurance machine learning, ETL, Data Lake, Policy Admin' },
                { name: 'description', content: 'The Enterprise Standard for Secure ACORD AL3 Processing. Zero Data Exfiltration, Real-time API & High-Throughput Batch Processing. Free local viewer, pay-as-you-go container.' },
                { property: 'og:image', content: 'https://priyaiosystems.com/img/goal3-social-card.jpg' },
                { property: 'og:description', content: 'The Enterprise Standard for Secure ACORD AL3 Processing. Zero Data Exfiltration.' },
            ],
            // Color Mode Config
            colorMode: {
                defaultMode: 'light',
                disableSwitch: true,
                respectPrefersColorScheme: false,
            },
            navbar: {
                title: 'Priya IO Systems',
                logo: {
                    alt: 'Priya IO Systems Logo',
                    src: 'img/logo.png',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'productSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        to: '/docs/api/overview',
                        label: 'API Reference',
                        position: 'left',
                    },
                    {
                        to: '/docs/product/vision',
                        label: 'Enterprise',
                        position: 'left',
                    },
                    {
                        to: '/viewer',
                        label: 'GOAL3 Viewer',
                        position: 'right',
                        className: 'button button--primary button--sm navbar-cta-btn',
                    },
                    {
                        href: 'https://aws.amazon.com/marketplace',
                        label: 'Subscribe on AWS',
                        position: 'right',
                        className: 'button button--outline button--sm navbar-secondary-btn',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Product',
                        items: [
                            {
                                label: 'Usage Guide',
                                to: '/docs/product/usage_guide',
                            },
                            {
                                label: 'AL3 Spec Reference',
                                to: '/docs/product/in_depth/al3_standard_variance',
                            },
                            {
                                label: 'JSON Schema (v1.0.0)',
                                to: 'pathname:///schemas/acord-al3-pc-v1.0.0.json',
                            },
                        ],
                    },
                    {
                        title: 'Legal',
                        items: [
                            {
                                label: 'Privacy Policy',
                                to: '/docs/product/pii_handling',
                            },
                        ],
                    },
                ],
                copyright: `© ${new Date().getFullYear()} Priya IO Systems`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['bash', 'json', 'yaml'],
            },
            colorMode: {
                defaultMode: 'light',
                disableSwitch: false,
                respectPrefersColorScheme: true,
            },
        }),

    markdown: {
        mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
};

module.exports = config;
