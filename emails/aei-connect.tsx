import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig from "./tailwind.config";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parses markdown-style [text](url) links into React Email Link components */
const parseLinks = (text: string, linkClass: string) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <Link key={i} href={match[2]} className={linkClass}>
          {match[1]}
        </Link>
      );
    }
    return part;
  });
};

/** Reusable section heading with consistent spacing */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h2" className="text-h2 text-aei-black mt-0 mb-5">
    {children}
  </Heading>
);

/** Reusable two-column article grid with alternating text/image layout */
const ArticleGrid = ({
  heading,
  articles,
  borderColor = "border-l-aei-purple",
}: {
  heading: string;
  articles: Article[];
  borderColor?: string;
}) => (
  <Section className="px-5 py-5">
    <SectionHeading>{heading}</SectionHeading>

    {articles.map((article, i) => {
      const isEven = i % 2 === 0;
      const textCol = (
        <Column
          key="text"
          className={`w-1/2 align-top p-2.5${isEven ? " bg-aei-light-warm" : ""}`}
        >
          {article.heading && (
            <Heading as="h3" className="text-h3 text-aei-black mt-0 mb-2">
              {article.heading}
            </Heading>
          )}
          <Text className="text-p text-aei-black m-0 mb-2">
            {parseLinks(article.description, "text-aei-red underline")}
          </Text>
          {article.readMoreUrl && (
            <Link href={article.readMoreUrl} className="text-p-small text-aei-red no-underline">
              {article.readMoreText ?? "Read More →"}
            </Link>
          )}
        </Column>
      );
      const imageCol = (
        <td
          key="image"
          style={{
            width: "50%",
            verticalAlign: "top",
            backgroundImage: `url(${article.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "120px",
          }}
          dangerouslySetInnerHTML={{
            __html: `
              <!--[if mso]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:260px;min-height:120px;">
                <v:fill type="frame" src="${article.imageUrl}" />
                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
              <![endif]-->
              <div style="min-height:120px;font-size:0;line-height:0;">&nbsp;</div>
              <!--[if mso]>
                </v:textbox>
              </v:rect>
              <![endif]-->
            `,
          }}
        />
      );

      return (
        <Section key={i} className={`border-none border-l-2 border-solid ${borderColor}${i > 0 ? " mt-5" : ""}`}>
          <Row>
            {isEven ? (
              <>
                {textCol}
                {imageCol}
              </>
            ) : (
              <>
                {imageCol}
                {textCol}
              </>
            )}
          </Row>
        </Section>
      );
    })}
  </Section>
);

/** Reusable full-width feature section with image, heading, description, and CTA */
const FeatureSection = ({
  sectionHeading,
  feature,
}: {
  sectionHeading: string;
  feature: Feature;
}) => (
  <Section className="px-5 py-5">
    <SectionHeading>{sectionHeading}</SectionHeading>

    <Img src={feature.imageUrl} alt={feature.imageAlt} width="568" className="w-full mb-4" />

    <Heading as="h3" className="text-h3 text-aei-black mt-0 mb-2">
      {feature.label && (
        <>
          {feature.label}
          <br />
        </>
      )}
      {feature.title}
    </Heading>
    <Text className="text-p text-aei-black m-0 mb-4">{feature.description}</Text>
    {feature.ctaStyle === "button" ? (
      <Button
        href={feature.ctaUrl}
        className="bg-aei-red text-white text-p-small py-2.5 px-5 no-underline box-border"
      >
        {feature.ctaText}
      </Button>
    ) : (
      <Link href={feature.ctaUrl} className="text-p-small text-aei-red no-underline">
        {feature.ctaText}
      </Link>
    )}
  </Section>
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Article {
  heading?: string;
  /** Supports markdown-style links: [link text](url) */
  description: string;
  readMoreUrl?: string;
  readMoreText?: string;
  imageUrl: string;
  imageAlt: string;
}

interface Feature {
  label?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaStyle: "button" | "link";
  imageUrl: string;
  imageAlt: string;
}

interface Careers {
  heading: string;
  description: string;
  linkText: string;
  linkUrl: string;
  imageUrl: string;
  imageAlt: string;
}

interface NewsItem {
  textBefore: string;
  linkText: string;
  linkUrl: string;
  textAfter: string;
}

interface AEIConnectProps {
  previewText: string;
  issueTitle: string;
  introText: string;
  mediaArticles: Article[];
  spotlight: Feature;
  newHireSectionHeading: string;
  newHires: Article[];
  recognition: Feature;
  careers: Careers;
  newsItems: NewsItem[];
  footerAddress: string;
  unsubscribeUrl: string;
  updateProfileUrl: string;
  dataNoticeUrl: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AEIConnect = ({
  previewText,
  issueTitle,
  introText,
  mediaArticles,
  spotlight,
  newHireSectionHeading,
  newHires,
  recognition,
  careers,
  newsItems,
  footerAddress,
  unsubscribeUrl,
  updateProfileUrl,
  dataNoticeUrl,
}: AEIConnectProps) => {
  const contentSections = [
    /* ----------------------------------------------------------------
        In the Media
    ----------------------------------------------------------------- */
    <ArticleGrid key="media" heading="In the Media" articles={mediaArticles} />,

    /* ----------------------------------------------------------------
        Innovation in Action
    ----------------------------------------------------------------- */
    <FeatureSection key="innovation" sectionHeading="Innovation in Action" feature={spotlight} />,

    /* ----------------------------------------------------------------
        Welcoming New Talent
    ----------------------------------------------------------------- */
    <ArticleGrid key="newhire" heading={newHireSectionHeading} articles={newHires} borderColor="border-l-aei-green" />,

    /* ----------------------------------------------------------------
        Recognition & Rankings
    ----------------------------------------------------------------- */
    <FeatureSection key="recognition" sectionHeading="Recognition &amp; Rankings" feature={recognition} />,

    /* ----------------------------------------------------------------
        Join Our Team
    ----------------------------------------------------------------- */
    <Section key="careers" className="px-5 py-5">
      <SectionHeading>Join Our Team</SectionHeading>

      <Row>
        <Column className="w-1/2 align-top pr-3">
          <Img src={careers.imageUrl} alt={careers.imageAlt} width="270" className="w-full" />
        </Column>
        <Column className="w-1/2 align-top pl-3">
          <Heading as="h3" className="text-h3 text-aei-red mt-0 mb-2">
            {careers.heading}
          </Heading>
          <Text className="text-p text-aei-black m-0">
            {careers.description}{" "}
            <Link href={careers.linkUrl} className="text-aei-red underline">
              {careers.linkText}
            </Link>
          </Text>
        </Column>
      </Row>
    </Section>,

    /* ----------------------------------------------------------------
        In the News
    ----------------------------------------------------------------- */
    <Section key="news" className="px-5 py-5">
      <SectionHeading>In the News:</SectionHeading>

      {newsItems.map((item, i) => (
        <Row key={i} className="mb-3">
          <Column className="w-[12px] align-top pr-2">
            <Text className="text-p text-aei-black m-0">•</Text>
          </Column>
          <Column className="align-top">
            <Text className="text-p text-aei-black m-0">
              {item.textBefore}
              <Link href={item.linkUrl} className="text-aei-red underline">
                {item.linkText}
              </Link>
              {item.textAfter}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>,
  ];

  return (
    <Html lang="en">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-aei-bg font-sans m-0 p-7">
          <Container className="mx-auto max-w-[600px] bg-white">
            {/* ----------------------------------------------------------------
              Header — AEI logo
          ----------------------------------------------------------------- */}
            <Section className="px-5 pt-5 pb-3">
              <Row>
                <Column className="w-full text-right">
                  <Link href="https://aeieng.com">
                    <Img
                      src="/static/aei-logo.png"
                      alt="Affiliated Engineers, Inc."
                      width="125"
                      height="28"
                      className="inline-block"
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* ----------------------------------------------------------------
              Hero — "AEI Connect" with red left border
          ----------------------------------------------------------------- */}
            <Section className="px-5 pb-6">
              <Section className="bg-aei-light py-6 px-5">
                <Section className="border-none border-l-4 border-solid border-l-aei-red pl-4">
                  <Heading as="h1" className="text-h1 text-aei-black m-0">
                    {issueTitle}
                  </Heading>
                </Section>
              </Section>
            </Section>

            {/* ----------------------------------------------------------------
              Intro text
          ----------------------------------------------------------------- */}
            <Section className="bg-aei-light-warm p-5">
              <Text className="text-h3 text-aei-black m-0">{introText}</Text>
            </Section>

            {/* ----------------------------------------------------------------
              Content sections with auto bottom borders
          ----------------------------------------------------------------- */}
            {contentSections.map((section, i) => (
              <React.Fragment key={section.key}>
                {section}
                {i < contentSections.length - 1 && (
                  <Section className="px-5 border-none border-b border-solid border-b-aei-bg" />
                )}
              </React.Fragment>
            ))}

            {/* ----------------------------------------------------------------
              Footer
          ----------------------------------------------------------------- */}
            <Section className="px-5 py-6 text-center">
              <Text className="text-p-small text-aei-black m-0 mb-3">{footerAddress}</Text>
              <Text className="text-p-small text-aei-black m-0">
                <Link href={unsubscribeUrl} className="text-aei-red underline">
                  Unsubscribe
                </Link>
                {"   "}
                <Link href={updateProfileUrl} className="text-aei-red underline">
                  Update Profile
                </Link>
                {"   "}
                <Link href={dataNoticeUrl} className="text-aei-red underline">
                  Constant Contact Data Notice
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// ---------------------------------------------------------------------------
// Preview props — matches the design comp content
// ---------------------------------------------------------------------------

AEIConnect.PreviewProps = {
  previewText: "AEI Connect — insights, innovations, and news from across our teams.",
  issueTitle: "AEI Connect",
  introText:
    "Welcome to this month\u2019s edition of AEI Connect\u2014a curated roundup of insights, innovations, and news from across our teams. Explore what\u2019s new, what\u2019s next, and how we\u2019re designing smarter together.",

  mediaArticles: [
    {
      heading: "Fresh Perspectives from Our Experts",
      description:
        "In an interview with Buildings Magazine, Principal George Howe discusses the advantages of district energy systems and strategies for their deployment\u2026",
      readMoreUrl: "#",
      readMoreText: "Read More \u2192",
      imageUrl: "/static/fresh-perspectives.png",
      imageAlt: "Fresh perspectives from our experts",
    },
    {
      description:
        "In a CSE article, Senior Project Engineer Sam Buscemi examines how cooling infrastructure and power requirements for [AI data centers](#) are reshaping the use of backup power systems. Sudden power interruptions of cooling failures can push GPU hardware\u2026",
      imageUrl: "/static/ai-data-center.png",
      imageAlt: "AI data center infrastructure",
    },
    {
      heading: "Fresh Perspectives from Our Experts",
      description:
        "In an interview with Buildings Magazine, Principal George Howe discusses the advantages of district energy systems and strategies for their deployment. These systems offer significant benefits for campus environments, enabling centralized heating and cooling that reduces energy consumption and operational costs across multiple buildings\u2026",
      readMoreUrl: "#",
      readMoreText: "Read More \u2192",
      imageUrl: "/static/fresh-perspectives.png",
      imageAlt: "Fresh perspectives from our experts",
    },
    {
      description:
        "examines how cooling infrastructure and power requirements for [AI data centers](#) are reshaping the use of backup power systems. Sudden power interruptions of cooling failures can push GPU hardware. As demand for AI workloads continues to grow, engineers must rethink traditional approaches to redundancy and thermal management in these critical facilities\u2026",
      imageUrl: "/static/ai-data-center.png",
      imageAlt: "AI data center infrastructure",
    },
  ],

  spotlight: {
    label: "Project Spotlight:",
    title: "Genentech, Inc. B86 Laboratory Tenant Improvement",
    description:
      "This versatile, all-electric laboratory inspires innovation and collaboration while embracing sustainability. AEI\u2019s mechanical, electrical, and plumbing (MEP) and low-voltage engineering services were key to developing infrastructure to support advanced research and development models and promote collaboration among scientists.",
    ctaText: "Explore more \u2192",
    ctaUrl: "#",
    ctaStyle: "button",
    imageUrl: "/static/innovation.png",
    imageAlt: "Genentech B86 Laboratory interior showing collaborative workspace",
  },

  newHireSectionHeading: "Welcoming New Talent",
  newHires: [
    {
      heading: "Meet Our Newest Director of BD",
      description:
        "We are excited to introduce [Ashley Hatley](#), who will lead strategic client engagement and market growth initiatives across the firm\u2019s core markets in Phoenix, AZ.",
      imageUrl: "/static/ashley.png",
      imageAlt: "Ashley Hatley",
    },
  ],

  recognition: {
    title: "Celebrating Excellence",
    description:
      "AEI ranks among the nation\u2019s top Engineering firms in BD+C\u2019s 2025 Giants 400 Report. For the third consecutive year, we are ranked in the Top 2 Science & Technology Laboratory firms, following our #1 ranking in 2024.",
    ctaText: "See more \u2192",
    ctaUrl: "#",
    ctaStyle: "link",
    imageUrl: "/static/recognition.png",
    imageAlt: "AEI team members at industry event",
  },

  careers: {
    heading: "We\u2019re Hiring!",
    description:
      "Be a part of our growing team. At AEI, you\u2019ll join a collaborative community where your expertise fuels innovation, your ideas drive progress, and your work helps shape a brighter future.",
    linkText: "Explore current opportunities across diverse disciplines.",
    linkUrl: "#",
    imageUrl: "/static/team.png",
    imageAlt: "AEI team members collaborating",
  },

  newsItems: [
    {
      textBefore:
        "Principals Kwongyee Yoong and Sean Lawler discuss MEP design strategies for behavioral health facilities, exploring features that not only promote patient safety and comfort but also enhance facility functionality in ",
      linkText: "Medical Construction & Design",
      linkUrl: "#",
      textAfter: ".",
    },
    {
      textBefore:
        "Inspired by Principal Blythe Vogt\u2019s and Project Manager Holly Lattin\u2019s 2025 Lab Design Conference presentation, ",
      linkText: "Lab Design News",
      linkUrl: "#",
      textAfter:
        " shares the story behind the University of Arkansas\u2019 Institute for Integrative and Innovative Research (I\u00B2R) design.",
    },
    {
      textBefore: "In ",
      linkText: "Campus Safety",
      linkUrl: "#",
      textAfter:
        ", Project Manager Sean Ahrens explores de-escalation as a strategy to defuse conflict and prevent workplace violence in healthcare settings.",
    },
  ],

  footerAddress: "Affiliated Engineers, Inc. | 5802 Research Park Blvd. Madison, WI 53719 US",
  unsubscribeUrl: "#",
  updateProfileUrl: "#",
  dataNoticeUrl: "#",
} satisfies AEIConnectProps;

export default AEIConnect;
