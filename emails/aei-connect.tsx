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
  startWith = "text",
}: {
  heading: string;
  articles: Article[];
  borderColor?: string;
  /** Which column appears first in the first row. Subsequent rows alternate. */
  startWith?: "text" | "image";
}) => (
  <Section className="px-5 py-5">
    <SectionHeading>{heading}</SectionHeading>

    {articles.map((article, i) => {
      const textFirst = startWith === "text" ? i % 2 === 0 : i % 2 !== 0;
      const textCol = (
        <Column
          key="text"
          className={`w-1/2 align-top p-2.5${textFirst ? " bg-aei-light-warm" : ""}`}
        >
          {article.heading && (
            <Heading as="h3" className="text-h3 text-aei-black mt-0 mb-2">
              {article.heading}
            </Heading>
          )}
          <Text className="text-p text-aei-black my-0">
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
            background: `url(${article.imageUrl}) no-repeat center center / cover`,
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
            {textFirst ? (
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
  borderColor = "border-l-aei-blue",
}: {
  sectionHeading: string;
  feature: Feature;
  borderColor?: string;
}) => (
  <Section className="px-5 py-5">
    <SectionHeading>{sectionHeading}</SectionHeading>

    <Section className={`border-none border-l-2 border-solid ${borderColor}`}>
      <Img src={feature.imageUrl} alt={feature.imageAlt} width="568" className="w-full" />
    </Section>

    <Heading as="h3" className="text-h3 text-aei-black my-3">
      {feature.label && (
        <>
          {feature.label}
          <br />
        </>
      )}
      {feature.title}
    </Heading>
    <Text className="text-p text-aei-black my-0">{feature.description}</Text>
    {feature.ctaStyle === "button" ? (
      <Button
        href={feature.ctaUrl}
        className="bg-aei-red text-white text-p-small mt-3 py-2.5 px-5 no-underline"
      >
        {feature.ctaText}
      </Button>
    ) : (
      <Link href={feature.ctaUrl} className="text-p-small text-aei-red" style={{ textDecoration: "none" }}>
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


interface NewsItem {
  textBefore: string;
  linkText: string;
  linkUrl: string;
  textAfter: string;
}

interface AEIConnectProps {
  previewText: string;
  issueTitle: string;
  heroImageUrl: string;
  introText: string;
  mediaArticles: Article[];
  spotlight: Feature;
  newHireSectionHeading: string;
  newHires: Article[];
  recognition: Feature;
  careersArticles: Article[];
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
  heroImageUrl,
  introText,
  mediaArticles,
  spotlight,
  newHireSectionHeading,
  newHires,
  recognition,
  careersArticles,
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
    <FeatureSection key="recognition" sectionHeading="Recognition &amp; Rankings" feature={recognition} borderColor="border-l-aei-yellow" />,

    /* ----------------------------------------------------------------
        Join Our Team
    ----------------------------------------------------------------- */
    <ArticleGrid key="careers" heading="Join Our Team" articles={careersArticles} borderColor="border-l-aei-teal" startWith="image" />,

    /* ----------------------------------------------------------------
        In the News
    ----------------------------------------------------------------- */
    <Section key="news" className="px-5 py-5">
      <SectionHeading>In the News:</SectionHeading>

      {newsItems.map((item, i) => (
        <Row key={i} className={i < newsItems.length - 1 ? "mb-2" : ""}>
          <Column className="w-[12px] align-top pr-1">
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
              Intro — hero image with chevron cutout + intro text
          ----------------------------------------------------------------- */}
            <Section>
              <Row>
                <td
                  style={{
                    background: `url(${heroImageUrl}) no-repeat center center / cover`,
                    height: "220px",
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;"><v:fill type="frame" src="${heroImageUrl}" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->`,
                    }}
                  />
                  <table
                    role="presentation"
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      {/* Left spacer */}
                      <td style={{ width: "20px" }} />
                      {/* Heading with red left border */}
                      <td
                        style={{
                          paddingTop: "24px",
                          paddingBottom: "24px",
                          verticalAlign: "middle",
                        }}
                      >
                        <Heading
                          as="h1"
                          className="text-h1 text-white m-0 border-0 border-l-4 border-solid border-l-aei-red pl-2"
                        >
                          {issueTitle}
                        </Heading>
                      </td>
                      {/* White chevron triangles */}
                      <td style={{ width: "80px", verticalAlign: "top", padding: "0" }}>
                        <table
                          role="presentation"
                          cellPadding={0}
                          cellSpacing={0}
                          width={80}
                          style={{ borderCollapse: "collapse" }}
                        >
                          <tr>
                            <td style={{ fontSize: "0", lineHeight: "0" }}>
                              <div
                                style={{
                                  width: "0",
                                  height: "0",
                                  borderRight: "110px solid #F6F7F5",
                                  borderBottom: "110px solid transparent",
                                }}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: "0", lineHeight: "0" }}>
                              <div
                                style={{
                                  width: "0",
                                  height: "0",
                                  borderRight: "110px solid #F14326",
                                  borderTop: "110px solid transparent",
                                }}
                              />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `<!--[if mso]></v:textbox></v:rect><![endif]-->`,
                    }}
                  />
                </td>
              </Row>
            </Section>
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
            <Section className="bg-aei-light-warm">
              <Row>
                {/* Red triangle in bottom-left corner */}
                <td style={{ width: "110px", verticalAlign: "bottom", padding: "0" }}>
                  <div
                    style={{
                      width: "0",
                      height: "0",
                      borderLeft: "110px solid #F14326",
                      borderTop: "110px solid transparent",
                    }}
                  />
                </td>
                {/* Footer content */}
                <td className="pt-10 pb-8 text-center">
                  <Text className="text-p-small text-aei-black m-0 mb-5">{footerAddress}</Text>
                  <Text className="text-p-small text-aei-black m-0 mb-7">
                    <Link href={unsubscribeUrl} className="text-aei-black underline">
                      Unsubscribe
                    </Link>
                    {"   "}
                    <Link href={updateProfileUrl} className="text-aei-black underline">
                      Update Profile
                    </Link>
                    {"   "}
                    <Link href={dataNoticeUrl} className="text-aei-black underline">
                      Constant Contact Data Notice
                    </Link>
                  </Text>
                  <Link href="https://www.constantcontact.com">
                    <Img
                      src="/static/constant-contact-logo.png"
                      alt="Constant Contact"
                      width="110"
                      height="32"
                      className="inline-block"
                    />
                  </Link>
                </td>
                {/* Spacer for centering symmetry */}
                <td style={{ width: "110px" }} />
              </Row>
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
  heroImageUrl: "/static/innovation.png",
  introText:
    "Welcome to this month\u2019s edition of AEI Connect\u2014a curated roundup of insights, innovations, and news from across our teams. Explore what\u2019s new, what\u2019s next, and how we\u2019re designing smarter together.",

  mediaArticles: [
    {
      heading: "Fresh Perspectives from Our Experts",
      description:
        "In an interview with Buildings Magazine, Principal George Howe discusses the advantages of district energy systems and strategies for their deployment\u2026",
      readMoreUrl: "https://aeieng.com",
      readMoreText: "Read More \u2192",
      imageUrl: "/static/fresh-perspectives.png",
      imageAlt: "Fresh perspectives from our experts",
    },
    {
      description:
        "In a CSE article, Senior Project Engineer Sam Buscemi examines how cooling infrastructure and power requirements for [AI data centers](https://aeieng.com) are reshaping the use of backup power systems. Sudden power interruptions of cooling failures can push GPU hardware\u2026",
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
    ctaUrl: "https://aeieng.com",
    ctaStyle: "button",
    imageUrl: "/static/innovation.png",
    imageAlt: "Genentech B86 Laboratory interior showing collaborative workspace",
  },

  newHireSectionHeading: "Welcoming New Talent",
  newHires: [
    {
      heading: "Meet Our Newest Director of BD",
      description:
        "We are excited to introduce [Ashley Hatley](https://aeieng.com), who will lead strategic client engagement and market growth initiatives across the firm\u2019s core markets in Phoenix, AZ.",
      imageUrl: "/static/ashley.png",
      imageAlt: "Ashley Hatley",
    },
  ],

  recognition: {
    title: "Celebrating Excellence",
    description:
      "AEI ranks among the nation\u2019s top Engineering firms in BD+C\u2019s 2025 Giants 400 Report. For the third consecutive year, we are ranked in the Top 2 Science & Technology Laboratory firms, following our #1 ranking in 2024.",
    ctaText: "See more \u2192",
    ctaUrl: "https://aeieng.com",
    ctaStyle: "link",
    imageUrl: "/static/recognition.png",
    imageAlt: "AEI team members at industry event",
  },

  careersArticles: [
    {
      heading: "We\u2019re Hiring!",
      description:
        "Be a part of our growing team. At AEI, you\u2019ll join a collaborative community where your expertise fuels innovation, your ideas drive progress, and your work helps shape a brighter future. [Explore current opportunities across diverse disciplines.](https://aeieng.com)",
      imageUrl: "/static/team.png",
      imageAlt: "AEI team members collaborating",
    },
  ],

  newsItems: [
    {
      textBefore:
        "Principals Kwongyee Yoong and Sean Lawler discuss MEP design strategies for behavioral health facilities, exploring features that not only promote patient safety and comfort but also enhance facility functionality in ",
      linkText: "Medical Construction & Design",
      linkUrl: "https://aeieng.com",
      textAfter: ".",
    },
    {
      textBefore:
        "Inspired by Principal Blythe Vogt\u2019s and Project Manager Holly Lattin\u2019s 2025 Lab Design Conference presentation, ",
      linkText: "Lab Design News",
      linkUrl: "https://aeieng.com",
      textAfter:
        " shares the story behind the University of Arkansas\u2019 Institute for Integrative and Innovative Research (I\u00B2R) design.",
    },
    {
      textBefore: "In ",
      linkText: "Campus Safety",
      linkUrl: "https://aeieng.com",
      textAfter:
        ", Project Manager Sean Ahrens explores de-escalation as a strategy to defuse conflict and prevent workplace violence in healthcare settings.",
    },
  ],

  footerAddress: "Affiliated Engineers, Inc. | 5802 Research Park Blvd. Madison, WI 53719 US",
  unsubscribeUrl: "https://aeieng.com",
  updateProfileUrl: "https://aeieng.com",
  dataNoticeUrl: "https://aeieng.com",
} satisfies AEIConnectProps;

export default AEIConnect;
