import Section from "../../components/Section";
import OfficialLink from "../../components/OfficialLink";
import SectionLink from "../../components/SectionLink";
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
          To get started, download MongoDB for free from the{" "}
          <OfficialLink href="https://www.mongodb.com/try/download/community">
            MongoDB Community Server
          </OfficialLink>{" "}
          download page, selecting the latest version for your
          operating system, and click Download. Run the installer and,
          if given the choice, choose to run the database{" "}
          <strong>as a service</strong>{" "}so that you do not have to
          bother restarting the database server every time you log in
          or restart your computer. The MongoDB database will
          automatically start whenever you start your computer, which
          is the arrangement you want while you work through this
          chapter and the next assignment. On Windows, confirm the
          database is running by searching for MongoDB in the Services
          dialog. On macOS, confirm the database is running by clicking
          the MongoDB icon in the System Settings dialog. The service
          dialog gives you controls to start and stop the database, but
          it should already be configured to start automatically when
          you restart your computer. Leave the service set to start
          automatically unless you are deliberately experimenting with{" "}
          <code>mongod</code>{" "}from the command line in the next
          optional subsection.
        </p>

        <Section
          level={3}
          id="sec-6-1-1-1"
          title="6.1.1.1 Installing MongoDB Manually (optional)"
        >
          <p>
            On macOS you can install MongoDB using Homebrew by typing
            the following at the command line. The Atlas CLI walkthrough
            can also stand up a local sandbox if you prefer not to
            manage a downloaded archive yourself:
          </p>
          <CodeBlock language="shell">{`brew install mongodb-atlas
atlas setup`}</CodeBlock>
          <p>
            Alternatively you can unzip the MongoDB server from the
            downloaded archive to a local file system and add the right
            commands to your operating system{" "}
            <code>PATH</code>{" "}environment variable. On macOS, unzip
            the file into <code>/usr/local</code>{" "}which creates a
            directory such as{" "}
            <code>/usr/local/mongodb-macos-x86_64-8.0.4</code>{" "}(your
            version might differ). To be able to execute the database
            related commands, add the path to the{" "}
            <code>.bash_profile</code>{" "}or <code>.zshrc</code>{" "}file
            located in your home directory. Add the following line in
            the configuration file as shown below. Your actual version
            might differ.
          </p>
          <CodeBlock language="shell">{`# ~/.bash_profile or ~/.zshrc
export PATH="$PATH:/usr/local/mongodb-macos-x86_64-8.0.4/bin"`}</CodeBlock>
          <p>
            If the <code>.bash_profile</code>{" "}or{" "}
            <code>.zshrc</code>{" "}file does not exist in your home
            directory, create it as a plain text file, but with no
            extensions and a period in front of it. Configure it as
            shown above and then restart your computer so the shell
            picks up the new path. After the restart,{" "}
            <code>which mongod</code>{" "}should print a path under that{" "}
            <code>bin</code>{" "}directory.
          </p>
          <p>
            On Windows, unzip the file into{" "}
            <code>C:\Program Files</code>. To configure environment
            variables on Windows press the Windows + R key combination
            to open the Run prompt, type <code>sysdm.cpl</code>{" "}and
            press OK. In the System Properties window that appears,
            press the Advanced tab and then the Environment Variables
            button. In the Environment Variables configuration window
            select the Path variable and press the Edit button. Copy
            and paste the path of the <code>bin</code>{" "}directory in
            the mongodb directory you unzipped, for example{" "}
            <code>C:\Program Files\mongodb-windows-x86_64-8.0.4\bin</code>
            . The actual path might differ. Press OK and restart the
            computer so every new terminal session can find{" "}
            <code>mongod</code>{" "}and <code>mongosh</code>.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-1-1-2"
          title="6.1.1.2 Starting MongoDB from the Command Line"
        >
          <p>
            If you installed MongoDB as a service, it is already
            running in the background and can be configured and
            restarted in Windows from the Services dialog or from
            System Settings on macOS. Alternatively you can start the
            MongoDB server from the command line using the{" "}
            <code>mongod</code>{" "}executable in the{" "}
            <code>bin</code>{" "}directory where you installed MongoDB.
            First you will need to create a data folder where the
            server will store all its data. You can create a data
            folder in your home directory as shown below.
          </p>
          <CodeBlock language="shell">{`cd ~
mkdir data`}</CodeBlock>
          <p>
            When you start MongoDB, you will need to tell it where the
            data folder is with the <code>dbpath</code>{" "}option. If
            you installed MongoDB on Windows under Program Files, you
            can start MongoDB from your home directory as shown below.
            Make sure to include the <code>--dbpath data</code>{" "}option
            to tell MongoDB where to find the data directory. Leave
            that terminal open while you work; closing it stops the
            process unless the installer registered a service.
          </p>
          <CodeBlock language="shell">{`cd ~
# Windows (path and version will differ)
# C:\\Program Files\\mongodb-windows-x86_64-8.0.4\\bin\\mongod --dbpath data

# macOS
# /usr/local/mongodb-macos-aarch64-8.0.4/bin/mongod --dbpath data`}</CodeBlock>
          <p>
            If you installed MongoDB on macOS in{" "}
            <code>/usr/local</code>, the second command is the one you
            want. The version folder name changes with each release;
            copy the path you actually unzipped rather than the sample
            numbers. Once <code>mongod</code>{" "}prints that it is
            waiting for connections on port 27017, Compass and later
            Mongoose can reach it.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-1-2"
        title="6.1.2 Using MongoDB Compass to Interact with MongoDB"
      >
        <p>
          Your installation should have installed{" "}
          <OfficialLink href="https://www.mongodb.com/products/tools/compass">
            MongoDB Compass
          </OfficialLink>
          , a user interface client to the MongoDB database. If not,
          MongoDB Compass can be downloaded from MongoDB&apos;s
          download page. You can start Compass from your applications
          folder, or search for it in your operating system&apos;s
          search feature. On macOS bring up Spotlight by pressing the
          magnifying glass on the top right menu bar, or press Command
          and Spacebar. Type MongoDB Compass in the search bar and
          select the application from the result list. On Windows press
          the Windows key to bring up the search field, type MongoDB
          Compass, and select the application from the result list.
          When Compass comes up, confirm that the connection string{" "}
          <code>mongodb://127.0.0.1:27017</code>{" "}appears in the New
          Connection screen, and press Connect to connect to MongoDB.
          That URI is the same host and port Mongoose will use in{" "}
          <SectionLink to="6.2.1" />{" "}when the Node server talks to
          the local instance. If Connect fails, go back to the service
          dialog or the <code>mongod</code>{" "}terminal and confirm the
          process is actually listening before you try again.
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
          Once connected to a running MongoDB server, click on the
          connection on the left sidebar and then click the Create
          database button in the tab on the right. In the Create
          Database dialog that appears, name your database{" "}
          <code>kambaz</code>{" "}and your first collection as{" "}
          <code>users</code>. Click Create Database to create the{" "}
          <code>kambaz</code>{" "}database. MongoDB creates a database
          when the first collection is created, so you always supply
          both names together. The collection can start empty; the next
          subsection inserts documents by hand and then imports the
          JSON files you already used for Kambaz. Keep the name{" "}
          <code>kambaz</code>{" "}exactly, because the connection string
          in <SectionLink to="6.2.1" />{" "}ends with{" "}
          <code>/kambaz</code>{" "}and Atlas later expects the same path
          segment between the last slash and the question mark.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-1-4"
        title="6.1.4 Inserting and Retrieving Data with Compass"
      >
        <p>
          In MongoDB, data is organized into collections, which are
          analogous to tables in relational databases. Data contained
          in collections are referred to as documents, which are
          analogous to records in relational databases. To create, or
          insert, documents into a collection in a MongoDB database
          using Compass, select the database on the left sidebar and
          then select the collection to insert documents into. For
          instance, select the <code>kambaz</code>{" "}database and then
          the <code>users</code>{" "}collection. On the right side,
          select ADD DATA and then Insert document. In the Insert
          Document dialog that appears, paste a user shaped like the
          objects in{" "}
          <code>app/(kambaz)/database/users.json</code>{" "}from{" "}
          <SectionLink to="3.9.2" />{" "}— an <code>_id</code>,{" "}
          <code>username</code>, <code>password</code>,{" "}
          <code>firstName</code>, <code>lastName</code>,{" "}
          <code>role</code>, and the other fields the Account screens
          already display. Click Insert to insert the document and
          confirm the document inserted as expected. Compass shows the
          new row in the Documents tab; you can expand it to inspect
          every field.
        </p>
        <p>
          Instead of inserting one document at a time, entire JSON
          files can be imported all at once. Import the{" "}
          <code>users.json</code>{" "}file we used in earlier chapters
          under the Database directory of the React project. To import,
          click ADD DATA, but now select Import JSON or CSV file.
          Navigate to the location of <code>users.json</code>, select
          the file, and click Import. Confirm the users are imported.
          Also find the following collections and import the JSON files
          linked to each of the collection names. Confirm all
          collections are imported: <code>modules.json</code>,{" "}
          <code>assignments.json</code>, <code>courses.json</code>,
          and <code>enrollments.json</code>. Create a collection for
          each file if Compass does not already list it, then import
          into that collection so the names match the Mongoose{" "}
          <code>collection</code>{" "}options you will write in{" "}
          <SectionLink to="6.2.3" />{" "}and <SectionLink to="6.4" />.
          Confirm the document counts match the files. Open one course
          document and confirm <code>name</code>{" "}and{" "}
          <code>_id</code>{" "}look like the React database; those
          string identifiers are why the user schema later declares{" "}
          <code>_id</code>{" "}as a <code>String</code>{" "}instead of
          letting MongoDB invent ObjectIds.
        </p>
        <OnYourOwn>
          Import all five JSON files. In Compass, open one course
          document and confirm <code>name</code>{" "}and{" "}
          <code>_id</code>{" "}look like the React database.
        </OnYourOwn>
      </Section>
    </>
  );
}
