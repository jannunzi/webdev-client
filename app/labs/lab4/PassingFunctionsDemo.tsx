"use client";

import PassingFunctions from "./PassingFunctions";

export default function PassingFunctionsDemo() {
  const sayHello = () => {
    alert("Hello from Lab 4");
  };
  return <PassingFunctions theFunction={sayHello} />;
}
