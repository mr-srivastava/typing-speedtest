"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A customizable button component with a moving border effect.
 * @param {object} props - The properties object.
 * @param {string} [props.borderRadius="1.75rem"] - The border radius of the button.
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {any} [props.as="button"] - The HTML element or component to render the button as.
 * @param {string} [props.containerClassName] - Additional CSS classes for the button container.
 * @param {string} [props.borderClassName] - Additional CSS classes for the moving border effect.
 * @param {number} [props.duration] - The duration of the moving border animation.
 * @param {string} [props.className] - Additional CSS classes for the button content.
 * @param {Object.<string, any>} [props...otherProps] - Any additional props to be spread on the component.
 * @returns {JSX.Element} A React component representing the customized button.
 */
export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl  h-16 w-64 p-[1px] overflow-hidden ",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

/**
 * A React component that creates a moving border effect around its children.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be wrapped by the moving border.
 * @param {number} [props.duration=2000] - The duration of one complete border animation cycle in milliseconds.
 * @param {string} [props.rx] - The horizontal corner radius of the border.
 * @param {string} [props.ry] - The vertical corner radius of the border.
 * @param {...any} props.otherProps - Additional props to be spread on the outer SVG element.
 * @returns {JSX.Element} A React element with the moving border effect.
 */
export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  /**
   * Animates a path using requestAnimationFrame
   * @param {number} time - The current timestamp of the animation frame
   * @returns {void} This function doesn't return a value
   */
  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    /**
     * Retrieves the x-coordinate of a point on a path at a given length
     * @param {number} val - The length along the path to get the point at
     * @returns {number|undefined} The x-coordinate of the point at the given length, or undefined if the path reference is not available
     /**
      * Retrieves the y-coordinate of a point on a path at a given length.
      * @param {number} val - The length along the path at which to find the point.
      * @returns {number|undefined} The y-coordinate of the point at the specified length, or undefined if the path reference is not available.
      */
     */
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
