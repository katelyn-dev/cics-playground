"use client";

import { Button, Loading } from "@lemonsqueezy/wedges";
import { type ComponentProps, type ElementRef, forwardRef, useState, useEffect } from "react";
import styles from "../styles/SubmitButton.module.css";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button>;

// eslint-disable-next-line react/display-name
export const SubmitButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const [pending, setPending] = useState(false);

    // Simulate a form status pending state change
    useEffect(() => {
      const handlePendingState = () => {
        setPending(true);
        setTimeout(() => setPending(false), 2000); // Simulate a delay for pending state
      };

      // Add event listener for form submission
      if (props.onClick) {
        props.onClick = handlePendingState;
      }

      return () => {
        if (props.onClick) {
          props.onClick = undefined;
        }
      };
    }, [props]);

    const before = pending ? (
      <Loading size="sm" className="dark" color="secondary" />
    ) : (
      props.before
    );

    return (
      <Button
        className={styles.submitButton}
        {...props}
        before={before}
        ref={ref}
        disabled={pending || props.disabled}
      />
    );
  },
);

export default SubmitButton;
