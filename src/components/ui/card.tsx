import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
/**
 * A functional component that renders a styled div element with customizable properties.
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional CSS class names to be applied to the div.
 * @param {React.Ref} ref - A ref object to be attached to the rendered div element.
 * @returns {JSX.Element} A div element with applied styles and properties.
 */
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
/**
 * A React component that renders a div with flexbox column layout and spacing.
 * @param {Object} props - The component props
 * @param {string} [props.className] - Additional CSS class names to apply to the div
 * @param {React.Ref} ref - React ref to be forwarded to the div element
 * @returns {React.ReactElement} A div element with the specified properties and styling
 */
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  /**
   * A React component that renders an h3 element with customizable styles and properties
   * @param {Object} props - The properties passed to the component
   * @param {string} [props.className] - Additional CSS classes to apply to the h3 element
   * @param {React.Ref} ref - A ref object to attach to the h3 element
   * @returns {JSX.Element} An h3 element with the specified properties and styling
   */
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
/**
 * A React functional component that renders a paragraph element with customizable styles.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the paragraph.
 * @param {React.Ref} ref - A ref object to be attached to the paragraph element.
 * @returns {React.ReactElement} A styled paragraph element.
 */
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
/**
 * A functional React component that renders a div element with custom styling and ref forwarding.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS class names to apply to the div.
 * @param {React.Ref} ref - A ref object to be forwarded to the underlying div element.
 * @returns {JSX.Element} A div element with applied className, ref, and other props.
 */
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
/**
 * A React component that renders a div with customizable className and additional props
 * @param {Object} props - The properties passed to the component
 * @param {string} [props.className] - Additional CSS classes to apply to the div
 * @param {React.Ref} ref - A ref object to attach to the rendered div element
 * @returns {JSX.Element} A div element with the specified className and props
 */
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
