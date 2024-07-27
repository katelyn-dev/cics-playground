"use client";

import { Button, Loading } from "@lemonsqueezy/wedges";
import { type ComponentProps, type ElementRef, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import styles from "../styles/SubmitButton.module.css";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button>;

// eslint-disable-next-line react/display-name
export const SubmitButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const { pending } = useFormStatus();
    const before = pending ? (
      <Loading size="sm" className="dark" color="secondary" />
    ) : (
      props.before
    );

    return (
      <Button className={styles.submitButton}
        {...props}
        before={before}
        ref={ref}
        disabled={pending || props.disabled}
      />
    );
  },
);