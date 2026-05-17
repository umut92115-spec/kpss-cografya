interface JsonLdProps {
  tip:
    | 'WebSite'
    | 'WebPage'
    | 'Article'
    | 'Place'
    | 'FAQPage'
    | 'BreadcrumbList'
    | 'LearningResource'
    | 'Quiz'
    | 'EducationalOrganization'
    | 'AdministrativeArea'
    | 'DiscussionForumPosting'
    | 'QAPage';
  veri: Record<string, unknown>;
}

/** JSON-LD scriptleri için HTML-safe JSON serializer (XSS koruması) */
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export default function JsonLd({ tip, veri }: JsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': tip,
    ...veri,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

