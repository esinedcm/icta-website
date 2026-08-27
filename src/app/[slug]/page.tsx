import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import styles from "./page.module.css";

interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

// Ensure Next.js can pass params securely
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  let wpPage: WPPage | null = null;
  
  try {
    let url = `https://intercountytennis.com/wp-json/wp/v2/pages?slug=${slug}`;
    const fetchOptions: RequestInit = {
      next: { revalidate: 60 } // Default revalidate
    };

    if (isEnabled) {
      // If draft mode is active, fetch any status (including drafts) and bypass cache
      url += "&status=any";
      fetchOptions.cache = "no-store";
      
      // Basic Auth requires base64 encoded username:password
      if (process.env.WP_APPLICATION_PASSWORD) {
        const base64Auth = Buffer.from(process.env.WP_APPLICATION_PASSWORD).toString('base64');
        fetchOptions.headers = {
          'Authorization': `Basic ${base64Auth}`
        };
      }
    }

    const res = await fetch(url, fetchOptions);
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        wpPage = data[0];
      }
    }
  } catch (err) {
    console.error("Failed to fetch WordPress page", err);
  }

  // If the page doesn't exist in WordPress, return a 404
  if (!wpPage) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {isEnabled && (
        <div style={{ background: '#d4af37', color: '#000', padding: '10px', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px' }}>
          Preview Mode Active. <a href="/api/disable-draft" style={{ textDecoration: 'underline' }}>Click here to exit</a>.
        </div>
      )}
      <header className={styles.header}>
        {/* We use dangerouslySetInnerHTML here as well because WordPress titles can contain HTML entities like &#8211; */}
        <h1 
          className={styles.title} 
          dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }}
        />
      </header>

      <main className={`${styles.contentWrapper} glass-panel`}>
        {/* We wrap the content in .wp-content so global styles apply to raw HTML */}
        <div 
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }}
        />
      </main>
    </div>
  );
}
