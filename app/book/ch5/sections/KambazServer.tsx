import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Dashboard from "@/app/(kambaz)/dashboard/page";

export default function KambazServer() {
  return (
    <Section
      id="sec-5-4"
      title="5.4 Implementing the Kambaz Node.js HTTP Server"
    >
      <p>
        Kambaz CRUD so far lived in the browser. This section moves the
        JSON &quot;database&quot; into Express and talks to it with
        axios. The next chapter stores the same collections in MongoDB
        without changing the URLs.
      </p>

      <Section
        level={3}
        id="sec-5-4-1"
        title="5.4.1 Migrating the Database to the Server"
      >
        <p>
          Create <code>Kambaz/Database</code>{" "}in the Node project.
          Copy the JSON from <SectionLink to="3.9.2" />, rename to{" "}
          <code>.js</code>, and <code>export default</code>{" "}the
          arrays. A barrel file re-exports them as one object:
        </p>
        <CodeBlock
          language="js"
          name="database"
          file="webdev-server/Kambaz/Database/index.js"
        >{`import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";
export default { courses, modules, assignments, users, enrollments };`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-5-4-2"
        title="5.4.2 Integrating the Account Screens"
      >
        <p>
          A <strong>DAO</strong>{" "}groups access by collection.{" "}
          <code>Kambaz/Users/dao.js</code>{" "}implements create, find by
          credentials, update. Routes post{" "}
          <code>/api/users/signin</code>,{" "}
          <code>/signup</code>,{" "}
          <code>/profile</code>,{" "}
          <code>/signout</code>. The React client posts credentials
          with axios and then stores the returned user (this app uses{" "}
          <code>AccountContext</code>{" "}from <ChapterLink to={4} />{" "}
          rather than a Redux slice).
        </p>
        <CodeBlock
          language="ts"
          name="account client"
          file="app/(kambaz)/account/client.ts"
        >{`import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";

const axiosWithCredentials = axios.create({ withCredentials: true });
const USERS_API = \`\${httpServer()}/api/users\`;

export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signin\`, credentials);
  return response.data;
};`}</CodeBlock>
        <OnYourOwn>
          Sign in as <code>iron_man</code>{" "}/{" "}
          <code>stark123</code>, open Profile, and confirm the name
          came from Express — not only local JSON.
        </OnYourOwn>
        <WithAI
          prompt={`Do not invent a new user. List the Users DAO functions and the four /api/users auth routes (signin, signup, profile, signout) as a short checklist matching Chapter 5.`}
        >
          Ask the assistant for the auth checklist — you still wire
          Sign in:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-4-3"
        title="5.4.3 Supporting Multiple User Sessions"
      >
        <p>
          Install <code>express-session</code>{" "}and{" "}
          <code>dotenv</code>. Configure the session{" "}
          <em>after</em>{" "}CORS and <em>before</em>{" "}
          <code>express.json()</code>{" "}and the routes. In production
          set <code>proxy</code>,{" "}
          <code>sameSite: &quot;none&quot;</code>, and{" "}
          <code>secure</code>{" "}cookies. Store{" "}
          <code>req.session.currentUser</code>{" "}on signin/signup;
          destroy the session on signout.
        </p>
        <p>
          Axios does not send cookies by default. Create{" "}
          <code>axios.create({"{ withCredentials: true }"})</code>{" "}
          and use that instance for every account and enrolled-course
          call.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-5"
        title="5.4.5 Creating a RESTful Web API for Courses"
      >
        <p>
          <code>GET /api/courses</code>{" "}lists every course.{" "}
          <code>GET /api/users/:userId/courses</code>{" "}with{" "}
          <code>userId === &quot;current&quot;</code>{" "}uses the
          session and returns enrolled courses only (401 if nobody is
          signed in). Creating a course posts to{" "}
          <code>/api/users/current/courses</code>{" "}and enrolls the
          current user. Dashboard fetches on load and after Add /
          Update / Delete.
        </p>
        <LiveDemo
          name="Dashboard"
          file="app/(kambaz)/dashboard/page.tsx"
          mode="styled"
        >
          <Dashboard />
        </LiveDemo>
        <OnYourOwn>
          Sign in, Add a course, refresh, and confirm it is still
          listed while Express is running.
        </OnYourOwn>
      </Section>

      <Section
        level={3}
        id="sec-5-4-6"
        title="5.4.6 Modules"
      >
        <p>
          Nested in the UI, flat on the server:{" "}
          <code>GET/POST /api/courses/:courseId/modules</code>,{" "}
          <code>PUT/DELETE /api/modules/:moduleId</code>. The Modules
          screen fetches on load and no longer filters a full JSON
          file in the browser.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-7"
        title="5.4.7 Assignments (On Your Own)"
      >
        <p>
          Implement assignment CRUD on Express and an assignments
          client that uses axios POST/GET/PUT/DELETE. Refactor the
          Assignments and Assignment Editor screens so creates,
          updates, and deletes survive a refresh while the server
          runs.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-8"
        title="5.4.8 Enrollments (On Your Own)"
      >
        <p>
          Routes to enroll and unenroll. An enrollments client. Changes
          persist for the life of the Node process.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-4-9"
        title="5.4.9 People Table (Optional)"
      >
        <p>
          List users enrolled in a course. Faculty can create, update,
          and delete users through a users client.
        </p>
      </Section>
    </Section>
  );
}
