import EnvClientCheck from "./EnvClientCheck";

export default function EnvDemo() {
  const message = process.env.LAB3_SERVER_MESSAGE ?? "hello from the server (fallback)";
  return (
    <div id="wd-env-demo">
      <h3>process.env</h3>
      <p>On the server: {message}</p>
      <EnvClientCheck />
    </div>
  );
}
