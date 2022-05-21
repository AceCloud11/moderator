import React from 'react';
import {
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

export default function Error({ errors }) {
  return (
    <>
      {errors.length
        ? errors.map((error) => (
            <Alert status="error" className="rounded-md my-4" key={error}>
              <AlertIcon />
              {error}
            </Alert>
          ))
        : null}
    </>
  );
}
