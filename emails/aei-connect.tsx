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
  showDivider = false,
}: {
  heading: string;
  articles: Article[];
  borderColor?: BorderColor;
  /** Which column appears first in the first row. Subsequent rows alternate. */
  startWith?: "text" | "image";
  showDivider?: boolean;
}) => (
  <table
    role="presentation"
    width="100%"
    border={0}
    cellPadding={0}
    cellSpacing={0}
    style={{ borderCollapse: "collapse" }}
  >
    <tr>
      <td style={{ padding: "20px" }}>
        <SectionHeading>{heading}</SectionHeading>

        {articles.map((article, i) => {
          const textFirst = startWith === "text" ? i % 2 === 0 : i % 2 !== 0;
          const textCol = (
            <td
              key="text"
              width="50%"
              dir="ltr"
              className={`article-col article-text w-1/2 align-top${i % 2 === 0 ? " bg-aei-light-gray" : " bg-white"}`}
              style={{ width: "50%", verticalAlign: "top" }}
            >
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
            </td>
          );
          const imageCol = (
            <td
              key="image"
              width="50%"
              dir="ltr"
              className="article-col article-img"
              style={{
                width: "50%",
                verticalAlign: "top",
                background: `url(${article.imageUrl}) no-repeat center top / cover`,
                minHeight: "186px",
                padding: "0",
                fontSize: "0",
                lineHeight: "0",
                borderLeftColor: borderColorMap[borderColor],
                borderLeftStyle: "none",
              }}
              dangerouslySetInnerHTML={{
                __html: `
              <!--[if mso]>
              <img src="${article.imageUrl}" width="278" style="width:278px;display:block;" alt="" />
              <![endif]-->
              <!--[if !mso]><!-->
              <div style="min-height:186px;font-size:0;line-height:0;">&nbsp;</div>
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
                border={0}
                cellPadding={0}
                cellSpacing={0}
                style={{ borderCollapse: "collapse" }}
              >
                <tr>
                  <td
                    className="article-border"
                    style={{
                      width: "3px",
                      backgroundColor: borderColorMap[borderColor],
                    }}
                  />
                  <td style={{ padding: 0 }}>
                    <table
                      role="presentation"
                      width="100%"
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      dir={textFirst ? "rtl" : "ltr"}
                      style={{ borderCollapse: "collapse" }}
                    >
                      <tr>
                        {imageCol}
                        {textCol}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </React.Fragment>
          );
        })}
      </td>
    </tr>
    {showDivider && (
      <tr>
        <td
          style={{
            backgroundColor: "#d1ccc1",
            height: "1px",
            lineHeight: "1px",
            fontSize: "1px",
            msoLineHeightRule: "exactly",
          }}
        >
          &nbsp;
        </td>
      </tr>
    )}
  </table>
);

/** Bulleted news list section */
const NewsSection = ({
  heading,
  items,
  showDivider = false,
}: {
  heading: string;
  items: NewsItem[];
  showDivider?: boolean;
}) => (
  <table
    role="presentation"
    width="100%"
    border={0}
    cellPadding={0}
    cellSpacing={0}
    style={{ borderCollapse: "collapse" }}
  >
    <tr>
      <td style={{ padding: "20px" }}>
        <SectionHeading>{heading}</SectionHeading>

        {items.map((item, i) => (
          <Text
            key={i}
            className={`text-p text-aei-black m-0${i < items.length - 1 ? " mb-2" : ""}`}
            style={{ marginLeft: "12px", textIndent: "-13px" }}
          >
            •&nbsp;&nbsp;{parseLinks(item.text, "text-aei-red underline")}
          </Text>
        ))}
      </td>
    </tr>
    {showDivider && (
      <tr>
        <td
          style={{
            backgroundColor: "#d1ccc1",
            height: "1px",
            lineHeight: "1px",
            fontSize: "1px",
            msoLineHeightRule: "exactly",
          }}
        >
          &nbsp;
        </td>
      </tr>
    )}
  </table>
);

/** Reusable full-width feature section with image, heading, description, and CTA */
const FeatureSection = ({
  sectionHeading,
  feature,
  borderColor = "border-l-aei-blue",
  showDivider = false,
}: {
  sectionHeading: string;
  feature: Feature;
  borderColor?: BorderColor;
  showDivider?: boolean;
}) => (
  <table
    role="presentation"
    width="100%"
    border={0}
    cellPadding={0}
    cellSpacing={0}
    style={{ borderCollapse: "collapse" }}
  >
    <tr>
      <td style={{ padding: "20px" }}>
        <SectionHeading>{sectionHeading}</SectionHeading>

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
              style={{
                borderLeft: `3px solid ${borderColorMap[borderColor]}`,
                padding: 0,
                lineHeight: 0,
                fontSize: 0,
              }}
            >
              <Img src={feature.imageUrl} alt={feature.imageAlt} width="557" className="w-full" style={{ display: "block" }} />
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
      </td>
    </tr>
    {showDivider && (
      <tr>
        <td
          style={{
            backgroundColor: "#d1ccc1",
            height: "1px",
            lineHeight: "1px",
            fontSize: "1px",
            msoLineHeightRule: "exactly",
          }}
        >
          &nbsp;
        </td>
      </tr>
    )}
  </table>
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
  "border-l-aei-purple": "#8373a5",
  "border-l-aei-green": "#8EC150",
  "border-l-aei-teal": "#49B7B6",
  "border-l-aei-blue": "#5193BF",
  "border-l-aei-yellow": "#FCC947",
  "border-l-aei-red": "#ef4734",
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
  heroImageUrl: string;
  mobileHeroImageUrl: string;
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
  heroImageUrl = defaultProps.heroImageUrl,
  mobileHeroImageUrl = defaultProps.mobileHeroImageUrl,
  introText = defaultProps.introText,
  sections = defaultProps.sections,
  footerAddress = defaultProps.footerAddress,
  unsubscribeUrl = defaultProps.unsubscribeUrl,
  updateProfileUrl = defaultProps.updateProfileUrl,
  dataNoticeUrl = defaultProps.dataNoticeUrl,
}: Partial<AEIConnectProps> = {}) => {
  const contentSections = sections.map((section, i, arr) => {
    const showDivider = i < arr.length - 1;
    switch (section.type) {
      case "article-grid":
        return (
          <ArticleGrid
            key={section.id}
            heading={section.heading}
            articles={section.articles}
            borderColor={section.borderColor}
            startWith={section.startWith}
            showDivider={showDivider}
          />
        );
      case "feature":
        return (
          <FeatureSection
            key={section.id}
            sectionHeading={section.sectionHeading}
            feature={section.feature}
            borderColor={section.borderColor}
            showDivider={showDivider}
          />
        );
      case "news":
        return (
          <NewsSection
            key={section.id}
            heading={section.heading}
            items={section.items}
            showDivider={showDivider}
          />
        );
    }
  });

  return (
    <Html lang="en" {...{ "xmlns:v": "urn:schemas-microsoft-com:vml", "xmlns:o": "urn:schemas-microsoft-com:office:office" }}>
      <Tailwind config={tailwindConfig}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light only" />
          <meta name="supported-color-modes" content="light" />
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
            @media screen and (max-width: 599px) {
              h1 { font-size: 32px !important; border-left-width: 3px !important; }
              h2 { font-size: 15px !important; }
              h3 { font-size: 14px !important; }
              p, a { font-size: 13px !important; }
              .footer p, .footer a { font-size: 11px !important; }
              .article-col {
                display: block !important;
                width: 100% !important;
                direction: ltr !important;
              }
              .article-border {
                display: none !important;
              }
              .article-img {
                border-left-width: 3px !important;
                border-left-style: solid !important;
                box-sizing: border-box !important;
              }
              .article-text {
                overflow: hidden !important;
              }
            }
            @media screen and (max-width: 420px) {
              .hero-desktop {
                display: none !important;
                max-height: 0 !important;
                overflow: hidden !important;
              }
              .hero-mobile {
                display: block !important;
                max-height: none !important;
              }
            }
            .footer-container { background: #d1ccc1 !important; background-color: #d1ccc1 !important; }

          `}</style>
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--[if mso]><style>body, table, td, p, h1, h2, h3, a, span { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->`,
            }}
          />
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="bg-aei-quartz-gray font-sans" style={{ margin: "0", padding: "0", fontFamily: "Arial, Helvetica, sans-serif" }}>
          <table
            role="presentation"
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ margin: 0, padding: 0, borderCollapse: "collapse", fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <tr>
              <td align="center" style={{ padding: "28px" }}>
                <Container className="bg-white" style={{ width: "100%", maxWidth: "600px", fontFamily: "Arial, Helvetica, sans-serif" }}>
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
              Intro — hero image + intro text
          ----------------------------------------------------------------- */}
                  <Img
                    className="hero-desktop"
                    src={heroImageUrl}
                    alt="AEI Connect"
                    width="600"
                    style={{ width: "100%", display: "block" }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<!--[if !mso]><!-->
<img class="hero-mobile" src="${mobileHeroImageUrl}" alt="AEI Connect" width="600" style="width:100%;display:none;max-height:0;overflow:hidden;" />
<!--<![endif]-->`,
                    }}
                  />
                  <Section className="bg-aei-light-gray p-5">
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
                  {contentSections}

                  {/* ----------------------------------------------------------------
              Footer
          ----------------------------------------------------------------- */}
                  <table
                    role="presentation"
                    width="100%"
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    className="footer"
                    style={{ borderCollapse: "collapse" }}
                  >
                    <tr>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: `<!--[if gte mso 9]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:172px;">
<v:fill type="frame" src="https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/footer-strip.png" color="#f5f1ed" />
<v:textbox inset="32px,36px,32px,32px">
<![endif]-->
<div style="background-color:#f5f1ed;background-image:linear-gradient(to top right, #ef4734 50%, transparent 50%);background-size:110px 110px;background-position:bottom left;background-repeat:no-repeat;padding:36px 32px 32px 32px;text-align:center;">
<p style="font-size:11px;line-height:1.6;font-weight:400;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;color:#282826;margin:0;margin-bottom:12px;text-align:center;">
<a href="#" style="color:#282826;text-decoration:none;cursor:default;">${footerAddress}</a>
</p>
<p style="font-size:11px;line-height:1.4;font-weight:400;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;color:#282826;margin:0;margin-bottom:24px;text-align:center;">
<a href="${unsubscribeUrl}" style="color:#282826;text-decoration:underline;display:inline-block;padding:4px 4px;">Unsubscribe</a><!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
<a href="${updateProfileUrl}" style="color:#282826;text-decoration:underline;display:inline-block;padding:4px 4px;">Update Profile</a><!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
<a href="${dataNoticeUrl}" style="color:#282826;text-decoration:underline;display:inline-block;padding:4px 4px;">Constant Contact Data Notice</a>
</p>
<p style="margin:0;text-align:center;">
<a href="https://www.constantcontact.com"><img src="https://raw.githubusercontent.com/firebelly/aei-email-template/refs/heads/main/emails/static/constant-contact-logo.png" alt="Constant Contact" width="110" height="32" style="display:inline-block;" /></a>
</p>
</div>
<!--[if gte mso 9]>
</v:textbox>
</v:rect>
<![endif]-->`,
                        }}
                      />
                    </tr>
                  </table>
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
  heroImageUrl:
    "https://raw.githubusercontent.com/firebelly/aei-email-template/750cae55b961f643c9a1460d4aa48f4b01fcb039/emails/static/newsletter_hero_desktop.jpg",
  mobileHeroImageUrl:
    "https://raw.githubusercontent.com/firebelly/aei-email-template/750cae55b961f643c9a1460d4aa48f4b01fcb039/emails/static/newsletter_hero_mobile.jpg",
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
