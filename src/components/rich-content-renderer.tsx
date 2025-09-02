import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichContentRendererProps {
  content: string;
  maxLength?: number;
  className?: string;
  allowWrap?: boolean;
  showElementsLimit?: number; // New prop for limiting HTML elements
}

// Simple HTML tag regex for detection
const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i;

// Safe HTML tags that we allow for rendering
const SAFE_HTML_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "u",
  "span",
  "div",
];

/**
 * Sanitizes HTML content by removing potentially dangerous tags and attributes
 */
function sanitizeHTML(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*['"'][^'"]*['"']/gi, "");

  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Keep only safe HTML tags
  const tagRegex = /<\/?(\w+)[^>]*>/g;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    if (SAFE_HTML_TAGS.includes(tagName.toLowerCase())) {
      // For safe tags, remove any remaining dangerous attributes
      return match.replace(/\s*(style|class)\s*=\s*['"'][^'"]*['"']/gi, "");
    }
    return ""; // Remove unsafe tags
  });

  return sanitized;
}

/**
 * Parses HTML content and extracts meaningful elements (p, h1-h6, div tags with content)
 */
function parseHTMLElements(html: string): string[] {
  const sanitized = sanitizeHTML(html);
  const elements: string[] = [];

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitized;

  // Extract meaningful elements (paragraphs, headings, divs with text content)
  const meaningfulTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "div"];

  meaningfulTags.forEach((tag) => {
    const elementsOfType = tempDiv.querySelectorAll(tag);
    elementsOfType.forEach((element) => {
      const textContent = element.textContent?.trim();
      if (textContent && textContent.length > 0) {
        elements.push(element.outerHTML);
      }
    });
  });

  return elements;
}

/**
 * Renders content as either plain text or rich HTML based on content type
 */
export function RichContentRenderer({
  content,
  maxLength = 100,
  className,
  allowWrap = false,
  showElementsLimit,
}: RichContentRendererProps) {
  const isHTML = HTML_TAG_REGEX.test(content);
  const shouldTruncate =
    maxLength > 0 && !allowWrap && content.length > maxLength;

  if (!isHTML) {
    // Plain text content
    if (allowWrap || maxLength <= 0) {
      return (
        <div
          className={cn(
            "text-sm leading-relaxed break-words overflow-wrap-anywhere max-w-full hyphens-auto",
            className
          )}
          style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        >
          {content}
        </div>
      );
    }

    // Use truncation with ellipsis
    const displayContent =
      content.length > maxLength
        ? `${content.substring(0, maxLength)}...`
        : content;

    if (shouldTruncate) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "text-sm cursor-help overflow-hidden text-ellipsis whitespace-nowrap",
                  className
                )}
              >
                {displayContent}
              </div>
            </TooltipTrigger>
            <TooltipContent className='max-w-sm'>
              <p className='text-sm break-words'>{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div
        className={cn(
          "text-sm overflow-hidden text-ellipsis whitespace-nowrap",
          className
        )}
      >
        {displayContent}
      </div>
    );
  }

  // HTML content with element limiting (for _basicInfoRtfTestLoop and similar fields)
  if (showElementsLimit && showElementsLimit > 0) {
    const elements = parseHTMLElements(content);
    const hasMoreElements = elements.length > showElementsLimit;
    const displayElements = elements.slice(0, showElementsLimit);

    if (hasMoreElements) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='w-full max-w-full overflow-hidden cursor-help'>
                <div className='flex items-start min-w-0'>
                  <div className='flex-1 min-w-0'>
                    <div
                      className={cn(
                        "rich-content text-sm leading-relaxed break-words overflow-wrap-anywhere max-w-full hyphens-auto [&>h1]:text-sm [&>h1]:font-bold [&>h1]:mb-1 [&>h1]:break-words [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1 [&>h2]:break-words [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-1 [&>h3]:break-words [&>p]:text-xs [&>p]:mb-1 [&>p]:leading-relaxed [&>p]:break-words [&>br]:block [&>br]:content-[''] [&>br]:mt-1",
                        className
                      )}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: displayElements.join(""),
                      }}
                    />
                  </div>
                  <span className='text-muted-foreground ml-2 text-xs flex-shrink-0 self-start mt-1'>
                    +{elements.length - showElementsLimit} more
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className='max-w-md'>
              <div className='space-y-2'>
                <div className='font-medium text-sm'>
                  All Content ({elements.length} items)
                </div>
                <div
                  className='text-xs p-2 bg-gray-50 rounded max-h-60 overflow-y-auto'
                  style={{
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                    hyphens: "auto",
                    whiteSpace: "normal",
                  }}
                >
                  <div
                    className="rich-content text-sm leading-relaxed break-words overflow-wrap-anywhere max-w-full hyphens-auto [&>h1]:text-sm [&>h1]:font-bold [&>h1]:mb-1 [&>h1]:break-words [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1 [&>h2]:break-words [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-1 [&>h3]:break-words [&>p]:text-xs [&>p]:mb-1 [&>p]:leading-relaxed [&>p]:break-words [&>br]:block [&>br]:content-[''] [&>br]:mt-1"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
                  />
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  }

  // Regular HTML content processing
  const processedHTML = sanitizeHTML(content);

  return (
    <div className={cn("w-full max-w-full", className)}>
      <div
        className="rich-content text-sm leading-relaxed break-words overflow-wrap-anywhere max-w-full hyphens-auto [&>h1]:text-sm [&>h1]:font-bold [&>h1]:mb-1 [&>h1]:break-words [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1 [&>h2]:break-words [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-1 [&>h3]:break-words [&>p]:text-xs [&>p]:mb-1 [&>p]:leading-relaxed [&>p]:break-words [&>br]:block [&>br]:content-[''] [&>br]:mt-1"
        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    </div>
  );
}
