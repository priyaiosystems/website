import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Viewer() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title="WASM Viewer"
            description="Try GOAL3's AL3 parser in your browser - 100% client-side, zero data upload">

            <div style={{ height: 'calc(100vh - 60px)', position: 'relative', overflow: 'hidden' }}>
                <iframe
                    src="/wasm-viewer/index.html"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    title="GOAL3 WASM Viewer"
                />
            </div>
        </Layout>
    );
}
