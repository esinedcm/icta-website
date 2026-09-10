import styles from "./page.module.css";
import GlassCard from "@/components/GlassCard";
import Carousel from "@/components/Carousel";
import TabbedLeagues from "@/components/TabbedLeagues";
import ChampionshipSponsors from "@/components/ChampionshipSponsors";
import AnimatedNumber from "@/components/AnimatedNumber";
import AnimateIn from "@/components/AnimateIn";
import { stripHtml, formatDate, truncateString } from "@/lib/utils";
import { draftMode } from "next/headers";

// Define the shape of a WordPress Post we care about
interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  date: string;
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    "wp:term"?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
  yoast_head?: string;
}

export default async function Home() {
  const { isEnabled } = await draftMode();

  // Fetch Latest Updates, Carousel Images, and Sponsors concurrently
  let newsPosts: WPPost[] = [];
  let carouselPosts: WPPost[] = [];
  let sponsors: WPPost[] = [];
  
  try {
    let postsUrl = "https://intercountytennis.com/wp-json/wp/v2/posts?per_page=3&_embed=1";
    let carouselUrl = "https://intercountytennis.com/wp-json/wp/v2/carousel?per_page=5&_embed=1";
    let sponsorsUrl = "https://intercountytennis.com/wp-json/wp/v2/sponsors?per_page=10&_embed=1&orderby=menu_order&order=asc";
    
    const fetchOptions: RequestInit = {
      next: { revalidate: 60 }
    };

    if (isEnabled) {
      postsUrl += "&status=any";
      carouselUrl += "&status=any";
      sponsorsUrl += "&status=any";
      fetchOptions.cache = "no-store";
      
      if (process.env.WP_APPLICATION_PASSWORD) {
        const base64Auth = Buffer.from(process.env.WP_APPLICATION_PASSWORD).toString('base64');
        fetchOptions.headers = {
          'Authorization': `Basic ${base64Auth}`
        };
      }
    }

    const [postsRes, carouselRes, sponsorsRes] = await Promise.all([
      fetch(postsUrl, fetchOptions),
      fetch(carouselUrl, fetchOptions),
      fetch(sponsorsUrl, fetchOptions)
    ]);
    
    if (postsRes.ok) newsPosts = await postsRes.json();
    if (carouselRes.ok) carouselPosts = await carouselRes.json();
    if (sponsorsRes.ok) sponsors = await sponsorsRes.json();
    
  } catch (err) {
    console.error("Failed to fetch data from WordPress", err);
  }

  // Helpers for flexible post rendering
  const getPostImage = (post: WPPost) => {
    let url = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (!url && post.yoast_head) {
      const match = post.yoast_head.match(/"thumbnailUrl":"([^"]+)"/);
      if (match && match[1]) url = match[1].replace(/\\\//g, '/');
    }
    return url;
  };

  // Extract featured images from the dedicated carousel posts, and fallback to defaults if needed
  const defaultImages = [
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1572560442220-1a2c35838ccb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1572560442220-1a2c35838ccb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800"
  ];
  
  const fetchedImages = carouselPosts
    .map(post => {
      // 1. Try standard REST API embed
      let url = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      // 2. Fallback to Yoast SEO schema graph if WP REST API fails to embed the media
      if (!url && post.yoast_head) {
        const match = post.yoast_head.match(/"thumbnailUrl":"([^"]+)"/);
        if (match && match[1]) {
          url = match[1].replace(/\\\//g, '/');
        }
      }
      return url;
    })
    .filter((url): url is string => Boolean(url));
    
  // Use fetched images, and fill the rest with default images up to 5
  const carouselImages = [
    ...fetchedImages,
    ...defaultImages
  ].slice(0, 5);

  const mockLeagues = [
    {
      id: 'mixed',
      title: "Mixed League",
      excerpt: "Competitive and recreational mixed doubles play across all skill levels.",
      link: "/mixed-league",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'ladies',
      title: "Ladies League",
      excerpt: "Dedicated weekday and weekend morning leagues for women's doubles.",
      link: "/ladies-league",
      image: "https://images.unsplash.com/photo-1622279457486-62d74eba3623?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'plus55',
      title: "+55 League",
      excerpt: "Daytime competitive leagues tailored for players aged 55 and over.",
      link: "/55-league",
      image: "https://images.unsplash.com/photo-1530915365547-d05bf946c33c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'juniors',
      title: "Juniors League",
      excerpt: "Fostering the next generation of tennis talent with competitive junior leagues.",
      link: "/junior-league",
      image: "https://images.unsplash.com/photo-1574629810360-7efbb192569a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'tennis-rocks',
      title: "Tennis Rocks",
      excerpt: "An exciting initiative to bring the joy of tennis to new and aspiring players.",
      link: "/tennis-rocks",
      image: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const mockChampionshipSponsors = [
    {
      id: "champ-1",
      name: "Babolat",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Babolat_logo.svg/2560px-Babolat_logo.svg.png",
      link: "https://babolat.com"
    },
    {
      id: "champ-2",
      name: "Wilson",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Wilson_Sporting_Goods_logo.svg/2560px-Wilson_Sporting_Goods_logo.svg.png",
      link: "https://wilson.com"
    },
    {
      id: "champ-3",
      name: "Head",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Head_logo.svg/2560px-Head_logo.svg.png",
      link: "https://head.com"
    },
    {
      id: "champ-4",
      name: "Yonex",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Yonex_logo.svg/2560px-Yonex_logo.svg.png",
      link: "https://yonex.com"
    }
  ];

  return (
    <div className={styles.container}>
      {isEnabled && (
        <div style={{ background: '#d4af37', color: '#000', padding: '10px', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px' }}>
          Preview Mode Active. <a href="/api/disable-draft" style={{ textDecoration: 'underline' }}>Click here to exit</a>.
        </div>
      )}
      <AnimateIn>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroCarouselWrapper}>
            <Carousel images={carouselImages} />
            <div className={styles.heroOverlay}></div>
          </div>
        </section>
        <section className={styles.heroTextSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              InterCounty Tennis Association
            </h1>
            <p className={styles.heroSubtitle}>
              Dedicated to the advancement of team tennis in Southern Ontario
            </p>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={200}>
        {/* Leagues Section */}
        <section className={styles.section} id="leagues">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Explore Our Leagues</h2>
        </div>
        <TabbedLeagues leagues={mockLeagues} />
        </section>
      </AnimateIn>

      <AnimateIn delay={150}>
        <section className={styles.section}>
          <ChampionshipSponsors sponsors={mockChampionshipSponsors} />
        </section>
      </AnimateIn>

      <AnimateIn delay={200}>
        {/* Featured News Section */}
        <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Updates</h2>
          <a href="#news" className={styles.viewAll}>View All News &rarr;</a>
        </div>
        <div className={styles.grid}>
          {newsPosts.map((news) => {
            return (
              <GlassCard
                key={news.id}
                title={stripHtml(news.title.rendered)}
                excerpt=""
                date={formatDate(news.date)}
                link={news.link}
                image={getPostImage(news)}
              />
            );
          })}
          {newsPosts.length === 0 && (
            <p style={{ color: "var(--color-text-muted)" }}>No recent updates available.</p>
          )}
        </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={100}>
        {/* Sponsors Section */}
        <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Sponsors</h2>
        </div>
        <div className={styles.sponsorMarquee}>
          <div className={styles.sponsorMarqueeInner}>
            {sponsors.length > 0 ? (
              // Duplicate the sponsors array to create a seamless infinite scroll loop
              [...sponsors, ...sponsors].map((sponsor, index) => {
                const logoUrl = sponsor._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const linkUrl = stripHtml(sponsor.excerpt?.rendered || "");
                const sponsorTitle = stripHtml(sponsor.title.rendered);
                
                const SponsorInner = () => (
                  <div className={styles.sponsorMarqueeItem}>
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={sponsorTitle} className={styles.sponsorMarqueeImage} />
                    ) : (
                      <span className={styles.sponsorName}>{sponsorTitle}</span>
                    )}
                  </div>
                );

                return linkUrl ? (
                  <a key={`${sponsor.id}-${index}`} href={linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`} target="_blank" rel="noopener noreferrer">
                    <SponsorInner />
                  </a>
                ) : (
                  <div key={`${sponsor.id}-${index}`}>
                    <SponsorInner />
                  </div>
                );
              })
            ) : (
              <p style={{ color: "var(--color-text-muted)" }}>Sponsors coming soon.</p>
            )}
          </div>
        </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={100}>
        {/* About/Stats Section */}
        <section className={styles.section}>
        <div className={`${styles.statsContainer} glass-panel`}>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>
              <AnimatedNumber end={50} suffix="+" />
            </h3>
            <p className={styles.statLabel}>Active Clubs</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>
              <AnimatedNumber end={10} suffix="k+" />
            </h3>
            <p className={styles.statLabel}>Players</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>
              <AnimatedNumber end={5} />
            </h3>
            <p className={styles.statLabel}>Divisions</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statNumber}>
              <AnimatedNumber end={1} />
            </h3>
            <p className={styles.statLabel}>Passion</p>
          </div>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
