import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function Atlas() {
  return (
    <Section
      id="sec-6-3"
      title="6.3 Integrating with MongoDB Hosted in Atlas Cloud Service"
    >
      <p>
        When you run your server on your development environment, it
        should be connecting to a MongoDB instance running on the same
        local development computer. When you deploy the server on a
        remote server such as{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>
        , Heroku, or AWS, the address{" "}
        <code>127.0.0.1:27017</code>{" "}is the virtual machine itself —
        empty, with no <code>kambaz</code>{" "}database and no Compass
        documents. The remote Express process needs to connect to a
        database that is also hosted on a public site.{" "}
        <OfficialLink href="https://www.mongodb.com/atlas">
          MongoDB Atlas
        </OfficialLink>{" "}
        Cloud Service provides a hosted database service where MongoDB
        instances run on public servers, and they provide a connection
        string to integrate our Node.js application. This section
        describes setting up and deploying the database online and
        then integrating with it from our Node.js server running on
        Render. You will create a free cluster, connect Compass to it
        so you can import the same JSON files, open Network Access so
        Render&apos;s IPs can reach the cluster, copy a Node.js
        connection string that includes the{" "}
        <code>/kambaz</code>{" "}path, and store that string as{" "}
        <code>DATABASE_CONNECTION_STRING</code>{" "}on a{" "}
        <strong>new</strong>{" "}Render service so you do not overwrite
        the Chapter 5 assignment while TAs are still grading.
      </p>

      <Section
        level={3}
        id="sec-6-3-1"
        title="6.3.1 Setting up MongoDB Atlas"
      >
        <p>
          To get started, head over to{" "}
          <OfficialLink href="https://www.mongodb.com/">
            mongodb.com
          </OfficialLink>{" "}
          and click on Sign in at the top right corner. Login with
          your Google account or click on Sign Up to create an account
          with an email and password. If you get a validation email,
          confirm it and login. Answer any general questions if asked
          during the sign up process. In the Deploy your cluster
          screen choose a <strong>Free</strong>{" "}plan for now which
          should be enough for this course. Name your cluster{" "}
          <code>Kambaz</code>. In the Provider section, choose any of
          the cloud providers and in the Region section choose a
          region close to your geographic area, for instance AWS and
          North Virginia, and then click Create Deployment. In the
          Connect to Kambaz screen, in the Create a database user
          section, create credentials to login to your database. In
          the Username and Password fields, type credentials you will
          remember later since these are the credentials Mongoose will
          use to login to the database from your Node.js server
          application when running on Render or Heroku. If you forget
          these credentials you will need to create new ones later.
          Jose&apos;s example was <code>giuseppi</code>{" "}and a
          password you should <em>not</em>{" "}commit to GitHub or paste
          into the book. Click Create Database User and keep those
          values in a password manager; the connection string you copy
          next will embed them.
        </p>

        <Section
          level={3}
          id="sec-6-3-1-1"
          title="6.3.1.1 Connecting to a Remote Database from Compass"
        >
          <p>
            Then click the Choose a connection method button, and in
            Access your data through tools, select Compass. In the
            Connecting with MongoDB Compass screen, in the Copy the
            connection string, then open MongoDB Compass section, copy
            the connection string which should look something like the
            sample below. The host will differ; the important pieces
            are the <code>mongodb+srv://</code>{" "}scheme, your
            database username, the password, and the cluster hostname
            Atlas assigned.
          </p>
          <CodeBlock language="shell">{`mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`}</CodeBlock>
          <p>
            Click Done. From Compass select Connect, New Window, paste
            the connection string in the URI field, and then click
            Connect. Compass is now talking to the cloud cluster, not
            to <code>127.0.0.1</code>. Following the same steps used
            earlier in <SectionLink to="6.1.4" />, create a{" "}
            <code>kambaz</code>{" "}database if Atlas did not already
            create one, then import the <code>courses</code>,{" "}
            <code>modules</code>, <code>users</code>,{" "}
            <code>assignments</code>, and{" "}
            <code>enrollments</code>{" "}JSON files into the remote
            database. Confirm the document counts match what you see
            on localhost. You now have two Compass connections: one
            local for development, one remote for the deployed server.
            Edits you make against localhost do not appear on Atlas
            until you import or until your Node app writes through the
            Atlas URI.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-3-1-2"
          title="6.3.1.2 Connecting from Node.js"
        >
          <p>
            In the Atlas main window click on Network Access and in
            the Network Access screen IP Access List tab, select + ADD
            IP ADDRESS. In the Add IP Access List Entry dialog click
            on ALLOW ACCESS FROM ANYWHERE. This will add{" "}
            <code>0.0.0.0/0</code>{" "}to the Access List Entry,
            allowing any computer to connect — including the changing
            outbound IPs of a free Render service. Click Confirm and
            verify the new entry appears in the Network Access screen.
            Without this entry, Mongoose on Render will hang or refuse
            the connection even if the password is correct. Click
            Database on the left and in the Clusters screen, click
            Connect. In the Connect to Kambaz dialog, in Connect to
            your application, select Drivers and version section,
            confirm the Driver is set to Node.js and Version is set to
            5.5 or later. In the Add your connection string into your
            application code section, copy the URL. It should look
            similar to the following.
          </p>
          <CodeBlock language="shell">{`mongodb+srv://giuseppi:<password>@kambaz.jxui0bc.mongodb.net/kambaz?retryWrites=true&w=majority&appName=Kambaz`}</CodeBlock>
          <p>
            Note: the <code>DATABASE_CONNECTION_STRING</code>{" "}
            environment variable must include the name of the database
            at the end of the path, for example between the last slash
            (<code>/</code>) and the question mark (
            <code>?</code>). The sample above highlights{" "}
            <code>kambaz</code>{" "}in that position. If you omit the
            path, Mongoose may connect to the cluster but write to the
            default <code>test</code>{" "}database instead of the
            collections you imported, and Dashboard will look empty
            even though Compass shows documents under{" "}
            <code>kambaz</code>. Replace{" "}
            <code>&lt;password&gt;</code>{" "}with the actual password
            created in an earlier step. Do not commit that completed
            URI.
          </p>
          <p>
            Commit and push your code to a branch called{" "}
            <code>a6</code>{" "}and deploy the server application to a{" "}
            <strong>new</strong>{" "}remote service running on Render,
            Heroku, or AWS. Make sure not to deploy to the server for
            prior chapters since TAs might still be grading it. Do not
            overwrite the Chapter 5 <code>a5</code>{" "}Render URL. In
            the new remote server, configure an environment variable
            called <code>DATABASE_CONNECTION_STRING</code>{" "}with the
            URL value above. For instance, in the Render dashboard
            click on Environment, type{" "}
            <code>DATABASE_CONNECTION_STRING</code>{" "}in the Key field
            and the URL in the Value field. Commit and deploy the
            React application to a new <code>a6</code>{" "}branch on{" "}
            <OfficialLink href="https://vercel.com/">
              Vercel
            </OfficialLink>
            . Configure{" "}
            <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}to point to the new
            remote Express origin, with no trailing slash. For the
            environment variables to take effect, you might need to
            redeploy and/or restart the remote Node server on Render
            as well as the remote React application on Vercel.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-3-2"
        title="6.3.2 Configuring Session in Remote Servers"
      >
        <p>
          The local Node server was configured to support multiple
          sessions. Similarly, the remote server also needs to be
          configured to support sessions so Sign in still stores{" "}
          <code>currentUser</code>{" "}in a cookie that the Vercel app
          can send back. In Render.com, navigate to the Environment
          section of the application dashboard. Click Add Environment
          Variable, type the name of the variables in the Key column
          and the variable&apos;s value in the Value column. Repeat
          for each of the environment variables as shown below. When
          environment variables change, the server must be restarted
          by clicking Manual Deploy and then Deploy latest commit.
          Below is an example of the environment variables used to
          configure a remote server running on Render.com. Use the
          same Environment Variable keys shown on the left. Do not use
          the sample values on the right. Instead use the values for
          your Mongo database, your Vercel remote server, and your
          remote Node server. Note: <code>SERVER_URL</code>{" "}should
          not start with <code>https://</code>; remove it if present.
        </p>
        <CodeBlock language="shell">{`DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority
CLIENT_URL=https://your-a6-preview.vercel.app
SERVER_URL=your-webdev-server.onrender.com
SERVER_ENV=production
SESSION_SECRET=a long random phrase`}</CodeBlock>
        <p>
          <code>CLIENT_URL</code>{" "}must be the Vercel origin of the{" "}
          <code>a6</code>{" "}deployment so CORS and the session cookie{" "}
          <code>sameSite</code>{" "}settings you configured in Chapter
          5 accept the browser. <code>SERVER_ENV=production</code>{" "}
          is what turns on secure cookies. After Render finishes the
          manual deploy, open the Vercel <code>a6</code>{" "}URL, sign
          in, and confirm Dashboard lists courses from Atlas. If Sign
          in fails with a network error, check that{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>{" "}on Vercel matches the
          new Render hostname and that you redeployed Vercel after
          changing it.
        </p>
        <OnYourOwn>
          Create the free Atlas cluster and copy the Drivers URI with{" "}
          <code>kambaz</code>{" "}in the path. Do not paste the password
          into the book or a commit.
        </OnYourOwn>
        <WithAI
          prompt={`Check webdev-server/.env.example lists DATABASE_CONNECTION_STRING, CLIENT_URL, SERVER_URL, SERVER_ENV, and SESSION_SECRET. Do not add real credentials.`}
        >
          Ask the assistant to confirm the env keys only:
        </WithAI>
      </Section>
    </Section>
  );
}
