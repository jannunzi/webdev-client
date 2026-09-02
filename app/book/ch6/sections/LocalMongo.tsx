import Section from "../../components/Section";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function LocalMongo() {
  return (
    <>
      <Section
        level={3}
        id="sec-6-1-1"
        title="6.1.1 Installing and Configuring MongoDB"
      >
        <p>
          Download MongoDB Community Server from{" "}
          <OfficialLink href="https://www.mongodb.com/try/download/community">
            mongodb.com
          </OfficialLink>{" "}
          for your operating system. If the installer offers to run the
          database <strong>as a service</strong>, accept it so{" "}
          <code>mongod</code> starts when you log in. On Windows, search
          Services for MongoDB. On macOS, look for the MongoDB item in
          System Settings. The service dialog can start and stop the
          process; leave it set to start automatically.
        </p>

        <Section
          level={3}
          id="sec-6-1-1-1"
          title="6.1.1.1 Installing MongoDB Manually (optional)"
        >
          <p>
            On macOS you can install the Atlas CLI and walk through a
            guided local setup:
          </p>
          <CodeBlock language="shell">{`brew install mongodb-atlas
atlas setup`}</CodeBlock>
          <p>
            Alternatively unzip the server archive and put{" "}
            <code>bin</code> on your <code>PATH</code>. On macOS, unzip
            into <code>/usr/local</code> and append a line like this to{" "}
            <code>~/.zshrc</code> or <code>~/.bash_profile</code> (your
            version number will differ):
          </p>
          <CodeBlock language="shell">{`export PATH="$PATH:/usr/local/mongodb-macos-x86_64-8.0.4/bin"`}</CodeBlock>
          <p>
            On Windows, unzip under <code>C:\Program Files</code>, open
            System Properties → Advanced → Environment Variables, edit{" "}
            <code>Path</code>, and add the <code>bin</code> folder.
            Restart the computer after changing <code>PATH</code>.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-1-1-2"
          title="6.1.1.2 Starting MongoDB from the Command Line"
        >
          <p>
            If MongoDB is installed as a service, it is already running.
            Otherwise create a data directory and start{" "}
            <code>mongod</code> with <code>--dbpath</code>:
          </p>
          <CodeBlock language="shell">{`cd ~
mkdir data
# Windows (path and version will differ)
# C:\\Program Files\\mongodb-windows-x86_64-8.0.4\\bin\\mongod --dbpath data

# macOS
# /usr/local/mongodb-macos-aarch64-8.0.4/bin/mongod --dbpath data`}</CodeBlock>
          <p>
            Include <code>--dbpath data</code> so the server knows where
            to write collections. Leave that terminal open while you work.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-1-2"
        title="6.1.2 Using MongoDB Compass to Interact with MongoDB"
      >
        <p>
          Compass is the graphical client. If the server installer did
          not add it, download it from the same MongoDB download page.
          Open it and confirm the New Connection URI is{" "}
          <code>mongodb://127.0.0.1:27017</code>. Press Connect.
        </p>
        <OnYourOwn>
          Connect Compass to localhost and leave the window open. You
          will create the database in the next subsection.
        </OnYourOwn>
        <WithAI
          prompt={`Remind me of the default Compass connection string for a local MongoDB and what port mongod listens on. Do not change any project files.`}
        >
          Ask only for the local URI — you still click Connect yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-1-3"
        title="6.1.3 Creating a MongoDB Database"
      >
        <p>
          In Compass, click the connection, then{" "}
          <strong>Create database</strong>. Name the database{" "}
          <code>kambaz</code> and the first collection{" "}
          <code>users</code>. Create Database.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-1-4"
        title="6.1.4 Inserting and Retrieving Data with Compass"
      >
        <p>
          Collections are tables; documents are records. Select{" "}
          <code>kambaz</code> → <code>users</code>, then{" "}
          <strong>ADD DATA → Insert document</strong>. Paste a user
          shaped like the objects in{" "}
          <code>app/(kambaz)/database/users.json</code> and Insert.
        </p>
        <p>
          Faster: <strong>ADD DATA → Import JSON or CSV file</strong>{" "}
          and import <code>users.json</code>, then{" "}
          <code>courses.json</code>, <code>modules.json</code>,{" "}
          <code>assignments.json</code>, and{" "}
          <code>enrollments.json</code> into matching collection names.
          Confirm the document counts match the files.
        </p>
        <OnYourOwn>
          Import all five JSON files. In Compass, open one course
          document and confirm <code>name</code> and{" "}
          <code>_id</code> look like the React database.
        </OnYourOwn>
      </Section>
    </>
  );
}
