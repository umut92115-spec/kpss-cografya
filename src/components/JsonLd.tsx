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
    | 'AdministrativeArea';
  veri: Record<string, unknown>;
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
