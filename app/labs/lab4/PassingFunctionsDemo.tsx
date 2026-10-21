"use client";

import PassingFunctions from "./PassingFunctions";

export default function PassingFunctionsDemo() {
  const sayHello = (message: string) => {
    alert(message);
  };
  return <PassingFunctions message="Hello from Lab 4" theFunction={sayHello} />;
}
