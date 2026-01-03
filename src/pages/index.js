import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// --- Enterprise SVG Icons ---

const Icons = {
  Server: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  ),
  Code: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Tool: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  Cloud: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  ),
  CloudWhite: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  ),
  FileCheck: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <path d="M9 15l2 2 4-4"></path>
    </svg>
  ),
  Rocket: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ed8936" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.workflowArrow}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
};

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">The Enterprise Standard for Secure AL3 Processing.</h1>
        <p className="hero__subtitle">
          Zero Data Exfiltration. Real-time API & High-Throughput Batch Processing for
          <br />Analytics & AI Workloads.
        </p>

        <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icons.Shield />
            Deployable on AWS ECS, EKS, Fargate and other Cloud Platforms
          </span>
        </div>

        <div className={styles.buttons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            className="button button--primary button--lg"
            style={{ color: '#fff', border: 'none', minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            to="https://aws.amazon.com/marketplace">
            <Icons.CloudWhite />
            <span style={{ marginLeft: '5px' }}>Deploy Private Container</span>
          </Link>
          <Link
            className="button button--secondary button--lg"
            style={{ background: 'transparent', border: '2px solid #fff', color: '#fff', minWidth: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            to="/viewer">
            <Icons.Code />
            <span style={{ marginLeft: '5px' }}>Open Integration Sandbox</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProductHierarchy() {
  return (
    <section style={{ padding: '5rem 0', background: '#fff' }}>
      <div className="container">
        <div className="row">
          {/* Product A: The Engine */}
          <div className="col col--6" style={{ padding: '1rem' }}>
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '3rem',
              height: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              background: '#fcfdfd',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', color: '#10b981' }}>
                  <Icons.Server />
                </div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>
                  Enterprise Processing Engine
                </div>
              </div>

              <Heading as="h2" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#1a202c' }}>GOAL3 Container</Heading>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#4a5568', lineHeight: '1.6' }}>
                A dockerized, zero-dependency binary optimized for high-throughput server-side processing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.05rem', lineHeight: '2', color: '#2d3748' }}>
                <li><Icons.CheckCircle /> <strong>Cloud Migration Ready:</strong> Ideal for moving on-prem workloads.</li>
                <li><Icons.CheckCircle /> <strong>Multi-Format:</strong> JSON, CSV, Parquet for AI & Analytics.</li>
                <li><Icons.CheckCircle /> <strong>High-Throughput:</strong> Process multi-GB archives in minutes.</li>
                <li><Icons.CheckCircle /> <strong>Private:</strong> Zero Data Exfiltration. Runs entirely within your firewall.</li>
              </ul>
            </div>
          </div>

          {/* Product B: The Viewer */}
          <div className="col col--6" style={{ padding: '1rem' }}>
            <div style={{
              border: '1px solid #edf2f7',
              borderRadius: '16px',
              padding: '3rem',
              height: '100%',
              background: '#fff',
              position: 'relative',
              transition: 'transform 0.2s ease',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%)'
              }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', background: '#cffafe', borderRadius: '8px', color: '#06b6d4' }}>
                  <Icons.Code />
                </div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '800', color: '#06b6d4', letterSpacing: '0.5px' }}>
                  Developer Experience & Validation
                </div>
              </div>

              <Heading as="h2" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#1a202c' }}>Integration Sandbox (Local-Only)</Heading>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#4a5568', lineHeight: '1.6' }}>
                Free forever. Client-side WASM verification. Zero data upload to server.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.05rem', lineHeight: '2', color: '#2d3748' }}>
                <li><Icons.Tool /> <strong>Visual Verification:</strong> See the JSON structure before you code.</li>
                <li><Icons.Tool /> <strong>Zero-Install:</strong> Runs in browser (WASM).</li>
                <li><Icons.Tool /> <strong>Instant Feedback:</strong> Validate compliance with ACORD standards.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #f8f9fa 0%, #edf2f7 100%)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Heading as="h2" style={{ fontSize: '2.5rem', color: '#1a202c' }}>From Validation to Production</Heading>
          <p style={{ fontSize: '1.2rem', color: '#718096' }}>A streamlined workflow for your engineering team.</p>
        </div>

        <div className="row" style={{ alignItems: 'flex-start', justifyContent: 'center' }}>

          <div className="col col--3" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Icons.FileCheck />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. Verify</h3>
            <p style={{ color: '#4a5568' }}>Drag your AL3 file into our <strong>Integration Sandbox</strong> to confirm data quality.</p>
          </div>

          <div className="col col--1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
            <div className="workflow-arrow-desktop" style={{ color: '#cbd5e0' }}>→</div>
          </div>

          <div className="col col--3" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Icons.Cloud />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Subscribe</h3>
            <p style={{ color: '#4a5568' }}>Pull the <strong>GOAL3 Container</strong> from AWS Marketplace to your registry.</p>
          </div>

          <div className="col col--1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
            <div className="workflow-arrow-desktop" style={{ color: '#cbd5e0' }}>→</div>
          </div>

          <div className="col col--3" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Scale</h3>
            <p style={{ color: '#4a5568' }}>Elastic scaling. Pipe your S3 buckets into the container for massive parallel processing in your VPC.</p>
          </div>

        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section style={{ padding: '6rem 0', background: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Heading as="h2" style={{ fontSize: '2.5rem' }}>Enterprise-Grade Performance</Heading>
          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '0.5rem' }}>Why leading engineering teams choose the GOAL3 Container.</p>
          <p style={{ fontSize: '1rem', color: '#e53e3e', fontWeight: '600' }}>Stop paying $999/year/seat for legacy viewers.</p>
        </div>
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="product-column-free">GOAL3 Viewer (Free)</th>
                <th className="product-column-pro">Enterprise Container (Commercial)</th>
              </tr>
            </thead>
            <tbody>
              {/* Core Features */}
              <tr>
                <td>Environment</td>
                <td>Browser (Client-Side)</td>
                <td className="highlight-cell">Your Cloud (AWS/Azure/GCP)</td>
              </tr>
              <tr>
                <td>Throughput</td>
                <td>1 File at a time</td>
                <td className="highlight-cell">~1000 Files / second</td>
              </tr>

              {/* New Features Requested */}
              <tr>
                <td>Target Workloads</td>
                <td>Manual Validations</td>
                <td className="highlight-cell">AI Training & Data Warehousing</td>
              </tr>
              <tr>
                <td>Output Formats</td>
                <td>Interactive Tree (Shows Keys Only)</td>
                <td className="highlight-cell">JSON, CSV, Parquet (Analytics)</td>
              </tr>
              <tr>
                <td>Input Sources</td>
                <td>Local Drag & Drop</td>
                <td className="highlight-cell">S3, Kafka, EFS, HTTP Stream, Local Disk</td>
              </tr>
              <tr>
                <td>Customization</td>
                <td>Standard ACORD</td>
                <td className="highlight-cell">Custom Groups & Overrides</td>
              </tr>
              <tr>
                <td>Performance</td>
                <td>Standard</td>
                <td className="highlight-cell">Ultra-Low Latency (Sub-second)</td>
              </tr>

              <tr>
                <td>Privacy</td>
                <td>Browser (Client-Side) / Local-Only</td>
                <td className="highlight-cell">VPC Internal (Zero Exfiltration)</td>
              </tr>
              <tr>
                <td>Cost Model</td>
                <td><strong>Free Forever</strong> (No license fees)</td>
                <td className="highlight-cell">Pay-as-you-go</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link
            className="button button--primary button--lg"
            style={{ fontWeight: '700', padding: '1rem 2rem' }}
            to="https://aws.amazon.com/marketplace">
            View Pricing on AWS Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section style={{ padding: '6rem 0', background: '#f8f9fa', borderTop: '1px solid #e2e8f0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <Heading as="h2" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d3748' }}>Need Help Integrating?</Heading>
        <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#718096', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          We provide dedicated support for enterprise integrations, architectural guidance, and custom configurations.
        </p>
        <Link
          className="button button--outline button--lg"
          style={{ borderColor: '#4a5568', color: '#4a5568' }}
          to="mailto:support@priyaiosystems.com">
          Contact Integration Support
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="The Enterprise Standard for AL3 Processing"
      description="Deploy a private, high-throughput AL3 parsing microservice in your own VPC. Optimize your insurance data workflows with GOAL3.">
      <HomepageHeader />
      <main>
        <ProductHierarchy />
        <Workflow />
        <ComparisonTable />
        <SupportSection />
      </main>
    </Layout>
  );
}
