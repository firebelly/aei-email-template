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
        <Column key="text" width="50%" className={`w-1/2 align-top${textFirst ? " bg-aei-light-warm" : ""}`}>
          {article.heading && (
            <Heading as="h3" className="text-h3 text-aei-black mt-2.5 mb-2 mx-2.5">
              {article.heading}
            </Heading>
          )}
          <Text
            className={`text-p text-aei-black mx-2.5${article.heading ? " mt-0" : " mt-2.5"}${article.readMoreUrl ? " mb-0" : " mb-2.5"}`}
          >
            {parseLinks(article.description, "text-aei-red underline")}
          </Text>
          {article.readMoreUrl && (
            <Text className={`text-p text-aei-black mt-2 mx-2.5 mb-2.5`}>
              <Link href={article.readMoreUrl} className="text-p text-aei-red no-underline">
                {article.readMoreText ?? "Read More →"}
              </Link>
            </Text>
          )}
        </Column>
      );
      const imageCol = (
        <td
          key="image"
          width="50%"
          style={{
            width: "50%",
            verticalAlign: "top",
            background: `url(${article.imageUrl}) no-repeat center center / cover`,
            minHeight: "120px",
            padding: "0",
            fontSize: "0",
            lineHeight: "0",
          }}
          dangerouslySetInnerHTML={{
            __html: `
              <!--[if mso]>
              <img src="${article.imageUrl}" width="278" style="width:278px;display:block;" alt="" />
              <![endif]-->
              <!--[if !mso]><!-->
              <div style="min-height:120px;font-size:0;line-height:0;">&nbsp;</div>
              <!--<![endif]-->
            `,
          }}
        />
      );

      return (
        <React.Fragment key={i}>
          {i > 0 && (
            <div style={{ height: "20px", lineHeight: "20px", fontSize: "1px" }}>&nbsp;</div>
          )}
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ borderCollapse: "collapse" }}
          >
            <tr>
              <td
                style={{
                  width: "3px",
                  backgroundColor: borderColorMap[borderColor],
                }}
              />
              <td style={{ padding: 0 }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse" }}
                >
                  <tr>
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
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </React.Fragment>
      );
    })}
  </Section>
);

/** Bulleted news list section */
const NewsSection = ({ heading, items }: { heading: string; items: NewsItem[] }) => (
  <Section className="px-5 py-5">
    <SectionHeading>{heading}</SectionHeading>

    {items.map((item, i) => (
      <Row key={i} className={i < items.length - 1 ? "mb-2" : ""}>
        <Column className="w-[12px] align-top pr-1">
          <Text className="text-p text-aei-black m-0">•</Text>
        </Column>
        <Column className="align-top">
          <Text className="text-p text-aei-black m-0">
            {parseLinks(item.text, "text-aei-red underline")}
          </Text>
        </Column>
      </Row>
    ))}
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

    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{ borderCollapse: "collapse" }}
    >
      <tr>
        <td
          width="3"
          style={{
            width: "3px",
            backgroundColor: borderColorMap[borderColor],
          }}
        />
        <td>
          <Img src={feature.imageUrl} alt={feature.imageAlt} width="557" className="w-full" />
        </td>
      </tr>
    </table>

    <Heading as="h3" className="text-h3 text-aei-black my-3">
      {feature.label && (
        <>
          {feature.label}
          <br />
        </>
      )}
      {feature.title}
    </Heading>
    <Text className="text-p text-aei-black my-0">
      {parseLinks(feature.description, "text-aei-red underline")}
    </Text>
    {feature.ctaStyle === "button" ? (
      <Text className="mt-3 mb-0">
        <Button
          href={feature.ctaUrl}
          className="bg-aei-red text-white text-p py-2.5 px-5 no-underline"
        >
          {feature.ctaText}
        </Button>
      </Text>
    ) : (
      <Text className="mt-1 mb-0">
        <Link
          href={feature.ctaUrl}
          className="text-p text-aei-red"
          style={{ textDecoration: "none" }}
        >
          {feature.ctaText}
        </Link>
      </Text>
    )}
  </Section>
);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface Article {
  heading?: string;
  /** Supports markdown-style links: [link text](url) */
  description: string;
  readMoreUrl?: string;
  readMoreText?: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Feature {
  label?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  ctaStyle: "button" | "link";
  imageUrl: string;
  imageAlt: string;
}

export interface NewsItem {
  /** Supports markdown-style links: [link text](url) */
  text: string;
}

export type BorderColor =
  | "border-l-aei-purple"
  | "border-l-aei-green"
  | "border-l-aei-teal"
  | "border-l-aei-blue"
  | "border-l-aei-yellow"
  | "border-l-aei-red";

/** Maps Tailwind border-color class names to hex values for inline styles (Outlook-safe) */
const borderColorMap: Record<BorderColor, string> = {
  "border-l-aei-purple": "#8177A5",
  "border-l-aei-green": "#86C54C",
  "border-l-aei-teal": "#4FC0B8",
  "border-l-aei-blue": "#549DC0",
  "border-l-aei-yellow": "#FFCD4D",
  "border-l-aei-red": "#F14326",
};

export type ContentSection =
  | {
      id: string;
      type: "article-grid";
      heading: string;
      articles: Article[];
      borderColor: BorderColor;
      startWith: "text" | "image";
    }
  | {
      id: string;
      type: "feature";
      sectionHeading: string;
      feature: Feature;
      borderColor: BorderColor;
    }
  | {
      id: string;
      type: "news";
      heading: string;
      items: NewsItem[];
    };

export interface AEIConnectProps {
  previewText: string;
  issueTitle: string;
  heroImageUrl: string;
  introText: string;
  sections: ContentSection[];
  footerAddress: string;
  unsubscribeUrl: string;
  updateProfileUrl: string;
  dataNoticeUrl: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AEIConnect = ({
  previewText = defaultProps.previewText,
  issueTitle = defaultProps.issueTitle,
  heroImageUrl = defaultProps.heroImageUrl,
  introText = defaultProps.introText,
  sections = defaultProps.sections,
  footerAddress = defaultProps.footerAddress,
  unsubscribeUrl = defaultProps.unsubscribeUrl,
  updateProfileUrl = defaultProps.updateProfileUrl,
  dataNoticeUrl = defaultProps.dataNoticeUrl,
}: Partial<AEIConnectProps> = {}) => {
  const contentSections = sections.map((section) => {
    switch (section.type) {
      case "article-grid":
        return (
          <ArticleGrid
            key={section.id}
            heading={section.heading}
            articles={section.articles}
            borderColor={section.borderColor}
            startWith={section.startWith}
          />
        );
      case "feature":
        return (
          <FeatureSection
            key={section.id}
            sectionHeading={section.sectionHeading}
            feature={section.feature}
            borderColor={section.borderColor}
          />
        );
      case "news":
        return <NewsSection key={section.id} heading={section.heading} items={section.items} />;
    }
  });

  return (
    <Html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <Tailwind config={tailwindConfig}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->`,
            }}
          />
          <meta
            name="format-detection"
            content="telephone=no, date=no, address=no, email=no, url=no"
          />
          <style>{`
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-width: 100% !important;
              -webkit-text-size-adjust: 100% !important;
              -ms-text-size-adjust: 100% !important;
            }
            @media screen and (min-width: 600px) {
              h1 { font-size: 42px !important; }
              h2 { font-size: 17px !important; }
              h3 { font-size: 14px !important; }
              p, a { font-size: 13px !important; }
              .footer p, .footer a { font-size: 12px !important; }
            }
          `}</style>
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="bg-aei-bg font-sans" style={{ margin: "0", padding: "0" }}>
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ margin: 0, padding: 0, borderCollapse: "collapse" }}
          >
            <tr>
              <td align="center" style={{ padding: "28px" }}>
                <Container className="bg-white" style={{ width: "100%", maxWidth: "600px" }}>
                  {/* ----------------------------------------------------------------
              Header — AEI logo
          ----------------------------------------------------------------- */}
                  <Section className="px-5 pt-5 pb-3">
                    <Row>
                      <Column className="w-full text-right">
                        <Link href="https://aeieng.com">
                          <Img
                            src="https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/aei-logo.png"
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
                  <table
                    role="presentation"
                    width="100%"
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: `<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:220px;"><v:fill type="frame" src="${heroImageUrl}" /><v:textbox style="v-text-anchor:middle" inset="0,0,0,0"><![endif]--><div style="background:url(${heroImageUrl}) no-repeat center center / cover;height:220px;"><table role="presentation" width="100%" height="220" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="width:20px"></td><td style="vertical-align:middle"><h1 style="font-size:32px;line-height:1;font-weight:700;color:rgb(255,255,255);margin:0;padding-left:8px;border-top:none;border-right:none;border-bottom:none;border-left:4px solid #F14326">${issueTitle}</h1></td><td style="width:80px;vertical-align:top;padding:0"><table role="presentation" cellpadding="0" cellspacing="0" width="80" style="border-collapse:collapse"><tr><td style="font-size:0;line-height:0"><div style="width:0;height:0;border-right:110px solid #F6F7F5;border-bottom:110px solid transparent"></div></td></tr><tr><td style="font-size:0;line-height:0"><div style="width:0;height:0;border-right:110px solid #F14326;border-top:110px solid transparent"></div></td></tr></table></td></tr></table></div><!--[if mso]></v:textbox></v:rect><![endif]-->`,
                        }}
                      />
                    </tr>
                  </table>
                  <Section className="bg-aei-light-warm p-5">
                    {introText.split(/\n\n+/).map((paragraph, i) => (
                      <Heading
                        key={i}
                        as="h3"
                        className={`text-h3 text-aei-black m-0${i > 0 ? " mt-3" : ""}`}
                      >
                        {parseLinks(paragraph, "text-aei-red underline")}
                      </Heading>
                    ))}
                  </Section>

                  {/* ----------------------------------------------------------------
              Content sections with auto bottom borders
          ----------------------------------------------------------------- */}
                  {contentSections.map((section, i, arr) => (
                    <React.Fragment key={section.key}>
                      {section}
                      {i < arr.length - 1 && (
                        <Section
                          className="px-5"
                          style={{
                            borderTop: "0",
                            borderRight: "0",
                            borderLeft: "0",
                            borderBottom: "1px solid #D4D4C4",
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}

                  {/* ----------------------------------------------------------------
              Footer
          ----------------------------------------------------------------- */}
                  <Section className="footer bg-aei-light-warm">
                    <Row>
                      <td
                        className="pt-9 pb-8 px-8 text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to top right, #F14326 50%, transparent 50%)",
                          backgroundSize: "110px 110px",
                          backgroundPosition: "bottom left",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <Text
                          className="text-p-small text-aei-black m-0 mb-3"
                          style={{ lineHeight: "1.6" }}
                        >
                          <Link
                            href="#"
                            className="text-aei-black no-underline"
                            style={{ color: "#282D28", textDecoration: "none", cursor: "default" }}
                          >
                            {footerAddress}
                          </Link>
                        </Text>
                        <Text
                          className="text-p-small text-aei-black m-0 mb-6"
                          style={{ lineHeight: "1.4" }}
                        >
                          <Link
                            href={unsubscribeUrl}
                            className="text-aei-black underline"
                            style={{
                              color: "#282D28",
                              display: "inline-block",
                              padding: "4px 4px",
                            }}
                          >
                            Unsubscribe
                          </Link>
                          <Link
                            href={updateProfileUrl}
                            className="text-aei-black underline"
                            style={{
                              color: "#282D28",
                              display: "inline-block",
                              padding: "4px 4px",
                            }}
                          >
                            Update Profile
                          </Link>
                          <Link
                            href={dataNoticeUrl}
                            className="text-aei-black underline"
                            style={{
                              color: "#282D28",
                              display: "inline-block",
                              padding: "4px 4px",
                            }}
                          >
                            Constant Contact Data Notice
                          </Link>
                        </Text>
                        <Link href="https://www.constantcontact.com">
                          <Img
                            src="https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/constant-contact-logo.png"
                            alt="Constant Contact"
                            width="110"
                            height="32"
                            className="inline-block"
                          />
                        </Link>
                      </td>
                    </Row>
                    {/* Red triangle in bottom-left corner — VML for Outlook */}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `<!--[if mso]>
<v:shape xmlns:v="urn:schemas-microsoft-com:vml" coordsize="110,110" path="m 0,110 l 110,110 0,0 x e" style="position:absolute;bottom:0;left:0;width:110px;height:110px;" fillcolor="#F14326" stroked="false">
  <v:fill type="solid" color="#F14326" />
</v:shape>
<![endif]-->`,
                      }}
                    />
                  </Section>
                </Container>
              </td>
            </tr>
          </table>
        </Body>
      </Tailwind>
    </Html>
  );
};

// ---------------------------------------------------------------------------
// Default / preview props — matches the design comp content
// ---------------------------------------------------------------------------

export const defaultProps: AEIConnectProps = {
  previewText: "AEI Connect — insights, innovations, and news from across our teams.",
  issueTitle: "AEI Connect",
  heroImageUrl:
    "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/outlook-fixes/emails/static/hero--cropped.png",
  introText:
    "Welcome to this month\u2019s edition of AEI Connect\u2014a curated roundup of insights, innovations, and news from across our teams. Explore what\u2019s new, what\u2019s next, and how we\u2019re designing smarter together.",

  sections: [
    {
      id: "media",
      type: "article-grid",
      heading: "In the Media",
      borderColor: "border-l-aei-purple",
      startWith: "text",
      articles: [
        {
          heading: "Fresh Perspectives from Our Experts",
          description:
            "In an interview with Buildings Magazine, Principal George Howe discusses the advantages of district energy systems and strategies for their deployment\u2026",
          readMoreUrl: "https://aeieng.com",
          readMoreText: "Read More \u2192",
          imageUrl:
            "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/outlook-fixes/emails/static/fresh-perspectives.png",
          imageAlt: "Fresh perspectives from our experts",
        },
        {
          description:
            "In a CSE article, Senior Project Engineer Sam Buscemi examines how cooling infrastructure and power requirements for [AI data centers](https://aeieng.com) are reshaping the use of backup power systems. Sudden power interruptions of cooling failures can push GPU hardware\u2026",
          imageUrl:
            "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/ai-data-center.png",
          imageAlt: "AI data center infrastructure",
        },
      ],
    },
    {
      id: "innovation",
      type: "feature",
      sectionHeading: "Innovation in Action",
      borderColor: "border-l-aei-blue",
      feature: {
        label: "Project Spotlight:",
        title: "Genentech, Inc. B86 Laboratory Tenant Improvement",
        description:
          "This versatile, all-electric laboratory inspires innovation and collaboration while embracing sustainability. AEI\u2019s mechanical, electrical, and plumbing (MEP) and low-voltage engineering services were key to developing infrastructure to support advanced research and development models and promote collaboration among scientists.",
        ctaText: "Explore more \u2192",
        ctaUrl: "https://aeieng.com",
        ctaStyle: "button",
        imageUrl:
          "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/innovation.png",
        imageAlt: "Genentech B86 Laboratory interior showing collaborative workspace",
      },
    },
    {
      id: "newhire",
      type: "article-grid",
      heading: "Welcoming New Talent",
      borderColor: "border-l-aei-green",
      startWith: "text",
      articles: [
        {
          heading: "Meet Our Newest Director of BD",
          description:
            "We are excited to introduce [Ashley Hatley](https://aeieng.com), who will lead strategic client engagement and market growth initiatives across the firm\u2019s core markets in Phoenix, AZ.",
          imageUrl:
            "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/ashley.png",
          imageAlt: "Ashley Hatley",
        },
      ],
    },
    {
      id: "recognition",
      type: "feature",
      sectionHeading: "Recognition & Rankings",
      borderColor: "border-l-aei-yellow",
      feature: {
        title: "Celebrating Excellence",
        description:
          "AEI ranks among the nation\u2019s top Engineering firms in BD+C\u2019s 2025 Giants 400 Report. For the third consecutive year, we are ranked in the Top 2 Science & Technology Laboratory firms, following our #1 ranking in 2024.",
        ctaText: "See more \u2192",
        ctaUrl: "https://aeieng.com",
        ctaStyle: "link",
        imageUrl:
          "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/recognition.png",
        imageAlt: "AEI team members at industry event",
      },
    },
    {
      id: "careers",
      type: "article-grid",
      heading: "Join Our Team",
      borderColor: "border-l-aei-teal",
      startWith: "image",
      articles: [
        {
          heading: "We\u2019re Hiring!",
          description:
            "Be a part of our growing team. At AEI, you\u2019ll join a collaborative community where your expertise fuels innovation, your ideas drive progress, and your work helps shape a brighter future. [Explore current opportunities across diverse disciplines.](https://aeieng.com)",
          imageUrl:
            "https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/team.png",
          imageAlt: "AEI team members collaborating",
        },
      ],
    },
    {
      id: "news",
      type: "news",
      heading: "In the News:",
      items: [
        {
          text: "Principals Kwongyee Yoong and Sean Lawler discuss MEP design strategies for behavioral health facilities, exploring features that not only promote patient safety and comfort but also enhance facility functionality in [Medical Construction & Design](https://aeieng.com).",
        },
        {
          text: "Inspired by Principal Blythe Vogt\u2019s and Project Manager Holly Lattin\u2019s 2025 Lab Design Conference presentation, [Lab Design News](https://aeieng.com) shares the story behind the University of Arkansas\u2019 Institute for Integrative and Innovative Research (I\u00B2R) design.",
        },
        {
          text: "In [Campus Safety](https://aeieng.com), Project Manager Sean Ahrens explores de-escalation as a strategy to defuse conflict and prevent workplace violence in healthcare settings.",
        },
      ],
    },
  ],

  footerAddress: "Affiliated Engineers, Inc. | 5802 Research Park Blvd. Madison, WI 53719 US",
  unsubscribeUrl: "https://aeieng.com",
  updateProfileUrl: "https://aeieng.com",
  dataNoticeUrl: "https://aeieng.com",
};

AEIConnect.PreviewProps = defaultProps;

export default AEIConnect;
