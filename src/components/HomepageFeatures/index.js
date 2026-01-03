import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '🔒 Zero Data Exfiltration',
    icon: '🔒',
    description: (
      <>
        Runs in your VPC - data never leaves your control. Full compliance with HIPAA, SOC 2, and data residency requirements.
      </>
    ),
    link: '/docs/deployment/aws-marketplace',
  },
  {
    title: '💰 No License Fees',
    icon: '💰',
    description: (
      <>
        Pay-as-you-go pricing based on usage, not seats. No upfront costs, no annual maintenance fees, no vendor lock-in.
      </>
    ),
    link: '/docs/pricing',
  },
  {
    title: '✓ Privacy-Compliant WASM Viewer',
    icon: '✓',
    description: (
      <>
        Free WASM Viewer with PII masking to verify parsing before purchasing. Try with your real AL3 files in your browser.
      </>
    ),
    link: '/viewer',
  },
  {
    title: '⚡ Dual Processing Modes',
    icon: '⚡',
    description: (
      <>
        Realtime HTTP API for on-demand parsing with validation. Batch processing from S3/EFS for high-volume workloads.
      </>
    ),
    link: '/docs/api/overview',
  },
  {
    title: '📊 Analytics-Ready Parquet',
    icon: '📊',
    description: (
      <>
        Native Parquet output optimized for Snowflake, BigQuery, and Databricks. Also supports JSON and CSV formats.
      </>
    ),
    link: '/docs/api/output-formats',
  },
  {
    title: '🔧 Custom Groups & Validation',
    icon: '🔧',
    description: (
      <>
        Support for proprietary AL3 extensions and custom group definitions. Detailed error and warning reports with line numbers.
      </>
    ),
    link: '/docs/api/realtime-api',
  },
];

function Feature({ icon, title, description, link }) {
  return (
    <div className={clsx('col col--4')} style={{ marginBottom: '2rem' }}>
      <div className="text--center" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {icon}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" style={{ fontSize: '1.5rem' }}>{title}</Heading>
        <p style={{ fontSize: '1.05rem', minHeight: '80px' }}>{description}</p>
        {link && (
          <Link to={link} style={{ fontSize: '1rem', fontWeight: 600 }}>
            Learn more →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features} style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Heading as="h2" style={{ fontSize: '2.5rem' }}>
            Built for Insurance Data Engineers
          </Heading>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '1rem auto' }}>
            Enterprise-grade features that demand accuracy, security, and scalability
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
