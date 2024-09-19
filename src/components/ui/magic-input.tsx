"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * MagicInput component for creating an animated input field with placeholder cycling and text vanishing effects.
 * @param {Object} props - The properties passed to the component.
 * @param {string[]} props.placeholders - An array of placeholder strings to cycle through.
 * @param {function} props.onChange - Callback function triggered when the input value changes.
 * @param {function} props.onSubmit - Callback function triggered when the form is submitted.
 * @param {boolean} [props.isButtonShown=false] - Flag to determine if the submit button should be shown.
 * @returns {JSX.Element} A form containing an animated input field with optional submit button.
 */
export function MagicInput({
  placeholders,
  onChange,
  onSubmit,
  isButtonShown = false,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isButtonShown: boolean;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  /**
   * Sets up an animation effect to cycle through placeholders
   * @param {void} No parameters
   * @returns {function} Cleanup function to clear the interval when the component unmounts
   */
  useEffect(() => {
    ```
    /**
     /**
      * Updates the current placeholder index by incrementing it and wrapping around to the beginning if necessary.
      * @param {function} setCurrentPlaceholder - React state setter function for updating the current placeholder index.
      * @returns {void} This function doesn't return a value; it updates state.
      */
     * Starts an animation that cycles through placeholders at regular intervals.
     * @returns {Function} A cleanup function that clears the animation interval when called.
     */
    ```
    const startAnimation = () => {
      /**
       * Sets up an interval to cycle through placeholders
       * @param {Function} setCurrentPlaceholder - React state setter function to update the current placeholder
       * @param {Array} placeholders - Array of placeholder strings to cycle through
       * @returns {number} Interval ID for clearing the interval if needed
       */
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 1500);
      ```
      /**
       * Cleanup function to clear the interval
       * @returns {Function} A function that clears the interval when called
       */
      
      ```      return () => clearInterval(interval);
    };

    startAnimation();
  }, [placeholders.length]);

  /**
   * Draws text on a canvas and processes the resulting image data
   * @param {void} - No parameters
   * @returns {void} This function doesn't return a value, but updates the newDataRef with processed image data
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            /**
             * Maps the newData array to create a new array of objects with modified properties
             * @param {Array} newData - An array of objects containing x, y, and color properties
             /**
              * React hook that triggers the draw function when the value or draw function changes
              * @param {function} draw - The function to be called for drawing
              * @param {any} value - The value that, when changed, triggers a redraw
              * @returns {void} This effect does not return anything
              */
             * @returns {Array} An array of objects with x, y, r, and color properties, where color is converted to rgba format
             */
            ],
          });
        /**
         * Animates particles moving across a canvas, gradually reducing their size and removing them when they reach the left side.
         * @param {number} start - The starting x-coordinate for the animation.
         * @returns {void} This function doesn't return a value, but updates the canvas and state.
         */
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    /**
     * Animates a frame by updating and rendering particles on a canvas.
     * @param {number} [pos=0] - The current horizontal position for clearing and rendering.
     * @returns {void} This function does not return a value.
     */
    const animateFrame = (pos: number = 0) => {
      /**
       * Animates and updates particles on a canvas, moving them from right to left
       * @param {number} pos - The current x-position boundary for particle animation
       * @returns {void} This function doesn't return a value, it updates the canvas and recursively calls itself
       */
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          ```
          /**
           * Renders rectangles on a canvas context based on the current data
           * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the drawing surface
           * @param {number} pos - The x-position threshold for rendering rectangles
           * @returns {void} This function does not return a value
           */
          ```
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  /**
   * Handles the keydown event for an input element, specifically for the Enter key press.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event object.
   * @returns {void} This function doesn't return a value.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  /**
   * Handles the vanish and submit action for the input.
   * This function sets the animating state, draws the current state,
   * retrieves the input value, and initiates an animation if a value exists.
   * @param {void} - This function doesn't take any parameters.
   * @returns {void} This function doesn't return a value.
   */
  /**
   * Reducer function to find the maximum x value in an array of objects
   * @param {number} prev - The current maximum x value
   * @param {Object} current - The current object being processed
   * @param {number} current.x - The x value of the current object
   * @returns {number} The new maximum x value
   */
  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
  };

  /**
   * Handles the form submission event.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event object.
   * @returns {void} This function doesn't return a value.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit && onSubmit(e);
  };
  return (
    <form
      className={cn(
        "w-full relative bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && "bg-gray-50"
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none  text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <input
        ```
        /**
         * Handles the change event for an input element
         * @param {Event} e - The change event object
         * @returns {void} This function doesn't return a value
         */
        ```
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
          animating && "text-transparent dark:text-transparent"
        )}
      />

      {isButtonShown && (
        <button
          disabled={!value}
          type="submit"
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-4 w-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%",
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%",
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>
      )}

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
